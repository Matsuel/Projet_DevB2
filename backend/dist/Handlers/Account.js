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
exports.userInfosHandler = exports.editAEPersonnelHandler = exports.editAEInfosHandler = exports.deleteAccountHandler = exports.editNotifsHandler = exports.editAccountHandler = void 0;
const mongo_1 = require("../Functions/mongo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../Functions/token");
const editAccountHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        try {
            const id = data.id;
            const edit = yield (0, mongo_1.editAccount)(id, data.data);
            const token = edit ? jsonwebtoken_1.default.sign({ id: id }, process.env.SECRET, { expiresIn: '24h' }) : null;
            socket.emit('editAccount', { edited: edit, token });
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.editAccountHandler = editAccountHandler;
// export const editNotifsHandler = async (req, res) => {
//     try {
//         console.log(req.body);
//         const id = req.body.id;
//         const { acceptNotifications } = req.body.data;
//         await editNotifications(id, acceptNotifications);
//         res.send({ edited: true });
//     } catch (error) {
//         console.log(error);
//         res.send({ edited: false });
//     }
// }
const editNotifsHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = data.id;
            const { acceptNotifications } = data.data;
            yield (0, mongo_1.editNotifications)(id, acceptNotifications);
            socket.emit('editNotifs', { edited: true });
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.editNotifsHandler = editNotifsHandler;
const deleteAccountHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    res.send({ deleted: yield (0, mongo_1.deleteAccount)(id) });
});
exports.deleteAccountHandler = deleteAccountHandler;
const editAEInfosHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        res.send({ edited: yield (0, mongo_1.editAutoEcoleInfos)(id, req.body.data) });
    }
    catch (error) {
        console.log(error);
        res.send({ edited: false });
    }
});
exports.editAEInfosHandler = editAEInfosHandler;
const editAEPersonnelHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        res.send({ edited: yield (0, mongo_1.editAutoEcolePersonnelFormations)(id, req.body.data) });
    }
    catch (error) {
        console.log(error);
        res.send({ edited: false });
    }
});
exports.editAEPersonnelHandler = editAEPersonnelHandler;
const userInfosHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = data.token;
            const id = (0, token_1.getIdFromToken)(token);
            if (!id)
                return;
            const user = yield (0, mongo_1.getUserInfosById)(id);
            socket.emit('userInfos', user);
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.userInfosHandler = userInfosHandler;
//# sourceMappingURL=Account.js.map