const mongoose = require('mongoose');
const { emit } = require('./cripto');

let userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  login_last_timestamp: { type: Number, required: true }
});

module.exports = mongoose.model('User', userSchema);