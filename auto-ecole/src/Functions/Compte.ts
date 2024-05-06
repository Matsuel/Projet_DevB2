import { AccountInputs, AutoEcoleInfosInputs } from '@/types/Compte';
import axios from 'axios';
import { socket } from '@/pages/_app';

export async function editAccount(id: string, data: AccountInputs) {
    try {
        socket.emit('editAccount', { id, data });
    } catch (error) {
        console.log(error);
    }
}

export async function editNotifications(id: string, data: any) {
    try {
        socket.emit('editNotifications', { id, data });
    } catch (error) {
        console.log(error)
    }
}

export async function deleteAccount(id: string) {
    try {
        const response = await axios.post("http://localhost:3500/deleteAccount", { id })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function editAutoEcoleInfos(id: string, data: AutoEcoleInfosInputs) {
    try {
        socket.emit('editAutoEcoleInfos', { id, data });
    } catch (error) {
        console.log(error);
    }
}

// export async function editAutoEcolePersonnelFormations(id: string, data: any) {
//     try {
//         const response = await axios.post("http://localhost:3500/editAutoEcolePersonnelFormations", { id, data })
//         console.log(response.data)
//         response.data.edited ? window.location.reload() : console.log("error")
//         return response.data
//     } catch (error) {
//         console.log(error)
//     }
// }

export async function editAutoEcolePersonnelFormations(id: string, data: any) {
    try {
        socket.emit('editAutoEcolePersonnelFormations', { id, data });
    } catch (error) {
        console.log(error);
    }
}