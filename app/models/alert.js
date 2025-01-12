const mongoose = require('mongoose');

let alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cripto: { type: mongoose.Schema.Types.ObjectId, ref: 'Cripto' },
  low_price: Number,
  high_price: Number
});

module.exports = mongoose.model('Alert', alertSchema);