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


// boucle qui permet de créer les routes de manière dynamique
app.post('/login', LoginHandler);
app.post('/registerAutoEcole', upload.single('pics'), registerAutoEcoleHandler);
app.post('/registerChercheur', registerNewDriverHandler);
app.post('/autoecoleinfos', autoEcoleInfosHandler);
app.post('/reviewsautoecole', reviewsAEHandler);
app.post('/reviewsmonitor', reviewMonitorHandler);
app.post('/editAccount', editAccountHandler);
app.post('/editNotifications', editNotifsHandler);
app.post('/deleteAccount', deleteAccountHandler);
app.post('/editAutoEcoleInfos', editAEInfosHandler);
app.post('/editAutoEcolePersonnelFormations', editAEPersonnelHandler);
app.post('/createConversation', createConversationHandler);


app.get('/autoecole/:id', autoEcoleHandler);
app.get('/monitor/:id', monitorHandler);
app.get('/autosecoles', autoEcolesHandler);
app.get('/autosecolesclass', AESortedHandler);
app.get('/moniteursclass', monitorsSortedHandler);
app.get('/userInfos', userInfosHandler);
app.get('/search', searchHandler);
app.get('/results', resultsHandler);







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