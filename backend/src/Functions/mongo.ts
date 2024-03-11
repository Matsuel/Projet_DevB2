import mongoose from "mongoose";
import { AutoEcoleInterface } from "../Interfaces/Users";
import { AutoEcole } from "../MongoModels/Users";

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
    // enregistrer l'auto-école dans la base de données
    const autoEcole = await AutoEcole.findOne({ $or: [{ email: data.mail }, { nom: data.name }] });
    if (autoEcole) {
        socket.emit('registerResponse', { register : false });
    }else {
        const newAutoEcole = new AutoEcole({
            name: data.name,
            email: data.mail,
            password: data.password,
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

export default connectToMongo;

export { registerAutoEcole };
