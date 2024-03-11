"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Conversation = mongoose_1.default.model("Conversation", new mongoose_1.default.Schema({
    usersId: { type: [String], required: true },
}));
exports.Conversation = Conversation;
//# sourceMappingURL=Conversation.js.map