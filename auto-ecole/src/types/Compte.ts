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