import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import connectToMongo from './Functions/mongo';

const app = express();
app.use(cors());
app.use(express.json());
const server = createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

let connectedUsers: any = {};

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    connectedUsers[data.userId] = socket;
  });

    socket.on('disconnect', () => {
        for (let [userId, userSocket] of Object.entries(connectedUsers)) {
            if (userSocket === socket) {
                delete connectedUsers[userId];
                break;
            }
        }
    });
});



connectToMongo();

server.listen(3500, () => {
    console.log('Server is running on port 3500');
});
