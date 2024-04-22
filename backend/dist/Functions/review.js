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
exports.findMonitorReviews = exports.findAutoEcoleReviews = exports.createReview = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Review_1 = require("../MongoModels/Review");
const createReview = (reviewContent, id) => {
    return {
        rate: reviewContent.stars > 0 ? reviewContent.stars : null,
        comment: reviewContent.comment,
        creatorId: id,
        date: new Date()
    };
};
exports.createReview = createReview;
const findAutoEcoleReviews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = mongoose_1.default.model('reviewsAutoecole_' + id, Review_1.reviewAutoecoleSchema);
    return yield reviews.find();
});
exports.findAutoEcoleReviews = findAutoEcoleReviews;
const findMonitorReviews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = mongoose_1.default.model('reviewsMonitor_' + id, Review_1.reviewAutoecoleSchema);
    return yield reviews.find();
});
exports.findMonitorReviews = findMonitorReviews;
//# sourceMappingURL=review.js.map