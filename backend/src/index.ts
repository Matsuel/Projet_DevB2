import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectToMongo from './Functions/mongo';
import dotenv from 'dotenv';
import multer from 'multer';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { LoginHandler } from './Handlers/Login';
import { registerAutoEcoleHandler, registerNewDriverHandler } from './Handlers/Register';
import { AESortedHandler, autoEcoleHandler, autoEcoleInfosHandler, autoEcolesHandler, reviewsAEHandler } from './Handlers/AutoEcole';
import { monitorHandler, monitorsSortedHandler, reviewMonitorHandler } from './Handlers/Monitor';
import { deleteAccountHandler, editAEInfosHandler, editAEPersonnelHandler, editAccountHandler, editNotifsHandler, userInfosHandler } from './Handlers/Account';
import { resultsHandler, searchHandler } from './Handlers/Search';
import { createConversationHandler, getConversationsHandler, getMessagesHandler, sendMessageHandler } from './Handlers/Conversation';
import { connectionHandler, disconnectionHandler } from './Handlers/Ws';
import { Route } from './Types/Route';

const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
});

app.use(session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

const routesPost: Route[] = [
    { name: '/login', handler: LoginHandler },
    { name: '/registerAutoEcole', upload: upload.single('pics'), handler: registerAutoEcoleHandler },
    { name: '/registerChercheur', handler: registerNewDriverHandler },
    { name: '/autoecoleinfos', handler: autoEcoleInfosHandler },
    { name: '/reviewsautoecole', handler: reviewsAEHandler },
    { name: '/reviewsmonitor', handler: reviewMonitorHandler },
    { name: '/editAccount', handler: editAccountHandler },
    { name: '/editNotifications', handler: editNotifsHandler },
    { name: '/deleteAccount', handler: deleteAccountHandler },
    { name: '/editAutoEcoleInfos', handler: editAEInfosHandler },
    { name: '/editAutoEcolePersonnelFormations', handler: editAEPersonnelHandler },
    { name: '/createConversation', handler: createConversationHandler },
];

const routesGet: Route[] = [
    { name: '/autoecole/:id', handler: autoEcoleHandler },
    { name: '/monitor/:id', handler: monitorHandler },
    { name: '/autosecoles', handler: autoEcolesHandler },
    { name: '/autosecolesclass', handler: AESortedHandler },
    { name: '/moniteursclass', handler: monitorsSortedHandler },
    { name: '/userInfos', handler: userInfosHandler },
    { name: '/search', handler: searchHandler },
    { name: '/results', handler: resultsHandler }
];

routesPost.forEach(route => {
    if (route.upload) {
        app.post(route.name, route.upload, route.handler);
    } else {
        app.post(route.name, route.handler);
    }
});

routesGet.forEach(route => {
    app.get(route.name, route.handler);
});

export let connectedUsers: any = {};

io.on('connection', (socket) => {
    socket.on('connection', connectionHandler(socket, connectedUsers));
    socket.on('disconnect', disconnectionHandler(socket, connectedUsers));
    socket.on('getConversations', getConversationsHandler(socket));
    socket.on('getMessages', getMessagesHandler(socket));
    socket.on('sendMessage', sendMessageHandler(socket));
});

connectToMongo();

app.listen(3500, () => {
    console.log('Server is running on port 3500');
});

server.listen(4000, () => {
    console.log('Socket is running on port 4000');
});