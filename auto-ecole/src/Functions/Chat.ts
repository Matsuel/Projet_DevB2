import axios from "axios"

const createConversation = async (userId: string, creatorId: string, router: any) => {
    try {
        const conversation = await axios.post("http://localhost:3500/createConversation", { userId, creatorId })
        conversation.data.created ? router.push("/chat/") : router.push("/chat/")
        //voir pour rediriger vers la page de chat/id
        //try catch si ça existe pas
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