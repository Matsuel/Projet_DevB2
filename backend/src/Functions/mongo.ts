import mongoose from "mongoose";
import { AutoEcoleInterface, UserInterface } from "../Interfaces/Users";
import { AutoEcole, User } from "../MongoModels/Users";
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
            moniteurs: data.monitors,
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
        await newAutoEcole.save();
        socket.emit('registerResponse', { register : true });
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

export default connectToMongo;

export { registerAutoEcole, registerChercheur };
