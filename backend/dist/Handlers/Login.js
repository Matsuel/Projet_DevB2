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
exports.loginHandler = void 0;
const mongo_1 = require("../Functions/mongo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginHandler = (socket) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { mail, password } = data;
            const user = yield (0, mongo_1.login)({ mail, password });
            if (user.login) {
                const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' });
                socket.emit('login', { login: true, token: token });
            }
            else {
                socket.emit('login', { login: false });
            }
        }
        catch (error) {
            socket.emit('login', { login: false });
        }
    });
};
exports.loginHandler = loginHandler;
//# sourceMappingURL=Login.js.map