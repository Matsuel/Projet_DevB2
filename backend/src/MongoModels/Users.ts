import mongoose from "mongoose";

const AutoEcole = mongoose.model("AutoEcole", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    photos: { type: [String], required: false },
    monitors: { type: [String], required: true },
    formations: { type: [String], required: true },
    students: { type: [String], required: true },
    studentsNotAccepted: { type: [String], required: false },

    // subscribeDate: { type: Date, required: true },
}));

const Student = mongoose.model("Student", new mongoose.Schema({
    autoEcoleId: { type: String, required: true },
    email : { type: String, required: true },
    password : { type: String, required: true }, // required: true car quand l'ae va créer les comptes, on crééra un mot de passe par défaut qui sera communiqué à l'élève
    acceptNotifications: { type: Boolean, required: true }, // required: true car par défaut on enverra des notifications
}));

const User = mongoose.model("User", new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    acceptNotifications: { type: Boolean, required: true },
}));

export { AutoEcole, Student, User }