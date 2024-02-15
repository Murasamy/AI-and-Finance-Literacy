import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

const connectString = process.env.CONNECTSTRING || 'mongodb://localhost/ai-finance-literacy';
console.log('Waiting for connection to database... to:', connectString);
try {
  await mongoose.connect(connectString, {useNewUrlParser: true});
  // mongodb://USERNAME:PASSWORD@class-mongodb.cims.nyu.edu/USERNAME
  console.log('Successfully connected to database:', connectString);
} catch (err) {
  console.log('ERROR: ', err);
}
mongoose.plugin(slug);



const accessTokenRecordSchema = new mongoose.Schema({
  username: {type: String, required: true},
  access_remaining: {type: Number, require: true, default: 1}
});


// Create models for each schema
mongoose.model('accessTokenRecord', accessTokenRecordSchema)

