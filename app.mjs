import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import request from 'request';
import sanitize from 'mongo-sanitize';
import './db.mjs';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import path from 'path';
import * as dotenv from 'dotenv';
import { startAuthenticatedSession, endAuthenticatedSession } from './auth.mjs';
import aiLogRoutes from './routes/aiLogApi.mjs';
import draftRoutes from './routes/draftLogApi.mjs';
import aiPaintPromptsData from './routes/aiPaintPromptsData.mjs';
import exampleQuestion from './routes/exampleQuestion.mjs';
import aiFetch from './routes/aiFetchApi.mjs';
import loginApi from './routes/loginApi.mjs';
import editUserPhoneApi from './routes/editUserPhoneApi.mjs';
import getAIPaint from './routes/getAIPaintApi.mjs';
import vTuberLogin from './routes/vTuberLoginApi.mjs';
import sms from './routes/sms.js'
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
// import url from 'url';
// import { Agent } from 'http';

dotenv.config();


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public'))); // serve static files
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', aiLogRoutes);
app.use('/api', draftRoutes);
app.use('/api', aiPaintPromptsData);
app.use('/api', exampleQuestion);
app.use('/api', aiFetch);
app.use('/api', loginApi);
app.use('/api', editUserPhoneApi);
app.use('/api', getAIPaint);
app.use('/api', vTuberLogin);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

const User = mongoose.model('User');
const AIPaintPrompts = mongoose.model('AIPaintPrompts');
const Agent = mongoose.model('Agent');
const ExampleQuestion = mongoose.model('ExampleQuestions');
const UserPhone = mongoose.model('UserPhone');
const AIPaintRecord = mongoose.model('AIPaintRecord');


// middelware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // console.log('User Loged In', req.session.user)
    next();
  } else {
    console.log('User Not Loged In')
    res.redirect('/');
  }
};

// middelware to check if user is authenticated as agent
const isAuthenticatedAsAgent = (req, res, next) => {
  if (req.session.user) {
    // console.log('User Loged In', req.session.user)
    if (req.session.user.type === 'agent') {
      next();
    } else {
      res.redirect('/');
    }
  } else {
    console.log('User Not Loged In')
    res.redirect('/');
  }
}

// middelware to check if user is not authenticated, so authenticated user cannot access login and register page
const isNotAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // console.log('User Loged In', req.session.user)
    // send user a message: you are already logged in, and redirect to home page
    res.redirect('/aiMainPageModel1');
  } else {
    next();
  }
};

app.get('/', async (req, res) => {

  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  console.log('rendering index');
  res.render('login', { layout: false, user: req.session.user, isAgent, isUser });
});

app.get('/agentIndex', isAuthenticatedAsAgent, async (req, res) => {
  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  console.log('rendering agentIndex');
  res.render('agentIndex', { user: req.session.user, isAgent, isUser });
});


// app.get('/userLogin', isNotAuthenticated, async (req, res) => {
//   let isAgent = false;
//   let isUser = false;

//   if (req.session.user) {
//     // console.log('user is logged in');
//     isAgent = req.session.user.type === 'agent' ? true : false;
//     isUser = req.session.user.type === 'user' ? true : false;
//   }
//   res.render('userLogin', { user: req.session.user, isAgent, isUser });
// });

// app.get('/login', isNotAuthenticated, async (req, res) => {
//   let isAgent = false;
//   let isUser = false;
//   if (req.session.user) {
//     // console.log('user is logged in');
//     isAgent = req.session.user.type === 'agent' ? true : false;
//     isUser = req.session.user.type === 'user' ? true : false;
//   }
//   res.render('login', { layout: false, user: req.session.user, isAgent, isUser });
// });

