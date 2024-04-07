import { AccountInputs } from "@/pages/compte";
import axios from 'axios';

export async function editAccount(id: string, data: AccountInputs) {
    const response = await axios.post("http://localhost:3500/editAccount", {id, data})
    return response.data
}

export async function editNotifications(id: string, data: any) {
    const response = await axios.post("http://localhost:3500/editNotifications", {id, data})
    return response.data
}