// index.js (Backend Entry Point)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const pickupRoutes = require('./routes/pickups');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pickups', pickupRoutes);

// Create server + socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
  },
});

// Socket events
io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('statusUpdate', (data) => {
    io.emit('pickupStatusChanged', data);
  });
});

// MongoDB connection
async function startServer() {
  try {
    const mongo = process.env.MONGO_URI;

    if (!mongo) {
      throw new Error("❌ MONGO_URI missing from .env file");
    }

    await mongoose.connect(mongo);
    console.log("MongoDB connected");

    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error("Server start error:", err.message);
  }
}

startServer();
