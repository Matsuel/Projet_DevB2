import { getIdFromToken } from "../Functions/token";


export const connectionHandler = (socket: any, connectedUsers: any) => {
    return async (data) => {
        try {
            const id = getIdFromToken(data.id)
            if (!id) return;
            connectedUsers[id] = socket;
        } catch (error) {
            console.log(error);
        }
    }
}

export const disconnectionHandler = (socket: any, connectedUsers: any) => {
    return async (data) => {
        try {
            for (let user in connectedUsers) {
                if (connectedUsers[user] === socket) {
                    delete connectedUsers[user];
                    break
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}