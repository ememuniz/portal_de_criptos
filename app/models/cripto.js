const mongoose = require('mongoose');

const criptoSchema = new mongoose.Schema({
  symbol: String,
  name: String,
  rank: Number,
  price: Number,
  market_cap: Number,
  total_volume_24h: Number,
  low_24h: Number,
  high_24h: Number,
  delta_1h: Number,
  delta_24h: Number,
  delta_7d: Number,
  delta_30d: Number,
  markets: [
    {
      symbol: String,
      volume_24h: Number,
      price: Number,
      exchanges: [
        {
          name: String,
          volume_24h: Number,
          price: Number,
        },
      ],
    },
  ],
  last_update_timestamp: Number,
  remaining: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Cripto', criptoSchema);
