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
exports.registerNewDriverHandler = exports.registerAutoEcoleHandler = void 0;
const mongo_1 = require("../Functions/mongo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerAutoEcoleHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const file = req.file;
        const response = yield (0, mongo_1.registerAutoEcole)(data, file);
        if (response) {
            req.session.userId = response.id;
            const token = jsonwebtoken_1.default.sign({ id: response.id }, process.env.SECRET, { expiresIn: '24h' });
            res.send({ register: true, token: token });
        }
        else {
            res.send({ register: false });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ register: false });
    }
});
exports.registerAutoEcoleHandler = registerAutoEcoleHandler;
const registerNewDriverHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const response = yield (0, mongo_1.registerNewDriver)(data);
        if (response) {
            req.session.userId = response.id;
            const token = jsonwebtoken_1.default.sign({ id: response.id }, process.env.SECRET, { expiresIn: '24h' });
            res.send({ register: true, token: token });
        }
        else {
            res.send({ register: false });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ register: false });
    }
});
exports.registerNewDriverHandler = registerNewDriverHandler;
//# sourceMappingURL=Register.js.map