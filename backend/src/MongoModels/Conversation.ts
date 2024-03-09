import mongoose from "mongoose";

const Conversation = mongoose.model("Conversation", new mongoose.Schema({
    usersId: { type: [String], required: true },
}));

export { Conversation }