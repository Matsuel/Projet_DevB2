"use strict";
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
exports.sendMessageHandler = exports.getMessagesHandler = exports.getConversationsHandler = exports.createConversationHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const token_1 = require("../Functions/token");
const Conversation_1 = require("../MongoModels/Conversation");
const mongo_1 = require("../Functions/mongo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chat_1 = require("../Functions/chat");
const __1 = require("..");
const createConversationHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (error) {
        console.log(error);
    }
});
exports.createConversationHandler = createConversationHandler;
// Websockets handlers
const getConversationsHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = (0, token_1.getIdFromToken)(data.id);
            if (!id)
                return;
            const conversations = yield Conversation_1.Conversations.find({ usersId: id });
            socket.emit('conversations', { conversations: conversations });
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.getConversationsHandler = getConversationsHandler;
const getMessagesHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { conversationId, userId } = data;
            const decoded = jsonwebtoken_1.default.verify(userId, process.env.SECRET);
            const id = decoded.id;
            socket.emit('getMessages', { messages: yield (0, mongo_1.getMessages)(conversationId, id) });
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.getMessagesHandler = getMessagesHandler;
const sendMessageHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            yield (0, chat_1.synchroneMessages)(conversationId, id, __1.connectedUsers);
            socket.emit('getMessages', { messages: yield (0, mongo_1.getMessages)(conversationId, id) });
            socket.emit('conversations', { conversations: yield Conversation_1.Conversations.find({ usersId: id }) });
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.sendMessageHandler = sendMessageHandler;
//# sourceMappingURL=Conversation.js.map