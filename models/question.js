const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  author: String
});

const question = mongoose.model('question', questionSchema);

module.exports = question;
