import mongoose from "mongoose";
import { AutoEcoleInterface, LoginInterface, UserInterface } from "../Interfaces/Users";
import { AutoEcole, Student, User } from "../MongoModels/Users";
import { reviewAutoecoleSchema, reviewMonitorSchema } from "../MongoModels/Review";
import bcrypt from 'bcrypt';
import { ConversationShema } from "../MongoModels/Conversation";

function connectToMongo() {
    mongoose.connect("mongodb://localhost:27017/autoecoles", {
    })
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB", err);
        });
}

async function registerAutoEcole(data: AutoEcoleInterface, file: any) {
    // ajouter champ pour les anciens élèves
    // pour chaque élève, on crééra un mot de passe et on enverra un mail pour qu'il puisse se connecter
    const autoEcole = await AutoEcole.findOne({ $or: [{ email: data.mail }, { nom: data.name }] });
    if (autoEcole) {
        return { register: false };
    } else {
        typeof data.monitors === 'string' ? data.monitors = JSON.parse(data.monitors) : null;
        typeof data.formations === 'string' ? data.formations = JSON.parse(data.formations) : null;
        typeof data.students === 'string' ? data.students = JSON.parse(data.students) : null;
        let newAutoEcole = new AutoEcole({});
        for (const key in data) {
            if (key === 'monitors') {
                newAutoEcole.monitors = data.monitors.map((monitor) => ({
                    _id: new mongoose.Types.ObjectId(),
                    name: monitor
                }));
            } else if (key === 'password') {
                newAutoEcole.password = await bcrypt.hash(data.password, 10);
            } else if (key === 'mail') {
                newAutoEcole.email = data.mail;
            } else {
                newAutoEcole[key] = data[key];
            }
        }
        newAutoEcole.pics = file.buffer.toString('base64');
        newAutoEcole.note = 0;
        newAutoEcole.noteCount = 0;
        await newAutoEcole.save();
        await registerStudents(data.mail);
        await createReviewsCollections(data.mail);
        return { register: true, id: newAutoEcole._id };
    }
}

async function createReviewsCollections(mail: string) {
    const newAutoEcole = await AutoEcole.findOne({ email: mail });
    let reviewsCollection = mongoose.model('reviewsAutoecole_' + newAutoEcole._id, reviewAutoecoleSchema);
    reviewsCollection.createCollection();
    newAutoEcole.monitors.forEach(async (monitor: any) => {
        reviewsCollection = mongoose.model('reviewsMonitor_' + monitor._id, reviewMonitorSchema);
        reviewsCollection.createCollection();
    });
}

async function registerChercheur(data: UserInterface) {
    const user = await User.findOne({ email: data.mail });
    if (user) {
        return { register: false };
    } else {
        const newUser = new User({
            email: data.mail,
            password: await bcrypt.hash(data.password, 10),
            acceptNotifications: data.notifs,
        });
        await newUser.save();
        const userId = (await User.findOne({ email: data.mail }))._id;
        return { register: true, id: userId };
    }
}

// fonction à appeler pour enregistrer les élèves si l'auto-école est validée
async function registerStudents(emailAutoEcole: string) {
    const autoEcole = await AutoEcole.findOne({ email: emailAutoEcole });
    const autoEcoleId = autoEcole._id;
    console.log(autoEcole.students);
    const studentsToSave = [];
    for (const student of autoEcole.students) {
        if (await studentAlreadySave(student as string) === false) {
            const randomPassword = genereatePassword();
            const newStudent = new Student({
                autoEcoleId: autoEcoleId,
                email: student,
                password: await bcrypt.hash(randomPassword, 10),
                acceptNotifications: true,
            });
            await newStudent.save();
            studentsToSave.push({ email: student, password: randomPassword });
        }
    }
    saveToFile(studentsToSave);
}

async function studentAlreadySave(email: string) {
    let students = await Student.findOne({ email: email });
    if (students) return true;
    students = await User.findOne({ email: email });
    if (students) return true;
    students = await AutoEcole.findOne({ email: email });
    if (students) return true;
    return false;
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
function saveToFile(data: [string, string][]) {
    const fs = require('fs');
    if (!fs.existsSync('students.json')) {
        fs.writeFileSync('students.json', '[]');
    }
    fs.appendFile('students.json', JSON.stringify(data), (err: any) => {
        if (err) {
            console.error(err);
        }
    });
}

async function login(data: LoginInterface) {
    let user = await AutoEcole.findOne({ email: data.mail });
    if (!user) {
        user = await Student.findOne({ email: data.mail });
        if (!user) {
            user = await User.findOne({ email: data.mail });
            if (!user) {
                return { login: false };
            }
        }
    }

    if (await bcrypt.compare(data.password, user.password)) {
        return { login: true, id: user._id };
    } else {
        return { login: false };
    }
}

async function getAutoEcole(id: string) {
    try {
        const autoEcole = await AutoEcole.findOne({ _id: id }).select('-password');
        return autoEcole;
    } catch (error) {
        return { find: false };
    }
}

async function getAutosEcoles() {
    const autoEcoles = await AutoEcole.find().select('-password');
    return autoEcoles;
}

async function searchAutoEcole(query: string) {
    const autoEcoles = await AutoEcole.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { city: { $regex: query, $options: 'i' } }
        ]
    }).select('_id name address zip city note');
    return autoEcoles;
}

async function getMessages(conversationId: string, userId: string) {
    const conversationShema = mongoose.model('conversation_' + conversationId, ConversationShema);
    const messages = await conversationShema.find();
    return messages;
}

export default connectToMongo;

export { registerAutoEcole, registerChercheur, login, getAutoEcole, getAutosEcoles, searchAutoEcole, getMessages };
