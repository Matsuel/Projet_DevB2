import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";

const Compte: React.FC = () => {
  return (
    <div>
    <Head>
      <title>Compte</title>
    </Head>
    <main>
      <Header />
    </main>
  </div>
  );
};

export default Compte;
