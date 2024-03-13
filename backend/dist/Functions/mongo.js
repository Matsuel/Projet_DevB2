"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registerChercheur = exports.registerAutoEcole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Users_1 = require("../MongoModels/Users");
const bcrypt_1 = __importDefault(require("bcrypt"));
function connectToMongo() {
    mongoose_1.default.connect("mongodb://localhost:27017/autoecoles", {})
        .then(() => {
        console.log("Connected to MongoDB");
    })
        .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });
}
function registerAutoEcole(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // ajouter champ pour les anciens élèves
        // pour chaque élève, on crééra un mot de passe et on enverra un mail pour qu'il puisse se connecter
        const autoEcole = yield Users_1.AutoEcole.findOne({ $or: [{ email: data.mail }, { nom: data.name }] });
        if (autoEcole) {
            return { register: false };
        }
        else {
            const newAutoEcole = new Users_1.AutoEcole({
                name: data.name,
                email: data.mail,
                password: yield bcrypt_1.default.hash(data.password, 10),
                address: data.address,
                pics: data.pics,
                monitors: data.monitors,
                phone: data.phone,
                card: data.card,
                cheque: data.cheque,
                especes: data.especes,
                qualiopi: data.qualiopi,
                label_qualite: data.label_qualite,
                qualicert: data.qualicert,
                garantie_fin: data.garantie_fin,
                datadocke: data.datadocke,
                cpf: data.cpf,
                aide_apprentis: data.aide_apprentis,
                permis1: data.permis1,
                fin_francetravail: data.fin_francetravail,
                formations: data.formations,
                students: data.students,
            });
            yield newAutoEcole.save();
            yield registerStudents(data.mail);
            const autoEcole = yield Users_1.AutoEcole.findOne({ email: data.mail });
            return { register: true, id: autoEcole._id };
        }
    });
}
exports.registerAutoEcole = registerAutoEcole;
function registerChercheur(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Users_1.User.findOne({ email: data.mail });
        if (user) {
            return { register: false };
        }
        else {
            const newUser = new Users_1.User({
                email: data.mail,
                password: yield bcrypt_1.default.hash(data.password, 10),
                acceptNotifications: data.notifs,
            });
            yield newUser.save();
            const user = yield Users_1.User.findOne({ email: data.mail });
            return { register: true, id: user._id };
        }
    });
}
exports.registerChercheur = registerChercheur;
// fonction à appeler pour enregistrer les élèves si l'auto-école est validée
function registerStudents(emailAutoEcole) {
    return __awaiter(this, void 0, void 0, function* () {
        const autoEcole = yield Users_1.AutoEcole.findOne({ email: emailAutoEcole });
        const autoEcoleId = autoEcole._id;
        const students = autoEcole.students;
        const studentsToSave = [];
        for (const student of students) {
            if (!studentAlreadySave(student)) {
                const randomPassword = genereatePassword();
                console.log(randomPassword);
                const newStudent = new Users_1.Student({
                    autoEcoleId: autoEcoleId,
                    email: student,
                    password: yield bcrypt_1.default.hash(randomPassword, 10),
                    acceptNotifications: true,
                });
                yield newStudent.save();
                studentsToSave.push({ email: student, password: randomPassword });
            }
        }
        saveToFile(studentsToSave);
    });
}
function studentAlreadySave(email) {
    return __awaiter(this, void 0, void 0, function* () {
        let students = yield Users_1.Student.findOne({ email: email });
        if (students)
            return true;
        students = yield Users_1.User.findOne({ email: email });
        if (students)
            return true;
        students = yield Users_1.AutoEcole.findOne({ email: email });
        if (students)
            return true;
        return false;
    });
}
function genereatePassword() {
    let password = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 15; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}
// sauvegarde dans un fichier an attendant de pouvoir envoyer un mail
function saveToFile(data) {
    const fs = require('fs');
    if (!fs.existsSync('students.json')) {
        fs.writeFileSync('students.json', '[]');
    }
    fs.appendFile('students.json', JSON.stringify(data), (err) => {
        if (err) {
            console.error(err);
        }
    });
}
function login(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield Users_1.AutoEcole.findOne({ email: data.mail });
        if (!user) {
            user = yield Users_1.Student.findOne({ email: data.mail });
            if (!user) {
                user = yield Users_1.User.findOne({ email: data.mail });
                if (!user) {
                    return { login: false };
                }
            }
        }
        if (yield bcrypt_1.default.compare(data.password, user.password)) {
            return { login: true, id: user._id };
        }
        else {
            return { login: false };
        }
    });
}
exports.login = login;
exports.default = connectToMongo;
//# sourceMappingURL=mongo.js.map