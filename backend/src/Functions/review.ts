import mongoose from "mongoose"
import { reviewAutoecoleSchema } from "../MongoModels/Review";


export const createReview = (reviewContent: any, id: string) => {
    return {
        rate: reviewContent.stars > 0 ? reviewContent.stars : null,
        comment: reviewContent.comment,
        creatorId: id,
        date: new Date()
    }
}

export const findAutoEcoleReviews = async (id : string) => {
    const reviews = mongoose.model('reviewsAutoecole_' + id, reviewAutoecoleSchema);
    return await reviews.find();
}

export const findMonitorReviews = async (id : string) => {
    const reviews = mongoose.model('reviewsMonitor_' + id, reviewAutoecoleSchema);
    return await reviews.find();
}