app.post('/postPhoneNumber', async (req, res) => {
  console.log('getPhoneNumber');
  // sintize phone number
  const phoneNumber = sanitize(req.body.phoneNumber);
  // check if the user's number is in the userPhone database
  try {
    const userPhone = await UserPhone.findOne({ 'phoneNumber': phoneNumber });
    // console.log('userPhone:', userPhone);
    if (userPhone) {
      // if the user's number is in the userPhone database, send the user a verification code
      sms.send(phoneNumber);
      res.json({ success: true });
    } else {
      // if the user's number is not in the userPhone database, inform the user to register
      res.json({ success: false, message: 'not_register' });
    }
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

app.post('/checkVerificationCode', async (req, res) => {
  // console.log('checkVerificationCode');
  // sintize phone number and verification code
  const phoneNumber = sanitize(req.body.phoneNumber);
  const verificationCode = sanitize(req.body.verificationCode);
  // console.log('phoneNumber:', phoneNumber);
  // console.log('verificationCode:', verificationCode);
  // check if the verification code is correct
  const isMatch = sms.verify(phoneNumber, verificationCode);
  const user = await UserPhone.findOne({ 'phoneNumber': phoneNumber });
  // console.log('isMatch:', isMatch);
  // if match, authenticate user
  if (isMatch) {
    const userSession = {
      userId: user._id,
      username: phoneNumber,
      nickName: user.nick_name,
      type: user.type,
    };
    await startAuthenticatedSession(req, userSession); // start session
    res.json({ success: true });
  } else {
    // if not match, send user a message and redirect to login page
    res.json({ success: false, message: 'wrong_verification_code' });
  }
});

app.get('/addUserPhone', isAuthenticatedAsAgent, async (req, res) => {
  // render to userRegister
  let isAgent = false;
  let isUser = false;

  // console.log('addUserPhone');

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }

  const userPhoneAgent = await UserPhone.find({ type: 'agent' });
  const userPhoneUser = await UserPhone.find({ type: 'user' });
  // { req.session.user, isAgent, isUser; }
  res.render('addUserPhone', { user: req.session.user, isAgent, isUser, userPhoneAgent, userPhoneUser });
});



app.get('/agentLogin', isNotAuthenticated, async (req, res) => {
  let isAgent = false;
  let isUser = false;
  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  res.render('agentLogin', { user: req.session.user, isAgent, isUser });
});

// app.get('/userRegister', async (req, res) => {
//   // render to userRegister
//   let isAgent = false;
//   let isUser = false;

//   if (req.session.user) {
//     // console.log('user is logged in');
//     isAgent = req.session.user.type === 'agent' ? true : false;
//     isUser = req.session.user.type === 'user' ? true : false;
//   }
//   // { req.session.user, isAgent, isUser; }
//   res.render('userRegister', { user: req.session.user, isAgent, isUser });
// });

// app.get('/agentRegister', async (req, res) => {
//   // render to userRegister
//   let isAgent = false;
//   let isUser = false;

//   if (req.session.user) {
//     // console.log('user is logged in');
//     isAgent = req.session.user.type === 'agent' ? true : false;
//     isUser = req.session.user.type === 'user' ? true : false;
//   }
//   // { req.session.user, isAgent, isUser; }
//   res.render('agentRegister', { user: req.session.user, isAgent, isUser });
// });

// app.post('/userLogin', isNotAuthenticated, async (req, res) => {
//   const username = sanitize(req.body.username);
//   const password = sanitize(req.body.password);

//   try {
//     const user = await User.findOne({ username }); // find user by username
//     if (!user) {
//       // if username does not exist, render login page with error message
//       res.render('userLogin', { message: 'Invalid username or password' });
//       return;
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.render('userLogin', { message: 'Invalid username or password' });
//       return;
//     }
//     // TODO: implement authentication
//     const userSession = {
//       userId: user._id,
//       username: phoneNumber,
//       nickName: user.nick_name,
//       type: user.type,
//     };

//     await startAuthenticatedSession(req, userSession);

//     res.redirect('/');
//   } catch (err) {
//     if (err instanceof mongoose.Error.ValidationError) {
//       res.render('userLogin', { message: err.message });
//     } else {
//       throw err;
//     }
//   }
// });

app.post('/agentLogin', isNotAuthenticated, async (req, res) => {
  const username = sanitize(req.body.username);
  const password = sanitize(req.body.password);

  try {
    const user = await User.findOne({ username }); // find user by username
    if (!user) {
      // if username does not exist, render login page with error message
      res.render('userLogin', { message: 'Invalid username or password' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.render('agentLogin', { message: 'Invalid username or password' });
      return;
    }
    // TODO: implement authentication
    const user_token = 12345; // generate token, test only

    const userSession = {
      userId: user._id,
      user_token: user_token,
      username: '13888761178',
      type: 'agent',
    };

    await startAuthenticatedSession(req, userSession);

    res.redirect('/agentIndex');
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.render('agentLogin', { message: err.message });
    } else {
      throw err;
    }
  }
});

// app.post('/userRegister', isNotAuthenticated, async (req, res) => {
//   const username = sanitize(req.body.username);
//   const password = sanitize(req.body.password);
//   const confirmPassword = sanitize(req.body.confirmPassword);
//   try {
//     // check if user is already taken
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.render('userRegister', { message: 'Username is already taken' });
//     }
//     // check if password and confirm password match
//     if (password !== confirmPassword) {
//       return res.render('userRegister', { message: 'Passwords do not match' });
//     }
//     // generate salt and hash
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//     // create user
//     const newUser = new User({
//       username,
//       password: hash,
//     });
//     // await newUser.save(); use try catch to catch the error
//     try {
//       await newUser.save();
//     } catch (err) {
//       console.log('ERROR: ', err);
//     }

//     // authenticate user
//     const userSession = {
//       userId: newUser._id,
//       username: newUser.username,
//       type: 'user',
//     };
//     await startAuthenticatedSession(req, userSession); // start session
//     res.redirect('/');

//   } catch (err) {
//     if (err instanceof mongoose.Error.ValidationError) {
//       res.render('userRegister', { message: err.message });
//     } else {
//       throw err;
//     }
//   }
// });

// app.post('/agentRegister', isNotAuthenticated, async (req, res) => {
//   console.log('agentRegister');
//   const username = sanitize(req.body.username);
//   const password = sanitize(req.body.password);
//   const confirmPassword = sanitize(req.body.confirmPassword);
//   try {
//     // check if user is already taken
//     const existingUser = await Agent.findOne({ username });
//     console.log('existingUser:', existingUser);
//     if (existingUser) {
//       console.log('Username is already taken');
//       return res.render('agentRegister', { message: 'Username is already taken' });
//     }
//     // check if password and confirm password match
//     if (password !== confirmPassword) {
//       return res.render('agentRegister', { message: 'Passwords do not match' });
//     }
//     // generate salt and hash
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//     // create user
//     const newAgent = new Agent({
//       username,
//       password: hash,
//     });
//     // await newUser.save(); use try catch to catch the error
//     try {
//       await newAgent.save();
//     } catch (err) {
//       console.log('ERROR: ', err);
//     }

//     const user_token = 12345; // generate token, test only

//     // authenticate user
//     const agentSession = {
//       agentId: newAgent._id,
//       user_token: user_token,
//       username: newAgent.username,
//       type: 'agent',
//     };
//     await startAuthenticatedSession(req, agentSession); // start session
//     res.redirect('/');

//   } catch (err) {
//     if (err instanceof mongoose.Error.ValidationError) {
//       res.render('agentRegister', { message: err.message });
//     } else {
//       throw err;
//     }
//   }
// });

app.post('/logout', async (req, res) => {
  // console.log("logout")
  await endAuthenticatedSession(req);
  res.redirect('/');
});

app.get('/aiMainPage', isAuthenticated, async (req, res) => {
  // console.log('aiMainPage');
  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  res.render('aiMainPage', { user: req.session.user, isAgent, isUser });
});

app.get('/aiMainPageModel1', isAuthenticated, async (req, res) => {
  // console.log('aiMainPage');
  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  res.render('aiMainPageModel1', { user: req.session.user, isAgent, isUser });
});

app.get('/draftMainPage', isAuthenticated, async (req, res) => {
  // console.log('draftMainPage');
  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  res.render('draftMainPage', { user: req.session.user, isAgent, isUser });
});

app.get('/vtuberMainPage', isAuthenticated, async (req, res) => {
  // console.log('vtuberMainPage');

  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  res.render('vtuberMainPage', { user: req.session.user, isAgent, isUser });
});

app.get('/aiPaintMainPage', isAuthenticated, async (req, res) => {
  // console.log('vtuberMainPage');
  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  res.render('aiPaintMainPage', { user: req.session.user, isAgent, isUser });
});

app.get('/addAIPaintPrompts', isAuthenticatedAsAgent, async (req, res) => {

  let isAgent = false;
  let isUser = false;
  let aiPaintPrompts;
  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
    try {
      aiPaintPrompts = await AIPaintPrompts.find({});
      // reverse it
      aiPaintPrompts.reverse();
      // console.log('aiPaintPrompts:', aiPaintPrompts);
    } catch (err) {
      console.log('ERROR: ', err);
    }
  }
  res.render('addAIPaintPrompts', { aiPaintPrompts, user: req.session.user, isAgent, isUser });
});

app.get('/addExampleQuestion', isAuthenticatedAsAgent, async (req, res) => {
  let isAgent = false;
  let isUser = false;
  let exampleQuestions;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    try {
      exampleQuestions = await ExampleQuestion.find({});
      // reverse it
      exampleQuestions.reverse();
    } catch (err) {
      console.log('!!ERROR: ', err);
    }
  }

  // console.log('exampleQuestions:', exampleQuestions);
  res.render('addExampleQuestion', { exampleQuestions, user: req.session.user, isAgent, isUser });
});


app.get('/aiAgentPage', isAuthenticatedAsAgent, async (req, res) => {
  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  res.render('aiAgentPage', { user: req.session.user, isAgent, isUser });
});

app.get('/draftAgentPage', isAuthenticatedAsAgent, async (req, res) => {
  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }
  res.render('aiAgentPage', { user: req.session.user, isAgent, isUser });
});

