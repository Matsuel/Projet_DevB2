import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/chat.module.css'; 
import ConvCard from '@/Components/Chat_Conv_Card';
import ChatCard from '@/Components/Chat_Card';

const Chat: React.FC = () => {
  return (
    <div>
    <Head>
      <title>Chat</title>
    </Head>
    <main>
      <Header />
      <div className={styles.main}>
          <div className={styles.leftColumn}>
            <input placeholder='search'/>
            <button type="submit" >Search</button>
            <ConvCard id="12" message='bonjourno' date="Il y a 3 jours"/>
            
          </div>
          <div className={styles.rightColumn}>
            <div>
              <ChatCard id="12" message='bonjourno' date="Il y a 3 jours" position='left'/>
              <ChatCard id="12" message='bonjourno' date="Il y a 3 jours" position='right'/>
            </div>
            <div className={styles.inputHolder}>
              <input placeholder='write' className={styles.input}/>
              <button type="submit" >Send</button>
            </div>
            
          </div>
      </div>

    </main>
  </div>
  );
};

export default Chat;
