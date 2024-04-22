export type AutoEcoleInterface = {
    name: string;
    mail: string;
    password: string;
    address: string;
    zip: number;
    city: string;
    pics: string;
    monitors: string[];
    phone: string;
    card: boolean;
    cheque: boolean;
    especes: boolean;
    qualiopi: boolean;
    label_qualite: boolean;
    qualicert: boolean;
    garantie_fin: boolean;
    datadocke: boolean;
    cpf: boolean;
    aide_apprentis: boolean;
    permis1: boolean;
    fin_francetravail: boolean;
    formations: string[];
    students: string[];
    note: number;
    noteCount: number;
}

export type UserInterface = {
    mail: string;
    password: string;
    notifs: boolean;
}

export type LoginInterface = {
    mail: string;
    password: string;
}