const mongoose = require('mongoose'),
  dotenv = require('dotenv');
mongoose.set('debug', true);

dotenv.config();
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true }
);

mongoose.Promise = Promise;

module.exports.questions = require('./question');
