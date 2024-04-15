import axios from "axios"

const createConversation = async (userId : string, creatorId : string, router: any) => {
    const conversation = await axios.post("http://localhost:3500/createConversation", {userId, creatorId})
    conversation.data.created ? router.push("/chat/") : router.push("/chat/")
    //voir pour rediriger vers la page de chat/id
    //try catch si ça existe pas
}

const getMessages = async (conversationId : string, userId : string, socket : any) => {
    socket.emit("getMessages", {conversationId, userId})
}

const sendMessage = async (conversationId : string, userId : string, content : string, socket : any) => {
    socket.emit("sendMessage", {conversationId, userId, content})
}

export {createConversation, getMessages, sendMessage}