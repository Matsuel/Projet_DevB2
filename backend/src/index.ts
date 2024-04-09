import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectToMongo, { deleteAccount, editAccount, editAutoEcoleInfos, editAutoEcolePersonnelFormations, editNotifications, getAutoEcole, getAutosEcoles, getMessages, getUserInfosById, login, registerAutoEcole, registerChercheur, searchAutoEcole } from './Functions/mongo';
import { AutoEcoleInterface, LoginInterface, UserInterface } from './Types/Users';
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
    // console.log(await getAutoEcole(req.params.id));
    // res.send({ autoEcole: await getAutoEcole(req.params.id) });
    const autoEcole = await getAutoEcole(req.params.id);
    const reviews = mongoose.model('reviewsAutoecole_' + req.params.id, reviewAutoecoleSchema);
    const reviewsList = await reviews.find();
    let monitorsReviews: any[] = [];
    // @ts-ignore
    for (let i = 0; i < autoEcole.monitors.length; i++) {
        // @ts-ignore
        let monitorReviews = mongoose.model('reviewsMonitor_' + autoEcole.monitors[i]._id, reviewAutoecoleSchema);
        let monitorReview = await monitorReviews.find();
        monitorsReviews.push(monitorReview);
    }
    res.send({ autoEcole: autoEcole, reviews: reviewsList, monitorsReviews: monitorsReviews });
});

app.get('/monitor/:id', async (req, res) => {
    console.log(req.params.id);
    const autoEcole = await AutoEcole.findOne({ 'monitors._id': req.params.id }, { 'monitors.$': 1 }).select('_id name')
    const monitor = await AutoEcole.findOne({ 'monitors._id': req.params.id }, { 'monitors.$': 1 });
    if (monitor) {
        const monitorReviewCollection = mongoose.model('reviewsMonitor_' + req.params.id, reviewAutoecoleSchema);
        const monitorReviews = await monitorReviewCollection.find();
        console.log(monitorReviews);
        res.send({ autoEcole: autoEcole, monitor: monitor, reviews: monitorReviews });
    } else {
        res.send({ monitor: null });
    }
});

app.get('/autosecoles', async (req, res) => {
    res.send({ autoEcoles: await getAutosEcoles() });
});

app.post('/autoecoleinfos', async (req, res) => {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.SECRET as string);
    const id = decoded.id;
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
    //réparer ici la collection reviewsAutoecole+autoecoleId
    console.log(req.body);
    const reviewContent = req.body.review;
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.SECRET as string);
    const id = decoded.id;
    const student = await Student.findById(id);
    if (student) {
        let autoEcoleModel = mongoose.model('reviewsAutoecole_' + student.autoEcoleId, reviewAutoecoleSchema);
        let newReview = {
            rate: reviewContent.stars > 0 ? reviewContent.stars : null,
            comment: reviewContent.comment,
            creatorId: id,
            date: new Date()
        };
        await autoEcoleModel.create(newReview);
        if (reviewContent.stars !== 0) {
            let autoEcole = await AutoEcole.findById(student.autoEcoleId);
            let note = ((Number(autoEcole.note) * Number(autoEcole.noteCount)) + Number(reviewContent.stars)) / (Number(autoEcole.noteCount) + 1);
            autoEcole.note = note;
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
    const decoded = jwt.verify(token, process.env.SECRET as string);
    const id = decoded.id;
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
    console.log(creatorId, userId);
    const conversationExists = await Conversations.findOne({ usersId: { $all: [userId, creatorId] } });
    if (conversationExists) {
        res.send({ created: false });
    } else {
        const newConversation = new Conversations({
            usersId: [userId, creatorId]
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


const getIdFromToken = (token: string) => {
    const decoded = jwt.verify(token, process.env.SECRET as string);
    return decoded.id;

}

let connectedUsers: any = {};

io.on('connection', (socket) => {

    socket.on('connection', (data) => {
        const id = getIdFromToken(data.id)
        console.log(id);
        connectedUsers[id] = socket;
    });

    socket.on('disconnect', () => {
        console.log('disconnected')
        
        for (let user in connectedUsers) {
            if (connectedUsers[user] === socket) {
                delete connectedUsers[user];
                break
            }
        }
    });

    socket.on('getConversations', async (data) => {
        const id = getIdFromToken(data.id);
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
        const newMessage = {
            senderId: id,
            conversation_id: conversationId,
            content: content,
            date: new Date()
        };
        await conversationShema.create(newMessage);
        await synchroneMessages(conversationId, id);
        socket.emit('getMessages', { messages: await getMessages(conversationId, id) });
    });
});

async function synchroneMessages(conversationId: string, userId: string) {
    const conversationShema = mongoose.model('conversation_' + conversationId, ConversationShema);
    const messages = await conversationShema.find();
    const otherUser = (await Conversations.findOne({ _id: conversationId}).select('usersId')).usersId.filter((id: string) => id !== userId)[0]
    console.log(otherUser);
    if (connectedUsers[otherUser]) {
        console.log('connected');
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


//Canaux de communication websockets

// login/register
// getConversations
// getMessages permet de récupérer les messages d'une conversation
// sendMessage permet d'envoyer un message dans une conversation
// createConversation permet de créer une conversation entre deux utilisateurs
// deleteConversation permet de supprimer une conversation
// getComments permet de récupérer les commentaires sur une auto école/moniteur
// postComment permet de poster un commentaire sur une auto école/moniteur
// deleteComment permet de supprimer un commentaire sur une auto école/moniteur
// postReview permet de poster un avis sur une auto école/moniteur
// deleteReview permet de supprimer un avis sur une auto école/moniteur
// getProfile permet de récupérer le profil de l'utilisateur connecté, en fonction de son type (auto école/moniteur/élève)
// updateProfile permet de mettre à jour le profil de l'utilisateur connecté, en fonction de son type (auto école/moniteur/élève)
// getAutoEcole permet de récupérer les informations d'une auto école
// search permet de rechercher une auto école ou une ville afin de récupérer les auto écoles correspondantes
// getMoniteur permet de récupérer les commentaires et avis d'un moniteur
// getAutoEcole permet de récupérer les commentaires et avis d'une auto école
// synchroMessages permet de synchroniser les messages d'une conversation entre deux utilisateurs si le destinataire n'est pas connecté on envoie un mail pour le notifier s'il a activé l'option

// Fonctions
// sendMail permet d'envoyer un mail
// synchroneMessages permet de synchroniser les messages d'une conversation entre deux utilisateurs

// voir si les autos écoles en db ont des objets avec les avis et commentaires

//Chiffrer les données entre le front et le back