const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questions: String
});

const question = mongoose.model('question', questionSchema);

module.exports = question;
