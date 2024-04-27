"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectedUsers = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const mongo_1 = __importDefault(require("./Functions/mongo"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const token_1 = require("./Functions/token");
const Login_1 = require("./Handlers/Login");
const Register_1 = require("./Handlers/Register");
const AutoEcole_1 = require("./Handlers/AutoEcole");
const Monitor_1 = require("./Handlers/Monitor");
const Account_1 = require("./Handlers/Account");
const Search_1 = require("./Handlers/Search");
const Conversation_1 = require("./Handlers/Conversation");
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
app.post('/createConversation', Conversation_1.createConversationHandler);
app.get('/autoecole/:id', AutoEcole_1.autoEcoleHandler);
app.get('/monitor/:id', Monitor_1.monitorHandler);
app.get('/autosecoles', AutoEcole_1.autoEcolesHandler);
app.get('/autosecolesclass', AutoEcole_1.AESortedHandler);
app.get('/moniteursclass', Monitor_1.monitorsSortedHandler);
app.get('/userInfos', Account_1.userInfosHandler);
app.get('/search', Search_1.searchHandler);
app.get('/results', Search_1.resultsHandler);
exports.connectedUsers = {};
io.on('connection', (socket) => {
    socket.on('connection', (data) => {
        const id = (0, token_1.getIdFromToken)(data.id);
        if (!id)
            return;
        exports.connectedUsers[id] = socket;
    });
    socket.on('disconnect', () => {
        for (let user in exports.connectedUsers) {
            if (exports.connectedUsers[user] === socket) {
                delete exports.connectedUsers[user];
                break;
            }
        }
    });
    socket.on('getConversations', (0, Conversation_1.getConversationsHandler)(socket));
    socket.on('getMessages', (0, Conversation_1.getMessagesHandler)(socket));
    socket.on('sendMessage', (0, Conversation_1.sendMessageHandler)(socket));
});
(0, mongo_1.default)();
app.listen(3500, () => {
    console.log('Server is running on port 3500');
});
server.listen(4000, () => {
    console.log('Socket is running on port 4000');
});
//# sourceMappingURL=index.js.map