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
exports.registerChercheur = exports.registerAutoEcole = void 0;
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
function registerAutoEcole(data, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        // ajouter champ pour les anciens élèves
        // pour chaque élève, on crééra un mot de passe et on enverra un mail pour qu'il puisse se connecter
        const autoEcole = yield Users_1.AutoEcole.findOne({ $or: [{ email: data.mail }, { nom: data.name }] });
        if (autoEcole) {
            socket.emit('registerResponse', { register: false });
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
            });
            yield newAutoEcole.save();
            socket.emit('registerResponse', { register: true });
        }
    });
}
exports.registerAutoEcole = registerAutoEcole;
function registerChercheur(data, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Users_1.User.findOne({ email: data.mail });
        if (user) {
            socket.emit('registerResponse', { register: false });
        }
        else {
            const newUser = new Users_1.User({
                email: data.mail,
                password: yield bcrypt_1.default.hash(data.password, 10),
                acceptNotifications: data.notifs,
            });
            yield newUser.save();
            socket.emit('registerResponse', { register: true });
        }
    });
}
exports.registerChercheur = registerChercheur;
exports.default = connectToMongo;
//# sourceMappingURL=mongo.js.map