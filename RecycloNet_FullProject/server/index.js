const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const pickupRoutes = require('./routes/pickups');

require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.json());
app.use('/api/pickups', pickupRoutes);

io.on('connection', socket => {
  console.log('Connected:', socket.id);
  socket.on('statusUpdate', data => {
    socket.broadcast.emit('pickupStatusChanged', data);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});