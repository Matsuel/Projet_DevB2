import { deleteAccount, editAccount, editAutoEcoleInfos, editAutoEcolePersonnelFormations, editNotifications, getUserInfosById } from "../Functions/mongo";
import jwt from 'jsonwebtoken';
import { getIdFromToken } from "../Functions/token";

export const editAccountHandler = (socket: any) => {
    return async (data: any) => {
        console.log(data);
        try {
            const id = data.id;
            const edit = await editAccount(id, data.data);
            const token = edit ? jwt.sign({ id: id }, process.env.SECRET as string, { expiresIn: '24h' }) : null;
            socket.emit('editAccount', { edited: edit, token });
        } catch (error) {
            console.log(error);
        }
    }
}

export const editNotifsHandler = (socket: any) => {
    return async (data: any) => {
        try {
            const id = data.id;
            const { acceptNotifications } = data.data;
            await editNotifications(id, acceptNotifications);
            socket.emit('editNotifs', { edited: true });
        } catch (error) {
            console.log(error);
        }
    }
}

export const editAEInfosHandler = (socket: any) => {
    return async (data: any) => {
        try {
            const id = data.id;
            const edit = await editAutoEcoleInfos(id, data.data);
            socket.emit('editAEInfos', { edited: edit });
        } catch (error) {
            console.log(error);
        }
    }
}

// export const editAEPersonnelHandler = async (req, res) => {
//     try {
//         const id = req.body.id;
//         res.send({ edited: await editAutoEcolePersonnelFormations(id, req.body.data) });
//     } catch (error) {
//         console.log(error);
//         res.send({ edited: false });
//     }
// }

export const editAEPersonnelHandler = (socket: any) => {
    return async (data: any) => {
        console.log(data);
        try {
            const id = data.id;
            const edit = await editAutoEcolePersonnelFormations(id, data.data);
            socket.emit('editAutoEcolePersonnelFormations', { edited: edit });
        } catch (error) {
            console.log(error);
        }
    }
}

export const deleteAccountHandler = async (req, res) => {
    const id = req.body.id;
    res.send({ deleted: await deleteAccount(id) });
}

export const userInfosHandler = (socket: any) => {
    return async (data: any) => {
        try {
            const token = data.token;
            const id = getIdFromToken(token);
            if (!id) return;
            const user = await getUserInfosById(id);
            socket.emit('userInfos', user);
        } catch (error) {
            console.log(error);
        }
    }
}