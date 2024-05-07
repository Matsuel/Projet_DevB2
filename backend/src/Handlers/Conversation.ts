import mongoose from "mongoose";
import { getIdFromToken } from "../Functions/token";
import { ConversationShema, Conversations } from "../MongoModels/Conversation";
import { getMessages } from "../Functions/mongo";
import jwt from 'jsonwebtoken';
import { MessageReceived } from "../Types/Chat";
import { createMessage, synchroneMessages } from "../Functions/chat";
import { connectedUsers } from "..";

// export const createConversationHandler = async (req, res) => {
//     try {
//         console.log(req.body);
//         let { userId, creatorId } = req.body;
//         creatorId = getIdFromToken(creatorId);
//         if (!creatorId) return;
//         const conversationExists = await Conversations.findOne({ usersId: { $all: [userId, creatorId] } });
//         if (conversationExists) {
//             res.send({ created: false });
//         } else {
//             const newConversation = new Conversations({
//                 usersId: [userId, creatorId],
//                 date: new Date(),
//                 lastMessage: ''
//             });
//             await newConversation.save();
//             const conversationShema = mongoose.model('conversation_' + newConversation._id, ConversationShema);
//             conversationShema.createCollection();
//             res.send({ created: true });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

export const createConversationHandler = (socket: any) => {
    return async (data: any) => {
        try {
            let { userId, creatorId } = data;
            creatorId = getIdFromToken(creatorId);
            if (!creatorId) return;
            const conversationExists = await Conversations.findOne({ usersId: { $all: [userId, creatorId] } });
            if (conversationExists) {
                socket.emit('createConversation', { created: false });
            } else {
                const newConversation = new Conversations({
                    usersId: [userId, creatorId],
                    date: new Date(),
                    lastMessage: ''
                });
                await newConversation.save();
                const conversationShema = mongoose.model('conversation_' + newConversation._id, ConversationShema);
                conversationShema.createCollection();
                socket.emit('createConversation', { created: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}


// Websockets handlers
export const getConversationsHandler = (socket:any) => {
    return async (data) => {
        try {
            const id = getIdFromToken(data.id);
            if (!id) return;
            const conversations = await Conversations.find({ usersId: id });
            socket.emit('conversations', { conversations: conversations });
        } catch (error) {
            console.log(error);
        }
    }
}

export const getMessagesHandler = (socket) => {
    return async (data) => {
        try {
            const { conversationId, userId } = data;
            const decoded = jwt.verify(userId, process.env.SECRET as string);
            const id = decoded.id;
            socket.emit('getMessages', { messages: await getMessages(conversationId, id) });
        } catch (error) {
            console.log(error);
        }
    }
}

export const sendMessageHandler = (socket) => {
    return async (data) => {
        try {
            const { conversationId, userId, content }: MessageReceived = data;
            console.log(data);
            if (content.trim() === '') return;
            const decoded = jwt.verify(userId, process.env.SECRET as string);
            const id = decoded.id;
            const conversationShema = mongoose.model('conversation_' + conversationId, ConversationShema);
            await conversationShema.create(createMessage(id, conversationId, content));
            const conversation = await Conversations.findById(conversationId);
            conversation.lastMessage = content;
            conversation.date = new Date();
            await conversation.save();
            await synchroneMessages(conversationId, id, connectedUsers);
            socket.emit('getMessages', { messages: await getMessages(conversationId, id) });
            socket.emit('conversations', { conversations: await Conversations.find({ usersId: id }) });
        } catch (error) {
            console.log(error);
        }
    }
}