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


app.use(session({
  secret: 'ai-finance-literacy',
  resave: false,
  saveUninitialized: true,
}));

const accessTokenRecord = mongoose.model("accessTokenRecordSchema")


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




app.listen(process.env.PORT || 8080);
console.log('edition1 server started');

