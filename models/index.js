const mongoose = require('mongoose'),
  dotenv = require('dotenv');
mongoose.set('debug', true);

dotenv.config();

const db = process.env.DB_URL || 'mongodb://localhost:27017/iquestions';

mongoose.connect(
  db,
  { useNewUrlParser: true }
);

mongoose.Promise = Promise;

module.exports.questions = require('./question');
