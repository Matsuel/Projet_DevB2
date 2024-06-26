import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import Carte from '@/Components/Carte_Resultats';
import { useRouter } from 'next/router';
import { handleAutoEcoleClick } from '@/Functions/Router';
import { socket } from './_app';

const Resultats: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const [city, setCity] = useState<string>('');
  const [results, setResults] = useState<AutoEcoleSearch[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (query.city) {
        setCity(query.city as string);
        socket.emit('results', { search: query.city });
        socket.on('results', (data: any) => {
          setResults(data.autoEcoles);
        });
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
        {city && <h1>Résultats pour {city}</h1>}
        {results.length === 0 && <h1>Aucun résultat</h1>}
        <ul>
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
