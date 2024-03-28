import axios from "axios"

const createConversation = async (userId : string, creatorId : string) => {
    const conversation = await axios.post("http://localhost:3500/createConversation", {userId, creatorId})
    console.log(conversation.data)
    return conversation.data
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