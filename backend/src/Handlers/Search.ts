import { searchAutoEcole } from "../Functions/mongo";
import { searchInCitiesFiles } from "../Functions/search";


export const searchHandler = async (req, res) => {
    try {
        const cities = await searchInCitiesFiles(req.query.search as string);
        const autoEcoles = await searchAutoEcole(req.query.search as string);
        res.send({ cities: cities, autoEcoles: autoEcoles });
    } catch (error) {
        console.log(error);
        res.send({ cities: [], autoEcoles: [] });
    }
}

export const resultsHandler = async (req, res) => {
    try {
        const autoEcoles = await searchAutoEcole(req.query.search as string);
        res.send({ autoEcoles: autoEcoles });
    } catch (error) {
        console.log(error);
        res.send({ autoEcoles: [] });
    }
}