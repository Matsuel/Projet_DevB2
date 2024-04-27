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
exports.resultsHandler = exports.searchHandler = void 0;
const mongo_1 = require("../Functions/mongo");
const search_1 = require("../Functions/search");
const searchHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cities = yield (0, search_1.searchInCitiesFiles)(req.query.search);
        const autoEcoles = yield (0, mongo_1.searchAutoEcole)(req.query.search);
        res.send({ cities: cities, autoEcoles: autoEcoles });
    }
    catch (error) {
        console.log(error);
        res.send({ cities: [], autoEcoles: [] });
    }
});
exports.searchHandler = searchHandler;
const resultsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const autoEcoles = yield (0, mongo_1.searchAutoEcole)(req.query.search);
        res.send({ autoEcoles: autoEcoles });
    }
    catch (error) {
        console.log(error);
        res.send({ autoEcoles: [] });
    }
});
exports.resultsHandler = resultsHandler;
//# sourceMappingURL=Search.js.map