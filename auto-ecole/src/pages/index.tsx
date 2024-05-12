import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Header from "@/Components/Header";
import { useState } from "react";
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { handleAutoEcoleClick, handleCityClick } from "@/Functions/Router";
import { socket } from "./_app";

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
      socket.emit('search', { search: query });
      socket.on('search', (data: any) => {
        setSearchCities(data.cities);
        setSearchAutoEcoles(data.autoEcoles);
      });
    }
  }, 1000);

  return (
    <div>
      <Head>
        <title>Accueil</title>
      </Head>
      <main>
        <Header />
        <div className={styles.main}>
          <h1 className={styles.title}>Bienvenue sur adopteunmoniteur.fr</h1>
          <div className={styles.searchcont}>
            <input placeholder="Rechercher une ville ou une auto-ecole" className={styles.rechercher} onChange={(e) => handleSearch(e.target.value)} />
          </div>
        </div>
        <div className={styles.resultscont}>
          <div>

            {
              searchAutoEcoles.length > 0 &&
              <h1>Auto Ecoles:</h1>

            }
            {
              searchAutoEcoles.map((autoEcole) => {
                return (

                  <div key={autoEcole._id} onClick={() => handleAutoEcoleClick(autoEcole._id, router)} className={styles.city}>
                    <div className={styles.ecole_card}>
                      <h2><svg className={styles.home} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                      </svg>{autoEcole.name}</h2>
                      <p>Address: {autoEcole.address}</p>
                      <p>Rating: {autoEcole.note}/5</p>
                    </div>

                  </div>
                )
              })
            }
          </div>
          <div>
            {
              searchCities.length > 0 &&
              <h1 className={styles.top}>Villes:</h1>

            }
            {
              searchCities.map((city: City, index: number) => {
                return (
                  <div key={index} onClick={() => handleCityClick(city.name, router)} className={styles.city_container}>
                    <h2><svg className={styles.home} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg> {city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase()}</h2>
                  </div>
                )
              })
            }
          </div>
        </div>
      </main>
    </div>
  );
}
