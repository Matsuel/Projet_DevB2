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
exports.synchroneMessages = exports.createMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Conversation_1 = require("../MongoModels/Conversation");
const createMessage = (id, conversationId, content) => {
    return {
        senderId: id,
        conversation_id: conversationId,
        content: content,
        date: new Date()
    };
};
exports.createMessage = createMessage;
function synchroneMessages(conversationId, userId, connectedUsers) {
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
exports.synchroneMessages = synchroneMessages;
//# sourceMappingURL=chat.js.map