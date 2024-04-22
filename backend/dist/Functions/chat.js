"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = void 0;
const createMessage = (id, conversationId, content) => {
    return {
        senderId: id,
        conversation_id: conversationId,
        content: content,
        date: new Date()
    };
};
exports.createMessage = createMessage;
//# sourceMappingURL=chat.js.map