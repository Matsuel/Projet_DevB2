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
const token_1 = require("./Functions/token");
const note_1 = require("./Functions/note");
const review_1 = require("./Functions/review");
const chat_1 = require("./Functions/chat");
const Login_1 = require("./Handlers/Login");
const Register_1 = require("./Handlers/Register");
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
app.post('/login', Login_1.LoginHandler);
app.post('/registerAutoEcole', upload.single('pics'), Register_1.registerAutoEcoleHandler);
app.post('/registerChercheur', Register_1.registerNewDriverHandler);
// app.post('/registerChercheur', async (req, res) => {
//     const data = req.body as UserInterface;
//     const response = await registerChercheur(data);
//     if (response) {
//         req.session.userId = response.id;
//         const token = jwt.sign({ id: response.id }, process.env.SECRET as string, { expiresIn: '24h' });
//         res.send({ register: true, token: token });
//     } else {
//         res.send({ register: false });
//     }
// });
app.get('/autoecole/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const autoEcole = yield (0, mongo_1.getAutoEcole)(req.params.id);
    const reviewsList = yield (0, review_1.findAutoEcoleReviews)(req.params.id);
    let monitorsReviews = [];
    // @ts-ignore
    for (let i = 0; i < autoEcole.monitors.length; i++) {
        // @ts-ignore
        monitorsReviews.push(yield (0, review_1.findMonitorReviews)(autoEcole.monitors[i]._id));
    }
    res.send({ autoEcole: autoEcole, reviews: reviewsList, monitorsReviews: monitorsReviews });
}));
app.get('/monitor/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const autoEcole = yield Users_1.AutoEcole.findOne({ 'monitors._id': req.params.id }, { 'monitors.$': 1 }).select('_id name');
    const monitor = yield Users_1.AutoEcole.findOne({ 'monitors._id': req.params.id }, { 'monitors.$': 1 });
    if (monitor) {
        res.send({ autoEcole: autoEcole, monitor: monitor, reviews: yield (0, review_1.findMonitorReviews)(req.params.id) });
    }
    else {
        res.send({ monitor: null });
    }
}));
app.get('/autosecoles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ autoEcoles: yield (0, mongo_1.getAutosEcoles)() });
}));
app.post('/autoecoleinfos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const id = (0, token_1.getIdFromToken)(token);
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
    const reviewContent = req.body.review;
    const token = req.body.token;
    const id = (0, token_1.getIdFromToken)(token);
    const student = yield Users_1.Student.findById(id);
    if (student) {
        let autoEcoleModel = mongoose_1.default.model('reviewsAutoecole_' + student.autoEcoleId, Review_1.reviewAutoecoleSchema);
        yield autoEcoleModel.create((0, review_1.createReview)(reviewContent, id));
        if (reviewContent.stars !== 0) {
            let autoEcole = yield Users_1.AutoEcole.findById(student.autoEcoleId);
            autoEcole.note = (0, note_1.updateNote)(autoEcole, reviewContent);
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
    const id = (0, token_1.getIdFromToken)(token);
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
    creatorId = (0, token_1.getIdFromToken)(creatorId);
    if (!creatorId)
        return;
    const conversationExists = yield Conversation_1.Conversations.findOne({ usersId: { $all: [userId, creatorId] } });
    if (conversationExists) {
        res.send({ created: false });
    }
    else {
        const newConversation = new Conversation_1.Conversations({
            usersId: [userId, creatorId],
            date: new Date(),
            lastMessage: ''
        });
        yield newConversation.save();
        const conversationShema = mongoose_1.default.model('conversation_' + newConversation._id, Conversation_1.ConversationShema);
        conversationShema.createCollection();
        res.send({ created: true });
    }
}));
app.get('/userInfos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    const id = (0, token_1.getIdFromToken)(token);
    if (!id)
        return;
    const user = yield (0, mongo_1.getUserInfosById)(id);
    res.send(user);
}));
app.post('/editAccount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const id = req.body.id;
    const edit = yield (0, mongo_1.editAccount)(id, req.body.data);
    const token = edit ? jsonwebtoken_1.default.sign({ id: id }, process.env.SECRET, { expiresIn: '24h' }) : null;
    res.send({ edited: edit, token: token });
}));
app.post('/editNotifications', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const id = req.body.id;
    const { acceptNotifications } = req.body.data;
    yield (0, mongo_1.editNotifications)(id, acceptNotifications);
    res.send({ edited: true });
}));
app.post('/deleteAccount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    res.send({ deleted: yield (0, mongo_1.deleteAccount)(id) });
}));
app.post('/editAutoEcoleInfos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const id = req.body.id;
    console.log(id);
    res.send({ edited: yield (0, mongo_1.editAutoEcoleInfos)(id, req.body.data) });
}));
app.post('/editAutoEcolePersonnelFormations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const id = req.body.id;
    res.send({ edited: yield (0, mongo_1.editAutoEcolePersonnelFormations)(id, req.body.data) });
}));
app.get('/autosecolesclass', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const autoEcoles = yield Users_1.AutoEcole.find().select('name note');
    const autoEcolesSorted = autoEcoles.sort((a, b) => Number(b.note) - Number(a.note));
    res.send({ autoEcoles: autoEcolesSorted });
}));
app.get('/moniteursclass', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moniteurs = yield Users_1.AutoEcole.find().select('monitors');
    let moniteursList = [];
    for (let i = 0; i < moniteurs.length; i++) {
        const monitorsWithAvgPromises = moniteurs[i].monitors.map((monitor) => __awaiter(void 0, void 0, void 0, function* () {
            return (Object.assign(Object.assign({}, monitor.toObject()), { avg: yield (0, mongo_1.getMonitorAvg)(monitor._id.toString()) }));
        }));
        const monitorsWithAvg = yield Promise.all(monitorsWithAvgPromises);
        moniteursList.push(...monitorsWithAvg);
    }
    const moniteursSorted = moniteursList.sort((a, b) => Number(b.avg) - Number(a.avg));
    res.send({ moniteurs: moniteursSorted });
}));
let connectedUsers = {};
io.on('connection', (socket) => {
    socket.on('connection', (data) => {
        const id = (0, token_1.getIdFromToken)(data.id);
        if (!id)
            return;
        connectedUsers[id] = socket;
    });
    socket.on('disconnect', () => {
        for (let user in connectedUsers) {
            if (connectedUsers[user] === socket) {
                delete connectedUsers[user];
                break;
            }
        }
    });
    socket.on('getConversations', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const id = (0, token_1.getIdFromToken)(data.id);
        if (!id)
            return;
        const conversations = yield Conversation_1.Conversations.find({ usersId: id });
        socket.emit('conversations', { conversations: conversations });
    }));
    socket.on('getMessages', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId, userId } = data;
        const decoded = jsonwebtoken_1.default.verify(userId, process.env.SECRET);
        const id = decoded.id;
        socket.emit('getMessages', { messages: yield (0, mongo_1.getMessages)(conversationId, id) });
    }));
    socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId, userId, content } = data;
        console.log(data);
        if (content.trim() === '')
            return;
        const decoded = jsonwebtoken_1.default.verify(userId, process.env.SECRET);
        const id = decoded.id;
        const conversationShema = mongoose_1.default.model('conversation_' + conversationId, Conversation_1.ConversationShema);
        yield conversationShema.create((0, chat_1.createMessage)(id, conversationId, content));
        const conversation = yield Conversation_1.Conversations.findById(conversationId);
        conversation.lastMessage = content;
        conversation.date = new Date();
        yield conversation.save();
        yield synchroneMessages(conversationId, id);
        socket.emit('getMessages', { messages: yield (0, mongo_1.getMessages)(conversationId, id) });
        socket.emit('conversations', { conversations: yield Conversation_1.Conversations.find({ usersId: id }) });
    }));
});
function synchroneMessages(conversationId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const conversationShema = mongoose_1.default.model('conversation_' + conversationId, Conversation_1.ConversationShema);
        const messages = yield conversationShema.find();
        const otherUser = (yield Conversation_1.Conversations.findOne({ _id: conversationId }).select('usersId')).usersId.filter((id) => id !== userId)[0];
        if (connectedUsers[otherUser]) {
            connectedUsers[otherUser].emit('getMessages', { messages: messages });
        }
        else {
            console.log('not connected');
            //sendMail
        }
    });
}
(0, mongo_1.default)();
app.listen(3500, () => {
    console.log('Server is running on port 3500');
});
server.listen(4000, () => {
    console.log('Socket is running on port 4000');
});
//# sourceMappingURL=index.js.map