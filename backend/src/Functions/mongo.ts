import mongoose from "mongoose";
import { AutoEcoleInterface, UserInterface } from "../Interfaces/Users";
import { AutoEcole, Student, User } from "../MongoModels/Users";
import bcrypt from 'bcrypt';

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

async function registerAutoEcole(data: AutoEcoleInterface, socket: any) {
    // ajouter champ pour les anciens élèves
    // pour chaque élève, on crééra un mot de passe et on enverra un mail pour qu'il puisse se connecter
    const autoEcole = await AutoEcole.findOne({ $or: [{ email: data.mail }, { nom: data.name }] });
    if (autoEcole) {
        socket.emit('registerResponse', { register : false });
    }else {
        const newAutoEcole = new AutoEcole({
            name: data.name,
            email: data.mail,
            password: await bcrypt.hash(data.password, 10),
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
        await newAutoEcole.save();
        socket.emit('registerResponse', { register : true });
        await registerStudents(data.mail);
    }
}

async function registerChercheur(data: UserInterface, socket: any) {
    const user = await User.findOne({ email: data.mail });
    if (user) {
        socket.emit('registerResponse', { register : false });
    }else {
        const newUser = new User({
            email: data.mail,
            password: await bcrypt.hash(data.password, 10),
            acceptNotifications: data.notifs,
        });
        await newUser.save();
        socket.emit('registerResponse', { register : true });
    }
}

// fonction à appeler pour enregistrer les élèves si l'auto-école est validée
//voir pour register les students que s'ils ne sont pas déjà enregistrés
async function registerStudents(emailAutoEcole: string) {
    const autoEcole = await AutoEcole.findOne({ email: emailAutoEcole });
    const autoEcoleId = autoEcole._id;
    const students = autoEcole.students as string[];
    const studentsToSave = [];
    for (const student of students) {
        const randomPassword = genereatePassword();
        console.log(randomPassword);
        const newStudent = new Student({
            autoEcoleId: autoEcoleId,
            email: student,
            password: await bcrypt.hash(randomPassword, 10),
            acceptNotifications: true,
        });
        await newStudent.save();
        studentsToSave.push({ email: student, password: randomPassword });
    }
    saveToFile(studentsToSave);
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

export default connectToMongo;

export { registerAutoEcole, registerChercheur };
