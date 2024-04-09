export type UserInfos = {
    _id: string,
    email: string,
    acceptNotifications: boolean,
}

export type AccountInputs = {
    email: string,
    password: string,
    newPassword: string,
    newPasswordConfirm: string,
}

export type NotificationsInputs = {
    acceptNotifications: boolean,
}

export type AutoEcoleInfosInputs = {
    card: boolean,
    cheque: boolean,
    especes: boolean,
    qualiopi: boolean,
    label_qualite: boolean,
    qualicert: boolean,
    garantie_fin: boolean,
    datadocke: boolean,
    cpf: boolean,
    aide_apprentis: boolean,
    permis1: boolean,
    fin_francetravail: boolean,
    name: string,
    address: string,
    zip: string,
    city: string,
    phone: string,
}