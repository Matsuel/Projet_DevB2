import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";

const Checkout: React.FC = () => {
  return (
    <div>
    <Head>
      <title>Checkout</title>
    </Head>
    <main>
      <Header />
    </main>
  </div>
  );
};

export default Checkout;
