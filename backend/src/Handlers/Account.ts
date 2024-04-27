import { deleteAccount, editAccount, editAutoEcoleInfos, editAutoEcolePersonnelFormations, editNotifications, getUserInfosById } from "../Functions/mongo";
import jwt from 'jsonwebtoken';
import { getIdFromToken } from "../Functions/token";

export const editAccountHandler = async (req, res) => {
    try {
        console.log(req.body);
        const id = req.body.id;
        const edit = await editAccount(id, req.body.data);
        const token = edit ? jwt.sign({ id: id }, process.env.SECRET as string, { expiresIn: '24h' }) : null;
        res.send({ edited: edit, token: token });
    } catch (error) {
        console.log(error);
        res.send({ edited: false });
    }
}

export const editNotifsHandler = async (req, res) => {
    try {
        console.log(req.body);
        const id = req.body.id;
        const { acceptNotifications } = req.body.data;
        await editNotifications(id, acceptNotifications);
        res.send({ edited: true });
    } catch (error) {
        console.log(error);
        res.send({ edited: false });
    }
}

export const deleteAccountHandler = async (req, res) => {
    const id = req.body.id;
    res.send({ deleted: await deleteAccount(id) });
}

export const editAEInfosHandler = async (req, res) => {
    try {
        const id = req.body.id;
        res.send({ edited: await editAutoEcoleInfos(id, req.body.data) });
    } catch (error) {
        console.log(error);
        res.send({ edited: false });
    }
}

export const editAEPersonnelHandler = async (req, res) => {
    try {
        const id = req.body.id;
        res.send({ edited: await editAutoEcolePersonnelFormations(id, req.body.data) });
    } catch (error) {
        console.log(error);
        res.send({ edited: false });
    }
}

export const userInfosHandler = async (req, res) => {
    try {
        const token = req.query.token;
        const id = getIdFromToken(token as string);
        if (!id) return;
        const user = await getUserInfosById(id);
        res.send(user);
    } catch (error) {
        console.log(error);
    }
}