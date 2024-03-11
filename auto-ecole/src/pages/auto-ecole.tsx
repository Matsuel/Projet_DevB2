import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";

const Autoecole: React.FC = () => {
  return (
    <div>
    <Head>
      <title>Autoecole</title>
    </Head>
    <main>
      <Header />
    </main>
  </div>
  );
};

export default Autoecole;
