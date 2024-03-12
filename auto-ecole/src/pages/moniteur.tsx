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
      <h1>nom de moniteur</h1>
      <h2>nom d'auto ecole, lien clickable</h2>
      <h2>address auto ecole</h2>
    </main>
  </div>
  );
};

export default Moniteur;
