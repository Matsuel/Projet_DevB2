"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Student = exports.AutoEcole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AutoEcole = mongoose_1.default.model("AutoEcole", new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    zip: { type: Number, required: true },
    city: { type: String, required: true },
    pics: { type: [String], required: false },
    monitors: { type: [{
                _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
                name: { type: String, required: true },
            }] },
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
exports.AutoEcole = AutoEcole;
const Student = mongoose_1.default.model("Student", new mongoose_1.default.Schema({
    autoEcoleId: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // required: true car quand l'ae va créer les comptes, on crééra un mot de passe par défaut qui sera communiqué à l'élève
    acceptNotifications: { type: Boolean, required: true }, // required: true car par défaut on enverra des notifications
}));
exports.Student = Student;
const User = mongoose_1.default.model("User", new mongoose_1.default.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    acceptNotifications: { type: Boolean, required: true },
}));
exports.User = User;
//# sourceMappingURL=Users.js.map