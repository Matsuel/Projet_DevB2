import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";

const Dashboard: React.FC = () => {
  return (
    <div>
    <Head>
      <title>Dashboard</title>
    </Head>
    <main>
      <Header />
    </main>
  </div>
  );
};

export default Dashboard;
