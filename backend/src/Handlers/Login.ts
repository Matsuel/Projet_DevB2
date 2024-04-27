import { login } from "../Functions/mongo";
import jwt from 'jsonwebtoken';

export const LoginHandler = async (req, res) => {
    try {
        const { mail, password } = req.body;
        const user = await login({ mail, password });
        if (user.login) {
            req.session.userId = user.id;
            const token = jwt.sign({ id: user.id }, process.env.SECRET as string, { expiresIn: '24h' });
            res.send({ login: true, token: token });
        } else {
            res.send({ login: false });
        }
    } catch (error) {
        res.send({ login: false });
    }
};