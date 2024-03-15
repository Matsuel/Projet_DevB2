import datas from "../Utils/cities.json"
import { City } from "../Interfaces/City";

async function searchInCitiesFiles(search: string) {
    search = search.replace("-", " ");
    search = search.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    const cities: City[] = datas as City[]; // Cast datas to City[]
    const results = cities.filter((city) => city.name.includes(search));
    return results;    
}

export { searchInCitiesFiles }