"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mongo_1 = __importDefault(require("./Functions/mongo"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
let connectedUsers = {};
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
(0, mongo_1.default)();
server.listen(3500, () => {
    console.log('Server is running on port 3500');
});
//# sourceMappingURL=index.js.map