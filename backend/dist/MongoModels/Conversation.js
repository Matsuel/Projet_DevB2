"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationShema = exports.Conversations = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Conversations = mongoose_1.default.model("Conversations", new mongoose_1.default.Schema({
    usersId: { type: [String], required: true },
}));
exports.Conversations = Conversations;
const ConversationShema = new mongoose_1.default.Schema({
    senderId: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
});
exports.ConversationShema = ConversationShema;
//# sourceMappingURL=Conversation.js.map