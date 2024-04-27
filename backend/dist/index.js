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
const Login_1 = require("./Handlers/Login");
const Register_1 = require("./Handlers/Register");
const AutoEcole_1 = require("./Handlers/AutoEcole");
const Monitor_1 = require("./Handlers/Monitor");
const Account_1 = require("./Handlers/Account");
const Search_1 = require("./Handlers/Search");
const Conversation_1 = require("./Handlers/Conversation");
const Ws_1 = require("./Handlers/Ws");
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
const routesPost = [
    { name: '/login', handler: Login_1.LoginHandler },
    { name: '/registerAutoEcole', upload: upload.single('pics'), handler: Register_1.registerAutoEcoleHandler },
    { name: '/registerChercheur', handler: Register_1.registerNewDriverHandler },
    { name: '/autoecoleinfos', handler: AutoEcole_1.autoEcoleInfosHandler },
    { name: '/reviewsautoecole', handler: AutoEcole_1.reviewsAEHandler },
    { name: '/reviewsmonitor', handler: Monitor_1.reviewMonitorHandler },
    { name: '/editAccount', handler: Account_1.editAccountHandler },
    { name: '/editNotifications', handler: Account_1.editNotifsHandler },
    { name: '/deleteAccount', handler: Account_1.deleteAccountHandler },
    { name: '/editAutoEcoleInfos', handler: Account_1.editAEInfosHandler },
    { name: '/editAutoEcolePersonnelFormations', handler: Account_1.editAEPersonnelHandler },
    { name: '/createConversation', handler: Conversation_1.createConversationHandler },
];
const routesGet = [
    { name: '/autoecole/:id', handler: AutoEcole_1.autoEcoleHandler },
    { name: '/monitor/:id', handler: Monitor_1.monitorHandler },
    { name: '/autosecoles', handler: AutoEcole_1.autoEcolesHandler },
    { name: '/autosecolesclass', handler: AutoEcole_1.AESortedHandler },
    { name: '/moniteursclass', handler: Monitor_1.monitorsSortedHandler },
    { name: '/userInfos', handler: Account_1.userInfosHandler },
    { name: '/search', handler: Search_1.searchHandler },
    { name: '/results', handler: Search_1.resultsHandler }
];
routesPost.forEach(route => {
    if (route.upload) {
        app.post(route.name, route.upload, route.handler);
    }
    else {
        app.post(route.name, route.handler);
    }
});
routesGet.forEach(route => {
    app.get(route.name, route.handler);
});
exports.connectedUsers = {};
io.on('connection', (socket) => {
    socket.on('connection', (0, Ws_1.connectionHandler)(socket, exports.connectedUsers));
    socket.on('disconnect', (0, Ws_1.disconnectionHandler)(socket, exports.connectedUsers));
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