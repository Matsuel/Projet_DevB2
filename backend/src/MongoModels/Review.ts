import mongoose from "mongoose";

const reviewMonitorSchema = new mongoose.Schema({
    rate: { type: Number, required: false },
    comment: { type: String, required: true },
    creatorId: { type: String, required: true },
    date: { type: Date, required: true },
});

// reviewsMonitor+ monitorId = nom de la collection
// reviewsMonitor+ monitorId sera relié au monitorId de la collection Autoecoles
// quand on save une review autoecole, on modifie la note de l'autoecole et on incrémente noteCount sur la collection Autoecoles


const reviewAutoecoleSchema = new mongoose.Schema({
    rate: { type: Number, required: false },
    comment: { type: String, required: true },
    creatorId: { type: String, required: true },
    date: { type: Date, required: true },
});

// reviewsAutoecole+ autoecoleId = nom de la collection
// reviewsAutoecole+ autoecoleId sera relié au autoecoleId de la collection Autoecoles


export { reviewMonitorSchema, reviewAutoecoleSchema };