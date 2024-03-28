export type ConversationInformations = {
    _id: string;
    usersId: string[];
};

export type Message = {
    _id: string;
    senderId: string;
    conversation_id: string;
    content : string;
    date: Date;
};