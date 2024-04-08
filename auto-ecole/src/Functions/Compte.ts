import { AccountInputs } from '@/types/Compte';
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

//function pour supprimer de la list des moniteurs, les formations et les students
//function pour modifier les infos de base de l'auto-ecole
//function pour modifier les infos du moniteur
//function pour modifier les infos d'un student
//function pour modifier les infos d'une formation