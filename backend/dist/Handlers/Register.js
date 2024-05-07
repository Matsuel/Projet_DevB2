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
const registerAutoEcoleHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        try {
            const response = yield (0, mongo_1.registerAutoEcole)(data, data.pics);
            console.log(response, 'response');
            if (response) {
                const token = jsonwebtoken_1.default.sign({ id: response.id }, process.env.SECRET, { expiresIn: '24h' });
                socket.emit('registerAutoEcole', { register: true, token: token });
            }
            else {
                socket.emit('registerAutoEcole', { register: false });
            }
        }
        catch (error) {
            socket.emit('registerAutoEcole', { register: false });
        }
    });
};
exports.registerAutoEcoleHandler = registerAutoEcoleHandler;
const registerNewDriverHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, mongo_1.registerNewDriver)(data);
            if (response) {
                const token = jsonwebtoken_1.default.sign({ id: response.id }, process.env.SECRET, { expiresIn: '24h' });
                socket.emit('registerChercheur', { register: true, token: token });
            }
            else {
                socket.emit('registerChercheur', { register: false });
            }
        }
        catch (error) {
            socket.emit('registerChercheur', { register: false });
        }
    });
};
exports.registerNewDriverHandler = registerNewDriverHandler;
//# sourceMappingURL=Register.js.map