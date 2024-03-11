import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";

const Chat: React.FC = () => {
  return (
    <div>
    <Head>
      <title>Chat</title>
    </Head>
    <main>
      <Header />
    </main>
  </div>
  );
};

export default Chat;
