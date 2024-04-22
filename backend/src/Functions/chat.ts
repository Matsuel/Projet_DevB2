export const createMessage = (id: string, conversationId: string, content: string) => {
    return {
        senderId: id,
        conversation_id: conversationId,
        content: content,
        date: new Date()
    };
}