import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectToMongo, { getAutoEcole, getAutosEcoles, login, registerAutoEcole, registerChercheur, searchAutoEcole } from './Functions/mongo';
import { AutoEcoleInterface, LoginInterface, UserInterface } from './Interfaces/Users';
import dotenv from 'dotenv';
import multer from 'multer';
import { searchInCitiesFiles } from './Functions/search';
import mongoose from 'mongoose';
import { reviewAutoecoleSchema } from './MongoModels/Review';
import { AutoEcole, Student } from './MongoModels/Users';
import { ReviewMonitor } from './Interfaces/Review';
import { ConversationShema, Conversations } from './MongoModels/Conversation';

const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

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
        res.send({ created: false});
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

const getIdFromToken = (token: string) => {
    const decoded = jwt.verify(token, process.env.SECRET as string);
    return decoded.id;

}

connectToMongo();

app.listen(3500, () => {
    console.log('Server is running on port 3500');
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