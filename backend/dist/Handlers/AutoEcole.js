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
exports.AESortedHandler = exports.reviewsAEHandler = exports.autoEcoleInfosHandler = exports.autoEcolesHandler = exports.autoEcoleHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongo_1 = require("../Functions/mongo");
const review_1 = require("../Functions/review");
const token_1 = require("../Functions/token");
const Users_1 = require("../MongoModels/Users");
const note_1 = require("../Functions/note");
const Review_1 = require("../MongoModels/Review");
const autoEcoleHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const autoEcole = yield (0, mongo_1.getAutoEcole)(data.id);
            const reviewsList = yield (0, review_1.findAutoEcoleReviews)(data.id);
            let monitorsReviews = [];
            // @ts-ignore
            for (let i = 0; i < autoEcole.monitors.length; i++) {
                // @ts-ignore
                monitorsReviews.push(yield (0, review_1.findMonitorReviews)(autoEcole.monitors[i]._id));
            }
            socket.emit('autoEcole', { autoEcole: autoEcole, reviews: reviewsList, monitorsReviews: monitorsReviews });
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.autoEcoleHandler = autoEcoleHandler;
const autoEcolesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({ autoEcoles: yield (0, mongo_1.getAutosEcoles)() });
    }
    catch (error) {
        console.log(error);
    }
});
exports.autoEcolesHandler = autoEcolesHandler;
const autoEcoleInfosHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        try {
            const token = data.token;
            const id = (0, token_1.getIdFromToken)(token);
            const student = yield Users_1.Student.findById(id);
            if (student) {
                const autoEcole = yield Users_1.AutoEcole.findById(student.autoEcoleId).select('monitors name');
                socket.emit('autoecoleinfos', { autoEcole: autoEcole });
            }
            else {
                socket.emit('autoecoleinfos', { autoEcole: null });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.autoEcoleInfosHandler = autoEcoleInfosHandler;
// export const reviewsAEHandler = async (req, res) => {
//     try {
//         const reviewContent = req.body.review;
//         const token = req.body.token;
//         const id = getIdFromToken(token);
//         const student = await Student.findById(id);
//         if (student) {
//             let autoEcoleModel = mongoose.model('reviewsAutoecole_' + student.autoEcoleId, reviewAutoecoleSchema);
//             await autoEcoleModel.create(createReview(reviewContent, id));
//             if (reviewContent.stars !== 0) {
//                 let autoEcole = await AutoEcole.findById(student.autoEcoleId);
//                 autoEcole.note = updateNote(autoEcole, reviewContent);
//                 autoEcole.noteCount = Number(autoEcole.noteCount) + 1;
//                 await autoEcole.save();
//             }
//             res.send({ posted: true, autoEcoleId: student.autoEcoleId });
//         } else {
//             res.send({ posted: false });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }
const reviewsAEHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(data);
            const reviewContent = data.review;
            console.log(reviewContent);
            const token = data.token;
            const id = (0, token_1.getIdFromToken)(token);
            const student = yield Users_1.Student.findById(id);
            if (student) {
                let autoEcoleModel = mongoose_1.default.model('reviewsAutoecole_' + student.autoEcoleId, Review_1.reviewAutoecoleSchema);
                yield autoEcoleModel.create((0, review_1.createReview)(reviewContent, id));
                if (reviewContent.stars !== 0) {
                    let autoEcole = yield Users_1.AutoEcole.findById(student.autoEcoleId);
                    autoEcole.note = (0, note_1.updateNote)(autoEcole, reviewContent);
                    autoEcole.noteCount = Number(autoEcole.noteCount) + 1;
                    yield autoEcole.save();
                }
                socket.emit('reviewsautoecole', { posted: true, autoEcoleId: student.autoEcoleId });
            }
            else {
                socket.emit('reviewsautoecole', { posted: false });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.reviewsAEHandler = reviewsAEHandler;
const AESortedHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const autoEcoles = yield Users_1.AutoEcole.find().select('name note');
        const autoEcolesSorted = autoEcoles.sort((a, b) => Number(b.note) - Number(a.note));
        res.send({ autoEcoles: autoEcolesSorted });
    }
    catch (error) {
        console.log(error);
    }
});
exports.AESortedHandler = AESortedHandler;
//# sourceMappingURL=AutoEcole.js.map