app.get('/aiPaintRecord', isAuthenticatedAsAgent, async (req, res) => {
  let isAgent = false;
  let isUser = false;

  if (req.session.user) {
    // console.log('user is logged in');
    isAgent = req.session.user.type === 'agent' ? true : false;
    isUser = req.session.user.type === 'user' ? true : false;
  }

  const aiPaintRecord = await AIPaintRecord.find({}).sort({ time: -1 });
  res.render('aiPaintRecord', { user: req.session.user, isAgent, isUser, aiPaintRecord });
});


app.post('/admin/sendAccessToken', isAuthenticated, async (req, res) => {
  try {
    // console.log('sendAccessToken');
    // console.log('req.session.user:', req.session.user);
    const userSession = req.session.user;
    // console.log('userSession:', userSession);
    const userPhone = userSession.username;
    const userId = userSession.userId;

    const user = await UserPhone.findOne({ 'phoneNumber': userPhone }).exec();
    if (user) {
      const content = {
        userId,
        userPhone,
      };
      const secretOrPrivateKey = "Do_you_hear_the_people_sing"
      const token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 60 * 60 * 24 * 7  // expires in 7 days
      });
      // save token to database
      user.access_token = token;
      await user.save();
      // print the entire response object

      // try {
      //   console.log('sending request');
      // curl -X POST "https://hongqiplus.wengegroup.com/artificial_intelligence_anchor/thirdParty/login" -H "ticket: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGYwMGJjMDQxYzA5ODg3YmM5ZDc0OTMiLCJ1c2VyUGhvbmUiOiIxODk4MzAwMjY1MyIsImlhdCI6MTY5MzQ2NzI2NiwiZXhwIjoxNjk0MDcyMDY2fQ.n6hRmd22V2qYAijfZBf6UC2xi2d0TpkSxAg2xnTJIU4" -H "appId: ichongqing"
      // content length: 0
      // connection: keep-alive
      // User-Agent: Apache-HttpClient/4.5.14(Java/17.8.8)
      // Accept-Encoding: br,deflate,gzip,x-gzip

      // const response = await fetch('https://hongqiplus.wengegroup.com/artificial_intelligence_anchor/thirdParty/login', {
      //   method: 'POST',
      //   headers: {
      //     'ticket': token,
      //     'appId': 'ichongqing',
      //   },
      // });
      // const data = await response.json();
      // console.log(data);
      // } catch (error) {
      //   console.log('Error sending request:', error.message);
      // }

      res.send({ 'status': 1, access_token: token });
    } else {
      res.send({ 'status': 0, 'msg': 'User not found' });
    }
  } catch (err) {
    console.log('ERROR: ', err);
    res.status(500).send();
  }
});

