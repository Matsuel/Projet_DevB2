import mongoose from "mongoose";
import { getAutoEcole, getAutosEcoles } from "../Functions/mongo";
import { createReview, findAutoEcoleReviews, findMonitorReviews } from "../Functions/review";
import { getIdFromToken } from "../Functions/token";
import { AutoEcole, Student } from "../MongoModels/Users";
import { updateNote } from "../Functions/note";
import { reviewAutoecoleSchema } from "../MongoModels/Review";

export const autoEcoleHandler = (socket: any) => {
    return async (data: any) => {
        try {
            const autoEcole = await getAutoEcole(data.id);
            const reviewsList = await findAutoEcoleReviews(data.id);
            let monitorsReviews: any[] = [];
            // @ts-ignore
            for (let i = 0; i < autoEcole.monitors.length; i++) {
                // @ts-ignore
                monitorsReviews.push(await findMonitorReviews(autoEcole.monitors[i]._id));
            }
            socket.emit('autoEcole', { autoEcole: autoEcole, reviews: reviewsList, monitorsReviews: monitorsReviews });
        } catch (error) {
            console.log(error);
        }
    };
}

export const autoEcolesHandler = (socket: any) => {
    return async (data: any) => {
        try {
            socket.emit('autoEcoles', { autoEcoles: await getAutosEcoles() });
        } catch (error) {
            console.log(error);
        }
    }
}

export const autoEcoleInfosHandler = (socket: any) => {
    return async (data: any) => {
        console.log(data);
        try {
            const token = data.token;
            const id = getIdFromToken(token);
            const student = await Student.findById(id);
            if (student) {
                const autoEcole = await AutoEcole.findById(student.autoEcoleId).select('monitors name');
                socket.emit('autoecoleinfos', { autoEcole: autoEcole });
            } else {
                socket.emit('autoecoleinfos', { autoEcole: null });
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const reviewsAEHandler = (socket: any) => {
    return async (data: any) => {
        try {
            console.log(data);
            const reviewContent = data.review;
            console.log(reviewContent);
            const token = data.token;
            const id = getIdFromToken(token);
            const student = await Student.findById(id);
            if (student) {
                let autoEcoleModel = mongoose.model('reviewsAutoecole_' + student.autoEcoleId, reviewAutoecoleSchema);
                await autoEcoleModel.create(createReview(reviewContent, id));
                if (reviewContent.stars !== 0) {
                    let autoEcole = await AutoEcole.findById(student.autoEcoleId);
                    autoEcole.note = updateNote(autoEcole, reviewContent);
                    autoEcole.noteCount = Number(autoEcole.noteCount) + 1;
                    await autoEcole.save();
                }
                socket.emit('reviewsautoecole', { posted: true, autoEcoleId: student.autoEcoleId });
            } else {
                socket.emit('reviewsautoecole', { posted: false });
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// export const AESortedHandler = async (req, res) => {
//     try {
//         const autoEcoles = await AutoEcole.find().select('name note');
//         const autoEcolesSorted = autoEcoles.sort((a, b) => Number(b.note) - Number(a.note));
//         res.send({ autoEcoles: autoEcolesSorted });
//     } catch (error) {
//         console.log(error);
//     }
// }

export const AESortedHandler = (socket: any) => {
    return async (data: any) => {
        try {
            const autoEcoles = await AutoEcole.find().select('name note');
            const autoEcolesSorted = autoEcoles.sort((a, b) => Number(b.note) - Number(a.note));
            socket.emit('autosecolesclass', { autoEcoles: autoEcolesSorted });
        } catch (error) {
            console.log(error);
        }
    }
}