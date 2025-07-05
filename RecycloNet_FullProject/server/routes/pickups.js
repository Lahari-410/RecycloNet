const express = require('express');
const router = express.Router();
const Pickup = require('../models/Pickup');

router.get('/', async (req, res) => {
  const pickups = await Pickup.find();
  res.json(pickups);
});

router.post('/', async (req, res) => {
  const pickup = new Pickup(req.body);
  await pickup.save();
  res.status(201).json(pickup);
});

module.exports = router;