// curl -X POST "https://hongqiplus.wengegroup.com/artificial_intelligence_anchor/thirdParty/login" -H "ticket: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGYwMGJjMDQxYzA5ODg3YmM5ZDc0OTMiLCJ1c2VyUGhvbmUiOiIxODk4MzAwMjY1MyIsImlhdCI6MTY5MzQ2NzI2NiwiZXhwIjoxNjk0MDcyMDY2fQ.n6hRmd22V2qYAijfZBf6UC2xi2d0TpkSxAg2xnTJIU4" -H "appId: ichongqing"

// verify access token
// admin/checkUser/value?token={token appears here}
app.get('/valid', async (req, res) => {
  try {
    // const ticket = req.query.ticket; // Use req.query to access query parameters
    console.log('ticket:', ticket);

    let secretOrPrivateKey = "Do_you_hear_the_people_sing"

    jwt.verify(ticket, secretOrPrivateKey, function (err, decode) {
      if (err) { // out of time || invalid token
        console.log('ERROR: ', err);
        res.send({ 'status': 0, 'msg': 'invalid token' });
      } else {
        // send a json object with user id and user phone number
        res.send({ 'status': 1, 'msg': 'valid token', 'userId': decode.userPhone, 'nickName': decode.userId });
      }
    });
  }
  catch (err) {
    console.log('ERROR: ', err);
    res.status(500).send();
  }
});

