import mongoose from "mongoose";
import { findMonitorReviews } from "../Functions/review";
import { getIdFromToken } from "../Functions/token";
import { AutoEcole, Student } from "../MongoModels/Users";
import { ReviewMonitor } from "../Types/Review";
import { reviewAutoecoleSchema } from "../MongoModels/Review";
import { getMonitorAvg } from "../Functions/mongo";


export const monitorHandler = async (req, res) => {
    try {
        const autoEcole = await AutoEcole.findOne({ 'monitors._id': req.params.id }, { 'monitors.$': 1 }).select('_id name')
        const monitor = await AutoEcole.findOne({ 'monitors._id': req.params.id }, { 'monitors.$': 1 });
        if (monitor) {
            res.send({ autoEcole: autoEcole, monitor: monitor, reviews: await findMonitorReviews(req.params.id) });
        } else {
            res.send({ monitor: null });
        }
    } catch (error) {
        console.log(error);
    }
}

export const reviewMonitorHandler = async (req, res) => {
    try {
        const content: ReviewMonitor = req.body.review;
        const token = req.body.token;
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
                res.send({ posted: true, autoEcoleId: student.autoEcoleId });
            } else {
                res.send({ posted: false });
            }
        } else {
            res.send({ posted: false });
        }
    } catch (error) {
        console.log(error);
    }
}

export const monitorsSortedHandler = async (req, res) => {
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
        res.send({ moniteurs: moniteursSorted });
    } catch (error) {
        console.log(error);
    }
}