import axios from "axios"

const createConversation = async (userId : string, creatorId : string) => {
    const conversation = await axios.post("http://localhost:3500/createConversation", {userId, creatorId})
    console.log(conversation.data)
    return conversation.data
    //voir pour rediriger vers la page de chat/id
    //try catch si ça existe pas
}

export {createConversation}