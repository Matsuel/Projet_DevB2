import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import Carte from '@/Components/Carte_Resultats';

const Resultats: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Resultats</title>
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