app.post('/valid', async (req, res) => {
  console.log('valid');
  try {
    const ticket = req.query.ticket; // Use req.body to access the request body
    // console.log('ticket:', ticket);

    let secretOrPrivateKey = "Do_you_hear_the_people_sing"

    jwt.verify(ticket, secretOrPrivateKey, async function (err, decode) {
      if (err) { // out of time || invalid token
        console.log('ERROR: ', err);
        res.send({ 'status': 0, 'msg': 'invalid token' });
      } else {

        const userPhone = decode.userPhone;
        const user = await UserPhone.findOne({ 'phoneNumber': userPhone }).exec();
        if (user.access_token === ticket) {
          user.access_token = '';
          await user.save();
          res.send({ 'status': 1, 'msg': 'valid token', 'userId': decode.userPhone, 'nickName': decode.userId });
        } else {
          res.send({ 'status': 0, 'msg': 'invalid token' });
        }
      }
    });
  }
  catch (err) {
    console.log('ERROR: ', err);
    res.status(500).send();
  }
});

const styleToUse = ['综合模型', '探索无限', '古风', '二次元', '写实风格', '浮世绘', 'low poly', '未来主义', '像素风格', '概念艺术', '赛博朋克', '洛丽塔风格', '巴洛克风格', '超现实主义', '水彩画', '蒸汽波艺术', '油画', '卡通画'];

const S3_BUCKET = process.env.S3_BUCKET;
// console.log('S3_BUCKET:', S3_BUCKET);
const AK = process.env.AK_Paint;
const SK = process.env.SK_Paint;

