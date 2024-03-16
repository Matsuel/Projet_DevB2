import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import Carte from '@/Components/Carte_Resultats';
import { useRouter } from 'next/router';
import axios from 'axios';
import { handleAutoEcoleClick } from '@/Functions/Router';

const Resultats: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const [city, setCity] = useState<string>('');
  const [results, setResults] = useState<AutoEcoleSearch[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (query.city) {
        setCity(query.city as string);
        const response = await axios.get('http://localhost:3500/results', { params: { search: query.city } })
        console.log(response.data);
        setResults(response.data.autoEcoles);

      }
    }
    fetchData();
  }, [query]);

  return (
    <div>
      <Head>
        <title>
          Resultats {city ? `pour ${city}` : ''}
        </title>
      </Head>
      <main>
        <Header />
        <ul>
          <li><Carte nom="oui" address="non" stars={3.5} /></li>
          <li><Carte nom="bruh" address="non" stars={0.5} /></li>
          <li><Carte nom="odzedzdeui" address="dzedezdddd" stars={5} /></li>
          {results.map((autoEcole) => {
            return (
              <li key={autoEcole._id} onClick={() => handleAutoEcoleClick(autoEcole._id, router)}>
                <Carte nom={autoEcole.name} address={`${autoEcole.address} ${autoEcole.zip} ${autoEcole.city}`} stars={autoEcole.note}/>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  );
};

export default Resultats;
