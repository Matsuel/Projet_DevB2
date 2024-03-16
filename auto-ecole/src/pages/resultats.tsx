import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import Carte from '@/Components/Carte_Resultats';
import { useRouter } from 'next/router';

const Resultats: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const [city, setCity] = useState<string>('');
  useEffect(() => {
    if (query.city) {
      setCity(query.city as string);
    }
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
        </ul>
      </main>
    </div>
  );
};

export default Resultats;
