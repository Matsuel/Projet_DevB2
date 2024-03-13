import mongoose from "mongoose";

const AutoEcole = mongoose.model("AutoEcole", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    pics: { type: [String], required: false },
    monitors: { type: [String], required: true },
    phone: { type: String, required: true },
    card: { type: Boolean, required: true },
    cheque: { type: Boolean, required: true },
    especes: { type: Boolean, required: true },
    qualiopi: { type: Boolean, required: true },
    label_qualite: { type: Boolean, required: true },
    qualicert: { type: Boolean, required: true },
    garantie_fin: { type: Boolean, required: true },
    datadocke: { type: Boolean, required: true },
    cpf: { type: Boolean, required: true },
    aide_apprentis: { type: Boolean, required: true },
    permis1: { type: Boolean, required: true },
    fin_francetravail: { type: Boolean, required: true },
    formations: { type: [String], required: true },
    students: { type: [String], required: true },
    note: { type: Number, required: false },
    noteCount: { type: Number, required: false },
    reviews: {
        type: [{
            studentId: { type: String, required: true },
            content: { type: String, required: true },
            date: { type: Date, required: true },
        }],
    }

    // subscribeDate: { type: Date, required: true },
}));

const Student = mongoose.model("Student", new mongoose.Schema({
    autoEcoleId: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // required: true car quand l'ae va créer les comptes, on crééra un mot de passe par défaut qui sera communiqué à l'élève
    acceptNotifications: { type: Boolean, required: true }, // required: true car par défaut on enverra des notifications
}));

const User = mongoose.model("User", new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    acceptNotifications: { type: Boolean, required: true },
}));

export { AutoEcole, Student, User }