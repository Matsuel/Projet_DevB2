import { registerAutoEcole, registerNewDriver } from "../Functions/mongo";
import { AutoEcoleInterface, UserInterface } from "../Types/Users";
import jwt from "jsonwebtoken";

export const registerAutoEcoleHandler = (socket: any) => {
    return async (data: AutoEcoleInterface) => {
        try {
            const response = await registerAutoEcole(data, data.pics);
            if (response) {
                const token = jwt.sign({ id: response.id }, process.env.SECRET as string, { expiresIn: '24h' });
                socket.emit('registerAutoEcole', { register: true, token: token });
            } else {
                socket.emit('registerAutoEcole', { register: false });
            }
        } catch (error) {
            socket.emit('registerAutoEcole', { register: false });
        }
    };
};

export const registerNewDriverHandler = (socket: any) => {
    return async (data: UserInterface) => {
        try {
            const response = await registerNewDriver(data);
            if (response) {
                const token = jwt.sign({ id: response.id }, process.env.SECRET as string, { expiresIn: '24h' });
                socket.emit('registerChercheur', { register: true, token: token });
            } else {
                socket.emit('registerChercheur', { register: false });
            }
        } catch (error) {
            socket.emit('registerChercheur', { register: false });
        }
    };
};