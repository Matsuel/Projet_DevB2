"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongo_1 = __importStar(require("./Functions/mongo"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const search_1 = require("./Functions/search");
const mongoose_1 = __importDefault(require("mongoose"));
const Review_1 = require("./MongoModels/Review");
const Users_1 = require("./MongoModels/Users");
const Conversation_1 = require("./MongoModels/Conversation");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
});
app.use((0, express_session_1.default)({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mail, password } = req.body;
    const user = yield (0, mongo_1.login)({ mail, password });
    if (user.login) {
        req.session.userId = user.id;
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' });
        res.send({ login: true, token: token });
    }
    else {
        res.send({ login: false });
    }
}));
app.post('/registerAutoEcole', upload.single('pics'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const file = req.file;
    const response = yield (0, mongo_1.registerAutoEcole)(data, file);
    if (response) {
        req.session.userId = response.id;
        const token = jsonwebtoken_1.default.sign({ id: response.id }, process.env.SECRET, { expiresIn: '24h' });
        res.send({ register: true, token: token });
    }
    else {
        res.send({ register: false });
    }
}));
app.post('/registerChercheur', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const response = yield (0, mongo_1.registerChercheur)(data);
    if (response) {
        req.session.userId = response.id;
        const token = jsonwebtoken_1.default.sign({ id: response.id }, process.env.SECRET, { expiresIn: '24h' });
        res.send({ register: true, token: token });
    }
    else {
        res.send({ register: false });
    }
}));
app.get('/autoecole/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(await getAutoEcole(req.params.id));
    // res.send({ autoEcole: await getAutoEcole(req.params.id) });
    const autoEcole = yield (0, mongo_1.getAutoEcole)(req.params.id);
    const reviews = mongoose_1.default.model('reviewsAutoecole_' + req.params.id, Review_1.reviewAutoecoleSchema);
    const reviewsList = yield reviews.find();
    let monitorsReviews = [];
    // @ts-ignore
    for (let i = 0; i < autoEcole.monitors.length; i++) {
        // @ts-ignore
        let monitorReviews = mongoose_1.default.model('reviewsMonitor_' + autoEcole.monitors[i]._id, Review_1.reviewAutoecoleSchema);
        let monitorReview = yield monitorReviews.find();
        monitorsReviews.push(monitorReview);
    }
    res.send({ autoEcole: autoEcole, reviews: reviewsList, monitorsReviews: monitorsReviews });
}));
app.get('/autosecoles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ autoEcoles: yield (0, mongo_1.getAutosEcoles)() });
}));
app.post('/autoecoleinfos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
    const id = decoded.id;
    const student = yield Users_1.Student.findById(id);
    if (student) {
        const autoEcole = yield Users_1.AutoEcole.findById(student.autoEcoleId).select('monitors name');
        res.send({ autoEcole: autoEcole });
    }
    else {
        res.send({ autoEcole: null });
    }
}));
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cities = yield (0, search_1.searchInCitiesFiles)(req.query.search);
    const autoEcoles = yield (0, mongo_1.searchAutoEcole)(req.query.search);
    res.send({ cities: cities, autoEcoles: autoEcoles });
}));
app.get('/results', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const autoEcoles = yield (0, mongo_1.searchAutoEcole)(req.query.search);
    res.send({ autoEcoles: autoEcoles });
}));
app.post('/reviewsautoecole', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //réparer ici la collection reviewsAutoecole+autoecoleId
    console.log(req.body);
    const reviewContent = req.body.review;
    const token = req.body.token;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
    const id = decoded.id;
    const student = yield Users_1.Student.findById(id);
    if (student) {
        let autoEcoleModel = mongoose_1.default.model('reviewsAutoecole_' + student.autoEcoleId, Review_1.reviewAutoecoleSchema);
        let newReview = {
            rate: reviewContent.stars > 0 ? reviewContent.stars : null,
            comment: reviewContent.comment,
            creatorId: id,
            date: new Date()
        };
        yield autoEcoleModel.create(newReview);
        if (reviewContent.stars !== 0) {
            let autoEcole = yield Users_1.AutoEcole.findById(student.autoEcoleId);
            let note = ((Number(autoEcole.note) * Number(autoEcole.noteCount)) + Number(reviewContent.stars)) / (Number(autoEcole.noteCount) + 1);
            autoEcole.note = note;
            autoEcole.noteCount = Number(autoEcole.noteCount) + 1;
            yield autoEcole.save();
        }
        res.send({ posted: true, autoEcoleId: student.autoEcoleId });
    }
    else {
        res.send({ posted: false });
    }
}));
app.post('/reviewsmonitor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = req.body.review;
    const token = req.body.token;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
    const id = decoded.id;
    const student = yield Users_1.Student.findById(id);
    if (student) {
        let monitors = yield Users_1.AutoEcole.findById(student.autoEcoleId).select('monitors');
        let monitorIndex = monitors.monitors.findIndex((monitor) => monitor._id.toString() === content._id);
        if (monitorIndex !== -1) {
            let monitorReviewModel = mongoose_1.default.model('reviewsMonitor_' + content._id, Review_1.reviewAutoecoleSchema);
            let newReview = {
                rate: content.stars > 0 ? content.stars : null,
                comment: content.comment,
                creatorId: id,
                date: new Date()
            };
            yield monitorReviewModel.create(newReview);
            res.send({ posted: true, autoEcoleId: student.autoEcoleId });
        }
        else {
            res.send({ posted: false });
        }
    }
    else {
        res.send({ posted: false });
    }
}));
app.post('/createConversation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let { userId, creatorId } = req.body;
    creatorId = getIdFromToken(creatorId);
    console.log(creatorId, userId);
    const conversationExists = yield Conversation_1.Conversations.findOne({ usersId: { $all: [userId, creatorId] } });
    if (conversationExists) {
        res.send({ created: false });
    }
    else {
        const newConversation = new Conversation_1.Conversations({
            usersId: [userId, creatorId]
        });
        yield newConversation.save();
        const conversationShema = mongoose_1.default.model('conversation_' + newConversation._id, Conversation_1.ConversationShema);
        conversationShema.createCollection();
        res.send({ created: true });
    }
}));
const getIdFromToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
    return decoded.id;
};
let connectedUsers = {};
io.on('connection', (socket) => {
    socket.on('connection', (data) => {
        const id = getIdFromToken(data.id);
        console.log(id);
        connectedUsers[id] = socket;
    });
    socket.on('getConversations', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const id = getIdFromToken(data.id);
        const conversations = yield Conversation_1.Conversations.find({ usersId: id });
        socket.emit('conversations', { conversations: conversations });
    }));
});
(0, mongo_1.default)();
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
//# sourceMappingURL=index.js.map