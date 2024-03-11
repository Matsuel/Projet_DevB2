"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mongo_1 = __importDefault(require("./Functions/mongo"));
const mongo_2 = require("./Functions/mongo");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
let connectedUsers = {};
io.on('connection', (socket) => {
    socket.on('join', (data) => {
        connectedUsers[data.userId] = socket;
    });
    socket.on('disconnect', () => {
        for (let [userId, userSocket] of Object.entries(connectedUsers)) {
            if (userSocket === socket) {
                delete connectedUsers[userId];
                break;
            }
        }
    });
    socket.on('registerAutoEcole', (data) => {
        (0, mongo_2.registerAutoEcole)(data, socket);
    });
});
(0, mongo_1.default)();
server.listen(3500, () => {
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
//# sourceMappingURL=index.js.map