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
exports.getMessages = exports.searchAutoEcole = exports.getAutosEcoles = exports.getAutoEcole = exports.login = exports.registerChercheur = exports.registerAutoEcole = exports.deleteAccount = exports.editNotifications = exports.editAccount = exports.getUserInfosById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Users_1 = require("../MongoModels/Users");
const Review_1 = require("../MongoModels/Review");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Conversation_1 = require("../MongoModels/Conversation");
function connectToMongo() {
    mongoose_1.default.connect("mongodb://localhost:27017/autoecoles", {})
        .then(() => {
        console.log("Connected to MongoDB");
    })
        .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });
}
function registerAutoEcole(data, file) {
    return __awaiter(this, void 0, void 0, function* () {
        // ajouter champ pour les anciens élèves
        // pour chaque élève, on crééra un mot de passe et on enverra un mail pour qu'il puisse se connecter
        const autoEcole = yield Users_1.AutoEcole.findOne({ $or: [{ email: data.mail }, { nom: data.name }] });
        if (autoEcole) {
            return { register: false };
        }
        else {
            typeof data.monitors === 'string' ? data.monitors = JSON.parse(data.monitors) : null;
            typeof data.formations === 'string' ? data.formations = JSON.parse(data.formations) : null;
            typeof data.students === 'string' ? data.students = JSON.parse(data.students) : null;
            let newAutoEcole = new Users_1.AutoEcole({});
            for (const key in data) {
                if (key === 'monitors') {
                    newAutoEcole.monitors = data.monitors.map((monitor) => ({
                        _id: new mongoose_1.default.Types.ObjectId(),
                        name: monitor
                    }));
                }
                else if (key === 'password') {
                    newAutoEcole.password = yield bcrypt_1.default.hash(data.password, 10);
                }
                else if (key === 'mail') {
                    newAutoEcole.email = data.mail;
                }
                else {
                    newAutoEcole[key] = data[key];
                }
            }
            newAutoEcole.pics = file.buffer.toString('base64');
            newAutoEcole.note = 0;
            newAutoEcole.noteCount = 0;
            yield newAutoEcole.save();
            yield registerStudents(data.mail);
            yield createReviewsCollections(data.mail);
            return { register: true, id: newAutoEcole._id };
        }
    });
}
exports.registerAutoEcole = registerAutoEcole;
function createReviewsCollections(mail) {
    return __awaiter(this, void 0, void 0, function* () {
        const newAutoEcole = yield Users_1.AutoEcole.findOne({ email: mail });
        let reviewsCollection = mongoose_1.default.model('reviewsAutoecole_' + newAutoEcole._id, Review_1.reviewAutoecoleSchema);
        reviewsCollection.createCollection();
        newAutoEcole.monitors.forEach((monitor) => __awaiter(this, void 0, void 0, function* () {
            reviewsCollection = mongoose_1.default.model('reviewsMonitor_' + monitor._id, Review_1.reviewMonitorSchema);
            reviewsCollection.createCollection();
        }));
    });
}
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
            const userId = (yield Users_1.User.findOne({ email: data.mail }))._id;
            return { register: true, id: userId };
        }
    });
}
exports.registerChercheur = registerChercheur;
// fonction à appeler pour enregistrer les élèves si l'auto-école est validée
function registerStudents(emailAutoEcole) {
    return __awaiter(this, void 0, void 0, function* () {
        const autoEcole = yield Users_1.AutoEcole.findOne({ email: emailAutoEcole });
        const autoEcoleId = autoEcole._id;
        console.log(autoEcole.students);
        const studentsToSave = [];
        for (const student of autoEcole.students) {
            if ((yield studentAlreadySave(student)) === false) {
                const randomPassword = genereatePassword();
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
function getAutoEcole(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const autoEcole = yield Users_1.AutoEcole.findOne({ _id: id }).select('-password');
            return autoEcole;
        }
        catch (error) {
            return { find: false };
        }
    });
}
exports.getAutoEcole = getAutoEcole;
function getAutosEcoles() {
    return __awaiter(this, void 0, void 0, function* () {
        const autoEcoles = yield Users_1.AutoEcole.find().select('-password');
        return autoEcoles;
    });
}
exports.getAutosEcoles = getAutosEcoles;
function searchAutoEcole(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const autoEcoles = yield Users_1.AutoEcole.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { city: { $regex: query, $options: 'i' } }
            ]
        }).select('_id name address zip city note');
        return autoEcoles;
    });
}
exports.searchAutoEcole = searchAutoEcole;
function getMessages(conversationId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const conversationShema = mongoose_1.default.model('conversation_' + conversationId, Conversation_1.ConversationShema);
        const messages = yield conversationShema.find();
        return messages;
    });
}
exports.getMessages = getMessages;
function getUserInfosById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let userType = yield getAccountType(id);
        let user;
        if (userType === 'student') {
            user = yield Users_1.Student.findById(id).select('email acceptNotifications');
        }
        else if (userType === 'user') {
            user = yield Users_1.User.findById(id).select('email acceptNotifications');
        }
        else {
            user = yield Users_1.AutoEcole.findById(id).select('-password');
        }
        return user;
    });
}
exports.getUserInfosById = getUserInfosById;
function getAccountType(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield Users_1.Student.findById(id);
        let isStudent = true;
        let isUser = false;
        console.log(user, "student");
        if (!user) {
            user = yield Users_1.User.findById(id);
            console.log(user, "user");
            isStudent = false;
            isUser = true;
            if (!user) {
                user = yield Users_1.AutoEcole.findById(id);
                console.log(user, "autoecole");
                isUser = false;
            }
        }
        return isStudent ? 'student' : isUser ? 'user' : 'autoecole';
    });
}
function editAccount(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let type = yield getAccountType(id);
        let user = type === 'student' ? yield Users_1.Student.findById(id) : type === 'user' ? yield Users_1.User.findById(id) : yield Users_1.AutoEcole.findById(id);
        console.log(user);
        if (yield bcrypt_1.default.compare(data.password, user.password)) {
            if (data.newPassword && data.newPassword === data.newPasswordConfirm) {
                user.password = yield bcrypt_1.default.hash(data.newPassword, 10);
            }
            if (data.email) {
                user.email = data.email;
            }
            yield user.save();
            return true;
        }
        return false;
    });
}
exports.editAccount = editAccount;
function editNotifications(id, value) {
    return __awaiter(this, void 0, void 0, function* () {
        let type = yield getAccountType(id);
        let user = type === 'student' ? yield Users_1.Student.findById(id) : type === 'user' ? yield Users_1.User.findById(id) : null;
        user.acceptNotifications = value;
        yield user.save();
    });
}
exports.editNotifications = editNotifications;
function deleteAccount(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let type = yield getAccountType(id);
        if (type === 'student') {
            yield Users_1.Student.findByIdAndDelete(id);
            return true;
        }
        else if (type === 'user') {
            yield Users_1.User.findByIdAndDelete(id);
            return true;
        }
        return false;
    });
}
exports.deleteAccount = deleteAccount;
exports.default = connectToMongo;
//# sourceMappingURL=mongo.js.map