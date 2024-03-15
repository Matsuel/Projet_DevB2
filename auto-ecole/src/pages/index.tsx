import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header from "@/Components/Header";
import { useEffect, useState } from "react";
import { debounce } from 'lodash';
import axios from 'axios';

export default function Home() {

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
      console.log(response.data);
    }
  }, 1000);

  useEffect(() => {
    localStorage.getItem('token') ? null : window.location.href = '/login';
  });

  return (
    <div>
      <Head>
        <title>Accueil</title>
      </Head>
      <main>
        <Header />
        <h1>Wow incroyable ce site d'avis</h1>
        <div>
          <input placeholder="Rechercherrrrr" className={styles.rechercher} onChange={(e) => handleSearch(e.target.value)} />
          <button className={styles.search}>Go go</button>
        </div>

      </main>
    </div>
  );
}
