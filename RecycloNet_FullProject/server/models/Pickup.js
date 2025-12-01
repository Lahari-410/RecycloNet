const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  item: String,
  location: String,
  photo: String,
  status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Pickup', pickupSchema);
