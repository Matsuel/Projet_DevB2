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
exports.monitorsSortedHandler = exports.reviewMonitorHandler = exports.monitorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const review_1 = require("../Functions/review");
const token_1 = require("../Functions/token");
const Users_1 = require("../MongoModels/Users");
const Review_1 = require("../MongoModels/Review");
const mongo_1 = require("../Functions/mongo");
const monitorHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const autoEcole = yield Users_1.AutoEcole.findOne({ 'monitors._id': data.id }, { 'monitors.$': 1 }).select('_id name');
            const monitor = yield Users_1.AutoEcole.findOne({ 'monitors._id': data.id }, { 'monitors.$': 1 });
            if (monitor) {
                socket.emit('monitor', { autoEcole: autoEcole, monitor: monitor, reviews: yield (0, review_1.findMonitorReviews)(data.id) });
            }
            else {
                socket.emit('monitor', { monitor: null });
            }
        }
        catch (error) {
            socket.emit('monitor', { monitor: null });
        }
    });
};
exports.monitorHandler = monitorHandler;
const reviewMonitorHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        try {
            const content = data.review;
            const token = data.token;
            const id = (0, token_1.getIdFromToken)(token);
            const student = yield Users_1.Student.findById(id);
            if (student) {
                let monitors = yield Users_1.AutoEcole.findById(student.autoEcoleId).select('monitors');
                let monitorIndex = monitors.monitors.findIndex((monitor) => monitor._id.toString() === content._id);
                if (monitorIndex !== -1) {
                    let monitorReviewModel = mongoose_1.default.model('reviewsMonitor_' + content._id, Review_1.reviewAutoecoleSchema);
                    let newReview = {
                        rate: content.stars > 0 ? content.stars : null,
                        comment: content.comment,
                        creatorId: id,
                        date: new Date()
                    };
                    yield monitorReviewModel.create(newReview);
                    socket.emit('reviewsmonitor', { posted: true, autoEcoleId: student.autoEcoleId });
                }
                else {
                    socket.emit('reviewsmonitor', { posted: false });
                }
            }
            else {
                socket.emit('reviewsmonitor', { posted: false });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.reviewMonitorHandler = reviewMonitorHandler;
const monitorsSortedHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const moniteurs = yield Users_1.AutoEcole.find().select('monitors');
            let moniteursList = [];
            for (let i = 0; i < moniteurs.length; i++) {
                const monitorsWithAvgPromises = moniteurs[i].monitors.map((monitor) => __awaiter(void 0, void 0, void 0, function* () {
                    return (Object.assign(Object.assign({}, monitor.toObject()), { avg: yield (0, mongo_1.getMonitorAvg)(monitor._id.toString()) }));
                }));
                const monitorsWithAvg = yield Promise.all(monitorsWithAvgPromises);
                moniteursList.push(...monitorsWithAvg);
            }
            const moniteursSorted = moniteursList.sort((a, b) => Number(b.avg) - Number(a.avg));
            socket.emit('moniteursclass', { moniteurs: moniteursSorted });
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.monitorsSortedHandler = monitorsSortedHandler;
//# sourceMappingURL=Monitor.js.map