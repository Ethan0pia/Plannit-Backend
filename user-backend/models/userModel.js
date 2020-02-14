const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  username: {
    type: String,
    required: 'Username is required'
  },
  email: {
    type: String,
    required: 'Enter your email'
  },
  role: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  password: {
    type: String,
    required: 'Password is required'
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
