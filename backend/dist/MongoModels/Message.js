"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    sender_id: { type: String, required: true },
    conversation_id: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
});
exports.MessageSchema = MessageSchema;
//# sourceMappingURL=Message.js.map