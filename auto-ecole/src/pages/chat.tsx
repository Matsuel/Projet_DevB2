import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/chat.module.css'; 
import ConvCard from '@/Components/Chat_Conv_Card';
import ChatCard from '@/Components/Chat_Card';
import { io } from 'socket.io-client';
import { ConversationInformations } from '@/types/Chat';

const Chat: React.FC = () => {

  const [conversationsList, setConversationsList] = useState<ConversationInformations[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const socket = io('http://localhost:4000');
      const token = localStorage.getItem('token');
      if (token) {
        socket.emit('connection', { id: token });

        socket.emit('getConversations', { id: token });
        socket.on('conversations', (data) => {
          console.log(data.conversations[0]);
          setConversationsList(data.conversations);
        });
      }
    }
  }, []);

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
            {
                conversationsList.map((conversation) => {
                  console.log(conversation._id);
                  return (
                    <ConvCard date='Il y a 3 jours' id={conversation._id} message='bonjourno'/>
                  );
                })
              }
            
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
