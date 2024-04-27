import mongoose from "mongoose";
import { getIdFromToken } from "../Functions/token";
import { ConversationShema, Conversations } from "../MongoModels/Conversation";


export const createConversationHandler = async (req, res) => {
    try {
        console.log(req.body);
    let { userId, creatorId } = req.body;
    creatorId = getIdFromToken(creatorId);
    if (!creatorId) return;
    const conversationExists = await Conversations.findOne({ usersId: { $all: [userId, creatorId] } });
    if (conversationExists) {
        res.send({ created: false });
    } else {
        const newConversation = new Conversations({
            usersId: [userId, creatorId],
            date: new Date(),
            lastMessage: ''
        });
        await newConversation.save();
        const conversationShema = mongoose.model('conversation_' + newConversation._id, ConversationShema);
        conversationShema.createCollection();
        res.send({ created: true });
    }
    } catch (error) {
        console.log(error);        
    }
}