app.post('/api/aiPaint', async (req, res) => {
  // console.log("api/paint")
  let { text, style, type, resolution } = req.body;
  if (!styleToUse.includes(style)) {
      style = '综合模型';
  }

  if (style === '综合模型') {
      try {
          getAIPaintPremium(text).then((data) => {
              // console.log('ID data:', data);
              data = JSON.parse(data);
              // if data contains property 'error_msg', then return error
              if (data['error_msg']) {
                  res.json({
                      success: false,
                      image: "https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex",
                      error: data['error_msg']
                  });
                  return;
              }
              const taskId = data['data']['task_id'] + "";
              // console.log('综合模型task_id:', taskId);
              // wait for 30s to get the image
              setTimeout(() => {
                  // console.log("getAIPaintPremium")
                  getAIPaintByIdPremium(taskId).then((data) => {
                      // console.log('getAIPaintByIdPremium Data:', data);
                      data = JSON.parse(data);
                      // console.log('data:', data);
                      // console.log(data['data']['sub_task_result_list'][0]["sub_task_status"] === 'SUCCESS');
                      if (data['data']['sub_task_result_list'][0]["sub_task_status"] === 'SUCCESS') {
                          // console.log('SUCCESS data:', data);

                          const imgUrl = data['data']['sub_task_result_list'][0]["final_image_list"][0]['img_url'];
                          const newAIPaintRecord = new AIPaintRecord({
                              time: new Date(),
                              phoneNumber: req.session.user.username,
                              modelName: '高级模型',
                              img_url: imgUrl,
                              prompts: text,
                          });
                          newAIPaintRecord.save().then(() => {
                              console.log('newAIPaintRecord saved');
                          }).catch((err) => {
                              // console.log('newAIPaintRecord save failed');
                              console.log('err:', err);
                          });
                          res.json({
                              success: true,
                              image: imgUrl
                          });
                      } else {
                          res.json({
                              success: false,
                              image: "https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex",
                              error: "服务忙，请稍后再试"
                          });
                      }
                  }).catch((err) => {
                      res.json({
                          success: false,
                          image: "https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex",
                          error: "服务忙，请稍后再试"
                      });
                      console.log('err:', err);
                  });
              }, 20000);
          }).catch((err) => {
              console.log('err:', err);
              res.json({
                  success: false,
                  image: "https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex",
                  error: "服务忙，请稍后再试"
              });
          });
      }
      catch (err) {
          console.log('err:', err);
          res.json({
              image: "https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex"
          });

      }
  } else {
      try {
          getAIPaintNormal(style, text).then((data) => {
              // console.log('data:', data);
              data = JSON.parse(data);
              const taskId = data['data']['taskId'];
              // console.log('taskId:', taskId);

              // wait for 30s to get the image
              setTimeout(() => {
                  getAIPaintById(taskId).then((data) => {
                      // console.log('getAIPaintById taskId:', data);
                      data = JSON.parse(data);
                      const imgUrl = data['data']['img'];
                      // console.log(req.session)
                      const newAIPaintRecord = new AIPaintRecord({
                          time: new Date(),
                          phoneNumber: req.session.user.username,
                          modelName: style,
                          img_url: imgUrl,
                          prompts: text,
                      });
                      newAIPaintRecord.save().then(() => {
                          console.log('newAIPaintRecord saved');
                      }).catch((err) => {
                          // console.log('newAIPaintRecord save failed');
                          console.log('err:', err);
                      });

                      res.json({
                          success: true,
                          image: imgUrl
                      });
                  }).catch((err) => {
                      res.json({
                          success: false,
                          image: "https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex"
                      });
                      console.log('err:', err);
                  });
              }, 10000);

          }).catch((err) => {
              console.log('err:', err);
              res.json({
                  image: "https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex"
              });
          });

      }
      catch (err) {
          console.log('err:', err);
          res.json({
              image: "https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex"
          });
      }
  }
});

function getAccessToken() {
  let options = {
      'method': 'POST',
      'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
  }
  return new Promise((resolve, reject) => {
      request(options, (error, response) => {
          if (error) { reject(error) }
          else { resolve(JSON.parse(response.body).access_token) }
      })
  })
}


async function getAIPaintNormal(style, text) {
  var options = {
      'method': 'POST',
      'url': 'https://aip.baidubce.com/rpc/2.0/ernievilg/v1/txt2img?access_token=' + await getAccessToken(),
      'headers': {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
          "text": text,
          "resolution": "1024*1024",
          "style": style,
      })

  };

  return new Promise((resolve, reject) => {
      request(options, function (error, response) {
          if (error) reject(error);
          resolve(response.body);
      });
  });
}

async function getAIPaintPremium(text) {
  var options = {
      'method': 'POST',
      'url': 'https://aip.baidubce.com/rpc/2.0/ernievilg/v1/txt2imgv2?access_token=' + await getAccessToken(),
      'headers': {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
          "prompt": text,
          "version": "v2",
          "width": 1024,
          "height": 1024
      })

  };

  return new Promise((resolve, reject) => {
      request(options, function (error, response) {
          if (error) reject(error);
          resolve(response.body);
      });
  });
}

async function getAIPaintById(taskId) {
  // console.log('getAIPaintById basic, taskId:', taskId);

  var options = {
      'method': 'POST',
      'url': 'https://aip.baidubce.com/rpc/2.0/ernievilg/v1/getImg?access_token=' + await getAccessToken(),
      'headers': {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
      },
      body: JSON.stringify({
              "taskId": taskId
      })

  };

  return new Promise((resolve, reject) => {
      request(options, function (error, response) {
          if (error) reject(error);
          resolve(response.body);
      });
  });
}

async function getAIPaintByIdPremium(taskId) {
  // console.log("getAIPaintPremium Inside")
  var options = {
      'method': 'POST',
      'url': 'https://aip.baidubce.com/rpc/2.0/ernievilg/v1/getImgv2?access_token=' + await getAccessToken(),
      'headers': {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
          "task_id": taskId,
      })

  };

  return new Promise((resolve, reject) => {
      request(options, function (error, response) {
          if (error) reject(error);
          resolve(response.body);
      });
  });
}


app.listen(process.env.PORT || 8080);
console.log('edition1 server started');

