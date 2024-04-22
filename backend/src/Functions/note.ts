import { AutoEcoleInterface } from "../Types/Users";

export function updateNote(autoEcole: any, reviewContent: any) {
    ((Number(autoEcole.note) * Number(autoEcole.noteCount)) + Number(reviewContent.stars)) / (Number(autoEcole.noteCount) + 1)
}