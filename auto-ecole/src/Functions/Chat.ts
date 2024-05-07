import { socket } from "@/pages/_app"

const createConversation = async (userId: string, creatorId: string) => {
    try {
        socket.emit("createConversation", { userId, creatorId })
    } catch (error) {
        console.log(error)
    }
}

const getMessages = async (conversationId: string, userId: string, socket: any) => {
    try {
        socket.emit("getMessages", { conversationId, userId })
    } catch (error) {
        console.log(error)
    }
}

const sendMessage = async (conversationId: string, userId: string, content: string, socket: any) => {
    try {
        socket.emit("sendMessage", { conversationId, userId, content })
    } catch (error) {
        console.log(error)
    }
}

export { createConversation, getMessages, sendMessage }