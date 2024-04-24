import { AccountInputs, AutoEcoleInfosInputs } from '@/types/Compte';
import axios from 'axios';

export async function editAccount(id: string, data: AccountInputs) {
    try {
        const response = await axios.post("http://localhost:3500/editAccount", { id, data })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function editNotifications(id: string, data: any) {
    try {
        const response = await axios.post("http://localhost:3500/editNotifications", { id, data })
        return response.data
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
        const response = await axios.post("http://localhost:3500/editAutoEcoleInfos", { id, data })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function editAutoEcolePersonnelFormations(id: string, data: any) {
    try {
        const response = await axios.post("http://localhost:3500/editAutoEcolePersonnelFormations", { id, data })
        console.log(response.data)
        response.data.edited ? window.location.reload() : console.log("error")
        return response.data
    } catch (error) {
        console.log(error)
    }
}