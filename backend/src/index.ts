import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectToMongo, { deleteAccount, editAccount, editAutoEcoleInfos, editAutoEcolePersonnelFormations, editNotifications, getAutoEcole, getAutosEcoles, getMessages, getMonitorAvg, getUserInfosById, login, registerAutoEcole, registerChercheur, searchAutoEcole } from './Functions/mongo';
import { AutoEcoleInterface, UserInterface } from './Types/Users';
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

app.post('/login', async (req, res) => {
    const { mail, password } = req.body;
    const user = await login({ mail, password });

    if (user.login) {
        req.session.userId = user.id;
        const token = jwt.sign({ id: user.id }, process.env.SECRET as string, { expiresIn: '24h' });
        res.send({ login: true, token: token });
    } else {
        res.send({ login: false });
    }
});

app.post('/registerAutoEcole', upload.single('pics'), async (req, res) => {
    const data = req.body as AutoEcoleInterface;
    const file = req.file;
    const response = await registerAutoEcole(data, file);
    if (response) {
        req.session.userId = response.id;
        const token = jwt.sign({ id: response.id }, process.env.SECRET as string, { expiresIn: '24h' });
        res.send({ register: true, token: token });
    } else {
        res.send({ register: false });
    }
});

app.post('/registerChercheur', async (req, res) => {
    const data = req.body as UserInterface;
    const response = await registerChercheur(data);
    if (response) {
        req.session.userId = response.id;
        const token = jwt.sign({ id: response.id }, process.env.SECRET as string, { expiresIn: '24h' });
        res.send({ register: true, token: token });
    } else {
        res.send({ register: false });
    }
});

app.get('/autoecole/:id', async (req, res) => {
    const autoEcole = await getAutoEcole(req.params.id);
    const reviewsList = await findAutoEcoleReviews(req.params.id);
    let monitorsReviews: any[] = [];
    // @ts-ignore
    for (let i = 0; i < autoEcole.monitors.length; i++) {
        // @ts-ignore
        monitorsReviews.push(await findMonitorReviews(autoEcole.monitors[i]._id));
    }
    res.send({ autoEcole: autoEcole, reviews: reviewsList, monitorsReviews: monitorsReviews });
});

app.get('/monitor/:id', async (req, res) => {
    const autoEcole = await AutoEcole.findOne({ 'monitors._id': req.params.id }, { 'monitors.$': 1 }).select('_id name')
    const monitor = await AutoEcole.findOne({ 'monitors._id': req.params.id }, { 'monitors.$': 1 });
    if (monitor) {
        res.send({ autoEcole: autoEcole, monitor: monitor, reviews: await findMonitorReviews(req.params.id) });
    } else {
        res.send({ monitor: null });
    }
});

app.get('/autosecoles', async (req, res) => {
    res.send({ autoEcoles: await getAutosEcoles() });
});

app.post('/autoecoleinfos', async (req, res) => {
    const token = req.body.token;
    const id = getIdFromToken(token);
    const student = await Student.findById(id);
    if (student) {
        const autoEcole = await AutoEcole.findById(student.autoEcoleId).select('monitors name');
        res.send({ autoEcole: autoEcole });
    } else {
        res.send({ autoEcole: null });
    }
});

app.get('/search', async (req, res) => {
    const cities = await searchInCitiesFiles(req.query.search as string);
    const autoEcoles = await searchAutoEcole(req.query.search as string);
    res.send({ cities: cities, autoEcoles: autoEcoles });
});

app.get('/results', async (req, res) => {
    const autoEcoles = await searchAutoEcole(req.query.search as string);
    res.send({ autoEcoles: autoEcoles });
});

app.post('/reviewsautoecole', async (req, res) => {
    const reviewContent = req.body.review;
    const token = req.body.token;
    const id = getIdFromToken(token);
    const student = await Student.findById(id);
    if (student) {
        let autoEcoleModel = mongoose.model('reviewsAutoecole_' + student.autoEcoleId, reviewAutoecoleSchema);
        await autoEcoleModel.create(createReview(reviewContent, id));
        if (reviewContent.stars !== 0) {
            let autoEcole = await AutoEcole.findById(student.autoEcoleId);
            autoEcole.note = updateNote(autoEcole, reviewContent);
            autoEcole.noteCount = Number(autoEcole.noteCount) + 1;
            await autoEcole.save();
        }
        res.send({ posted: true, autoEcoleId: student.autoEcoleId });
    } else {
        res.send({ posted: false });
    }
});

app.post('/reviewsmonitor', async (req, res) => {
    const content: ReviewMonitor = req.body.review;
    const token = req.body.token;
    const id = getIdFromToken(token);
    const student = await Student.findById(id);
    if (student) {
        let monitors = await AutoEcole.findById(student.autoEcoleId).select('monitors');
        let monitorIndex = monitors.monitors.findIndex((monitor: any) => monitor._id.toString() === content._id);
        if (monitorIndex !== -1) {
            let monitorReviewModel = mongoose.model('reviewsMonitor_' + content._id, reviewAutoecoleSchema);
            let newReview = {
                rate: content.stars > 0 ? content.stars : null,
                comment: content.comment,
                creatorId: id,
                date: new Date()
            };
            await monitorReviewModel.create(newReview);
            res.send({ posted: true, autoEcoleId: student.autoEcoleId });
        } else {
            res.send({ posted: false });
        }
    } else {
        res.send({ posted: false });
    }
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

app.get('/autosecolesclass', async (req, res) => {
    const autoEcoles = await AutoEcole.find().select('name note');
    const autoEcolesSorted = autoEcoles.sort((a, b) => Number(b.note) - Number(a.note));
    res.send({ autoEcoles: autoEcolesSorted });
});

app.get('/moniteursclass', async (req, res) => {
    const moniteurs = await AutoEcole.find().select('monitors');
    let moniteursList: any[] = [];
    for (let i = 0; i < moniteurs.length; i++) {
        const monitorsWithAvgPromises = moniteurs[i].monitors.map(async monitor => ({
            ...monitor.toObject(),
            avg: await getMonitorAvg(monitor._id.toString())
        }));
        const monitorsWithAvg = await Promise.all(monitorsWithAvgPromises);
        moniteursList.push(...monitorsWithAvg);
    }
    const moniteursSorted = moniteursList.sort((a, b) => Number(b.avg) - Number(a.avg));
    res.send({ moniteurs: moniteursSorted });
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