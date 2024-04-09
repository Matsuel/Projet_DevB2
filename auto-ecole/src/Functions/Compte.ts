import { AccountInputs, AutoEcoleInfosInputs } from '@/types/Compte';
import axios from 'axios';

export async function editAccount(id: string, data: AccountInputs) {
    const response = await axios.post("http://localhost:3500/editAccount", {id, data})
    return response.data
}

export async function editNotifications(id: string, data: any) {
    const response = await axios.post("http://localhost:3500/editNotifications", {id, data})
    return response.data
}

export async function deleteAccount(id: string) {
    const response = await axios.post("http://localhost:3500/deleteAccount", {id})
    return response.data
}

export async function editAutoEcoleInfos(id: string, data: AutoEcoleInfosInputs) {
    const response = await axios.post("http://localhost:3500/editAutoEcoleInfos", {id, data})
    return response.data
}

export async function editAutoEcolePersonnelFormations(id: string, data: any) {
    const response = await axios.post("http://localhost:3500/editAutoEcolePersonnelFormations", {id, data})
    console.log(response.data)
    response.data.edited ? window.location.reload() : console.log("error")
    return response.data
}