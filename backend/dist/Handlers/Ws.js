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
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectionHandler = exports.connectionHandler = void 0;
const token_1 = require("../Functions/token");
const connectionHandler = (socket, connectedUsers) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = (0, token_1.getIdFromToken)(data.id);
            if (!id)
                return;
            connectedUsers[id] = socket;
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.connectionHandler = connectionHandler;
const disconnectionHandler = (socket, connectedUsers) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (let user in connectedUsers) {
                if (connectedUsers[user] === socket) {
                    delete connectedUsers[user];
                    break;
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.disconnectionHandler = disconnectionHandler;
//# sourceMappingURL=Ws.js.map