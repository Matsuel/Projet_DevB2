import { searchAutoEcole } from "../Functions/mongo";
import { searchInCitiesFiles } from "../Functions/search";

export const searchHandler = (socket: any) => {
    return async (data: any) => {
        try {
            const cities = await searchInCitiesFiles(data.search);
            const autoEcoles = await searchAutoEcole(data.search);
            socket.emit('search', { cities: cities, autoEcoles: autoEcoles });
        } catch (error) {
            console.log(error);
            socket.emit('search', { cities: [], autoEcoles: [] });
        }
    }
}

export const resultsHandler = (socket: any) => {
    return async (data: any) => {
        try {
            const autoEcoles = await searchAutoEcole(data.search);
            socket.emit('results', { autoEcoles: autoEcoles });
        } catch (error) {
            console.log(error);
            socket.emit('results', { autoEcoles: [] });
        }
    }
}