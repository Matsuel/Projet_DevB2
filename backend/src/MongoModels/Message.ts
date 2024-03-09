import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender_id: { type: String, required: true },
    conversation_id: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
});

export { MessageSchema }