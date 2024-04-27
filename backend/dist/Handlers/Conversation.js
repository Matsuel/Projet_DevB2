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
exports.createConversationHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const token_1 = require("../Functions/token");
const Conversation_1 = require("../MongoModels/Conversation");
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
//# sourceMappingURL=Conversation.js.map