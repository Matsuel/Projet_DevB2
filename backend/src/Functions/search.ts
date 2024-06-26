import datas from "../Utils/cities.json"
import { City } from "../Types/City";

async function searchInCitiesFiles(search: string) {
    search = search.replace("-", " ");
    search = search.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    const cities: City[] = datas as City[]; // Cast datas to City[]
    let results: City[] = [];
    cities.forEach((city) => {
        if (city.name.toLowerCase().includes(search.toLowerCase()) && results.length < 10) {
            results.push(city);
        }
    })
    return results
}

export { searchInCitiesFiles }