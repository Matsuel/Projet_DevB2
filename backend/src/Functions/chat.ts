import mongoose from "mongoose";
import { ConversationShema, Conversations } from "../MongoModels/Conversation";

export const createMessage = (id: string, conversationId: string, content: string) => {
    return {
        senderId: id,
        conversation_id: conversationId,
        content: content,
        date: new Date()
    };
}

export async function synchroneMessages(conversationId: string, userId: string, connectedUsers: any) {
    const conversationShema = mongoose.model('conversation_' + conversationId, ConversationShema);
    const messages = await conversationShema.find();
    const otherUser = (await Conversations.findOne({ _id: conversationId}).select('usersId')).usersId.filter((id: string) => id !== userId)[0]
    if (connectedUsers[otherUser]) {
        connectedUsers[otherUser].emit('getMessages', { messages: messages })
    } else {
        console.log('not connected');
        //sendMail
    }
}