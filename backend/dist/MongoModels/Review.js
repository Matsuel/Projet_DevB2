"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewAutoecoleSchema = exports.reviewMonitorSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reviewMonitorSchema = new mongoose_1.default.Schema({
    rate: { type: Number, required: false },
    comment: { type: String, required: true },
    creatorId: { type: String, required: true },
    date: { type: Date, required: true },
});
exports.reviewMonitorSchema = reviewMonitorSchema;
// reviewsMonitor+ monitorId = nom de la collection
// reviewsMonitor+ monitorId sera relié au monitorId de la collection Autoecoles
// quand on save une review autoecole, on modifie la note de l'autoecole et on incrémente noteCount sur la collection Autoecoles
const reviewAutoecoleSchema = new mongoose_1.default.Schema({
    rate: { type: Number, required: false },
    comment: { type: String, required: true },
    creatorId: { type: String, required: true },
    date: { type: Date, required: true },
});
exports.reviewAutoecoleSchema = reviewAutoecoleSchema;
//# sourceMappingURL=Review.js.map