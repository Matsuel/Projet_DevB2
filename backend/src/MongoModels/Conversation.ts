import mongoose from "mongoose";

const Conversations = mongoose.model("Conversations", new mongoose.Schema({
    usersId: { type: [String], required: true },
}));

const ConversationShema = new mongoose.Schema({
    senderId: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
});

export { Conversations, ConversationShema };