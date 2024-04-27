import { registerAutoEcole, registerNewDriver } from "../Functions/mongo";
import { AutoEcoleInterface, UserInterface } from "../Types/Users";
import jwt from "jsonwebtoken";

export const registerAutoEcoleHandler = async (req, res) => {
    try {
        const data = req.body as AutoEcoleInterface;
        const file = req.file;
        const response = await registerAutoEcole(data, file);
        if (response) {
            req.session.userId = response.id;
            const token = jwt.sign({ id: response.id }, process.env.SECRET as string, { expiresIn: '24h' });
            res.send({ register: true, token: token });
        } else {
            res.send({ register: false });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ register: false });
    }
}

export const registerNewDriverHandler = async (req, res) => {
    try {
        const data = req.body as UserInterface;
        const response = await registerNewDriver(data);
        if (response) {
            req.session.userId = response.id;
            const token = jwt.sign({ id: response.id }, process.env.SECRET as string, { expiresIn: '24h' });
            res.send({ register: true, token: token });
        } else {
            res.send({ register: false });
        }
    } catch (error) {
        console.log(error);
        res.send({ register: false });
    }
}