import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectToMongo, 
{ 
    deleteAccount, 
    editAccount, 
    editAutoEcoleInfos, 
    editAutoEcolePersonnelFormations, 
    editNotifications, 
    getAutoEcole, 
    getAutosEcoles, 
    getMessages, 
    getMonitorAvg, 
    getUserInfosById,
    searchAutoEcole

 } from './Functions/mongo';
import dotenv from 'dotenv';
import multer from 'multer';
import { searchInCitiesFiles } from './Functions/search';
import mongoose from 'mongoose';
import { reviewAutoecoleSchema } from './MongoModels/Review';
import { AutoEcole, Student } from './MongoModels/Users';
import { ReviewMonitor } from './Types/Review';
import { ConversationShema, Conversations } from './MongoModels/Conversation';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { MessageReceived } from './Types/Chat';
import { getIdFromToken } from './Functions/token';
import { updateNote } from './Functions/note';
import { createReview, findAutoEcoleReviews, findMonitorReviews } from './Functions/review';
import { createMessage } from './Functions/chat';
import { LoginHandler } from './Handlers/Login';
import { registerAutoEcoleHandler, registerNewDriverHandler } from './Handlers/Register';
import { AESortedHandler, autoEcoleHandler, autoEcoleInfosHandler, autoEcolesHandler, reviewsAEHandler } from './Handlers/AutoEcole';
import { monitorHandler, monitorsSortedHandler, reviewMonitorHandler } from './Handlers/Monitor';

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


app.get('/autoecole/:id', autoEcoleHandler);
app.get('/monitor/:id', monitorHandler);
app.get('/autosecoles', autoEcolesHandler);
app.get('/autosecolesclass', AESortedHandler);
app.get('/moniteursclass', monitorsSortedHandler);




app.get('/search', async (req, res) => {
    const cities = await searchInCitiesFiles(req.query.search as string);
    const autoEcoles = await searchAutoEcole(req.query.search as string);
    res.send({ cities: cities, autoEcoles: autoEcoles });
});

app.get('/results', async (req, res) => {
    const autoEcoles = await searchAutoEcole(req.query.search as string);
    res.send({ autoEcoles: autoEcoles });
});



app.post('/createConversation', async (req, res) => {
    console.log(req.body);
    let { userId, creatorId } = req.body;
    creatorId = getIdFromToken(creatorId);
    if (!creatorId) return;
    const conversationExists = await Conversations.findOne({ usersId: { $all: [userId, creatorId] } });
    if (conversationExists) {
        res.send({ created: false });
    } else {
        const newConversation = new Conversations({
            usersId: [userId, creatorId],
            date: new Date(),
            lastMessage: ''
        });
        await newConversation.save();
        const conversationShema = mongoose.model('conversation_' + newConversation._id, ConversationShema);
        conversationShema.createCollection();
        res.send({ created: true });
    }

});

app.get('/userInfos', async (req, res) => {
    const token = req.query.token;
    const id = getIdFromToken(token as string);
    if (!id) return;
    const user = await getUserInfosById(id);
    res.send(user);
});

app.post('/editAccount', async (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    const edit = await editAccount(id, req.body.data);
    const token = edit ? jwt.sign({ id: id }, process.env.SECRET as string, { expiresIn: '24h' }) : null;
    res.send({ edited: edit, token: token });    
});

app.post('/editNotifications', async (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    const { acceptNotifications } = req.body.data;
    await editNotifications(id, acceptNotifications);
    res.send({ edited: true });
});

app.post('/deleteAccount', async (req, res) => {
    const id = req.body.id;
    res.send({ deleted: await deleteAccount(id) });
});

app.post('/editAutoEcoleInfos', async (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    console.log(id);
    res.send({ edited: await editAutoEcoleInfos(id, req.body.data) });
});

app.post('/editAutoEcolePersonnelFormations', async (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    res.send({ edited: await editAutoEcolePersonnelFormations(id, req.body.data) });
});






let connectedUsers: any = {};

io.on('connection', (socket) => {

    socket.on('connection', (data) => {
        const id = getIdFromToken(data.id)
        if (!id) return;
        connectedUsers[id] = socket;
    });

    socket.on('disconnect', () => {        
        for (let user in connectedUsers) {
            if (connectedUsers[user] === socket) {
                delete connectedUsers[user];
                break
            }
        }
    });

    socket.on('getConversations', async (data) => {
        const id = getIdFromToken(data.id);
        if (!id) return;
        const conversations = await Conversations.find({ usersId: id });
        socket.emit('conversations', { conversations: conversations });
    });

    socket.on('getMessages', async (data) => {
        const { conversationId, userId } = data;
        const decoded = jwt.verify(userId, process.env.SECRET as string);
        const id = decoded.id;
        socket.emit('getMessages', { messages: await getMessages(conversationId, id) });
    });

    socket.on('sendMessage', async (data) => {
        const { conversationId, userId, content }: MessageReceived = data;
        console.log(data);
        if (content.trim() === '') return;
        const decoded = jwt.verify(userId, process.env.SECRET as string);
        const id = decoded.id;
        const conversationShema = mongoose.model('conversation_' + conversationId, ConversationShema);
        await conversationShema.create(createMessage(id, conversationId, content));
        const conversation = await Conversations.findById(conversationId);
        conversation.lastMessage = content;
        conversation.date = new Date();
        await conversation.save();
        await synchroneMessages(conversationId, id);
        socket.emit('getMessages', { messages: await getMessages(conversationId, id) });
        socket.emit('conversations', { conversations: await Conversations.find({ usersId: id }) });
    });
});

async function synchroneMessages(conversationId: string, userId: string) {
    const conversationShema = mongoose.model('conversation_' + conversationId, ConversationShema);
    const messages = await conversationShema.find();
    const otherUser = (await Conversations.findOne({ _id: conversationId}).select('usersId')).usersId.filter((id: string) => id !== userId)[0]
    if (connectedUsers[otherUser]) {
        connectedUsers[otherUser].emit('getMessages', { messages: messages })
    } else {
        console.log('not connected');
        //sendMail
    }
}

connectToMongo();

app.listen(3500, () => {
    console.log('Server is running on port 3500');
});

server.listen(4000, () => {
    console.log('Socket is running on port 4000');
});