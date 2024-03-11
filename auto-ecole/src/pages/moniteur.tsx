import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";

const Moniteur: React.FC = () => {
  return (
    <div>
    <Head>
      <title>Moniteur</title>
    </Head>
    <main>
      <Header />
    </main>
  </div>
  );
};

export default Moniteur;
