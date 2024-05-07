import mongoose from "mongoose";
import { findMonitorReviews } from "../Functions/review";
import { getIdFromToken } from "../Functions/token";
import { AutoEcole, Student } from "../MongoModels/Users";
import { ReviewMonitor } from "../Types/Review";
import { reviewAutoecoleSchema } from "../MongoModels/Review";
import { getMonitorAvg } from "../Functions/mongo";

export const monitorHandler = (socket: any) => {
    return async (data: any) => {
        try {
            const autoEcole = await AutoEcole.findOne({ 'monitors._id': data.id }, { 'monitors.$': 1 }).select('_id name')
            const monitor = await AutoEcole.findOne({ 'monitors._id': data.id }, { 'monitors.$': 1 });
            if (monitor) {
                socket.emit('monitor', { autoEcole: autoEcole, monitor: monitor, reviews: await findMonitorReviews(data.id) });
            } else {
                socket.emit('monitor', { monitor: null });
            }
        } catch (error) {
            socket.emit('monitor', { monitor: null });
        }
    };
};

export const reviewMonitorHandler = (socket: any) => {
    return async (data: any) => {
        console.log(data);
        try {
            const content: ReviewMonitor = data.review;
            const token = data.token;
            const id = getIdFromToken(token);
            const student = await Student.findById(id);
            if (student) {
                let monitors = await AutoEcole.findById(student.autoEcoleId).select('monitors');
                let monitorIndex = monitors.monitors.findIndex((monitor: any) => monitor._id.toString() === content._id);
                if (monitorIndex !== -1) {
                    let monitorReviewModel = mongoose.model('reviewsMonitor_' + content._id, reviewAutoecoleSchema);
                    let newReview = {
                        rate: content.stars > 0 ? content.stars : null,
                        comment: content.comment,
                        creatorId: id,
                        date: new Date()
                    };
                    await monitorReviewModel.create(newReview);
                    socket.emit('reviewsmonitor', { posted: true, autoEcoleId: student.autoEcoleId });
                } else {
                    socket.emit('reviewsmonitor', { posted: false });
                }
            } else {
                socket.emit('reviewsmonitor', { posted: false });
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const monitorsSortedHandler = (socket: any) => {
    return async (data: any) => {
        try {
            const moniteurs = await AutoEcole.find().select('monitors');
            let moniteursList: any[] = [];
            for (let i = 0; i < moniteurs.length; i++) {
                const monitorsWithAvgPromises = moniteurs[i].monitors.map(async monitor => ({
                    ...monitor.toObject(),
                    avg: await getMonitorAvg(monitor._id.toString())
                }));
                const monitorsWithAvg = await Promise.all(monitorsWithAvgPromises);
                moniteursList.push(...monitorsWithAvg);
            }
            const moniteursSorted = moniteursList.sort((a, b) => Number(b.avg) - Number(a.avg));
            socket.emit('moniteursclass', { moniteurs: moniteursSorted });
        } catch (error) {
            console.log(error);
        }
    }
}