export interface AutoEcoleInterface {
    name: string;
    mail: string;
    password: string;
    address: string;
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
}

export interface UserInterface {
    mail: string;
    password: string;
    notifs: boolean;
}

export interface LoginInterface {
    mail: string;
    password: string;
}