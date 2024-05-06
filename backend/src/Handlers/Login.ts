import { login } from "../Functions/mongo";
import jwt from 'jsonwebtoken';

export const loginHandler = (socket) => {
    return async (data) => {
        try {
            const { mail, password } = data;
            const user = await login({ mail, password });
            if (user.login) {
                const token = jwt.sign({ id: user.id }, process.env.SECRET as string, { expiresIn: '24h' });
                socket.emit('login', { login: true, token: token });
            } else {
                socket.emit('login', { login: false });
            }
        } catch (error) {
            socket.emit('login', { login: false });
        }
    };
};