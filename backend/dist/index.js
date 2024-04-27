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
const mongoose_1 = __importDefault(require("mongoose"));
const Conversation_1 = require("./MongoModels/Conversation");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const token_1 = require("./Functions/token");
const chat_1 = require("./Functions/chat");
const Login_1 = require("./Handlers/Login");
const Register_1 = require("./Handlers/Register");
const AutoEcole_1 = require("./Handlers/AutoEcole");
const Monitor_1 = require("./Handlers/Monitor");
const Account_1 = require("./Handlers/Account");
const Search_1 = require("./Handlers/Search");
const Conversation_2 = require("./Handlers/Conversation");
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
// boucle qui permet de créer les routes de manière dynamique
app.post('/login', Login_1.LoginHandler);
app.post('/registerAutoEcole', upload.single('pics'), Register_1.registerAutoEcoleHandler);
app.post('/registerChercheur', Register_1.registerNewDriverHandler);
app.post('/autoecoleinfos', AutoEcole_1.autoEcoleInfosHandler);
app.post('/reviewsautoecole', AutoEcole_1.reviewsAEHandler);
app.post('/reviewsmonitor', Monitor_1.reviewMonitorHandler);
app.post('/editAccount', Account_1.editAccountHandler);
app.post('/editNotifications', Account_1.editNotifsHandler);
app.post('/deleteAccount', Account_1.deleteAccountHandler);
app.post('/editAutoEcoleInfos', Account_1.editAEInfosHandler);
app.post('/editAutoEcolePersonnelFormations', Account_1.editAEPersonnelHandler);
app.post('/createConversation', Conversation_2.createConversationHandler);
app.get('/autoecole/:id', AutoEcole_1.autoEcoleHandler);
app.get('/monitor/:id', Monitor_1.monitorHandler);
app.get('/autosecoles', AutoEcole_1.autoEcolesHandler);
app.get('/autosecolesclass', AutoEcole_1.AESortedHandler);
app.get('/moniteursclass', Monitor_1.monitorsSortedHandler);
app.get('/userInfos', Account_1.userInfosHandler);
app.get('/search', Search_1.searchHandler);
app.get('/results', Search_1.resultsHandler);
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