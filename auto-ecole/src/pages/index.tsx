import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header from "@/Components/Header";
import { useEffect, useState } from "react";
import { debounce } from 'lodash';
import axios from 'axios';
import {useRouter} from 'next/router';
import { handleAutoEcoleClick, handleCityClick } from "@/Functions/Router";

export default function Home() {
  const router = useRouter();

  

  const [searchCities, setSearchCities] = useState<City[]>([]);
  const [searchAutoEcoles, setSearchAutoEcoles] = useState<AutoEcoleSearch[]>([]);

  const handleSearch = debounce(async (query) => {
    if (query.length === 0 || query.trim().length === 0) {
      setSearchCities([]);
      setSearchAutoEcoles([]);
      return;
    } else {
      const response = await axios.get('http://localhost:3500/search', { params: { search: query } });
      setSearchCities(response.data.cities);
      setSearchAutoEcoles(response.data.autoEcoles);
    }
  }, 1000);

  return (
    <div>
      <Head>
        <title>Accueil</title>
      </Head>
      <main>
        <Header />
        <h1>Bienvenue sur adopteunmoniteur.fr</h1>
        <div>
          <input placeholder="Rechercher une ville ou une auto-ecole" className={styles.rechercher} onChange={(e) => handleSearch(e.target.value)} />
          <button className={styles.search}>Rechercher</button>
        </div>
        {
          searchAutoEcoles.length > 0 &&
          <h1>Auto Ecoles:</h1>

        }
        {
          searchAutoEcoles.map((autoEcole) => {
            return (
              
              <div key={autoEcole._id} onClick={() => handleAutoEcoleClick(autoEcole._id, router)} className={styles.city}>
                <div className={styles.ecole_card}>
                  <h2>{autoEcole.name}</h2>
                  <p>Address: {autoEcole.address}</p>
                  <p>Rating: {autoEcole.note}/5</p>
                </div>
                
              </div>
            )
          })
        }
                {
          searchCities.length > 0 &&
          <h1 className={styles.top}>Villes:</h1>

        }
        {
          searchCities.map((city:City, index:number) => {
            return (
              <div key={index} onClick={() => handleCityClick(city.name, router)}>
                <h2 className={styles.city}>{city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase()}</h2>
              </div>
            )
          })
        }

      </main>
    </div>
  );
}
