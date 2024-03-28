import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/chat.module.css'; 
import ConvCard from '@/Components/Chat_Conv_Card';
import ChatCard from '@/Components/Chat_Card';
import { io } from 'socket.io-client';
import { ConversationInformations, Message } from '@/types/Chat';
import { getMessages, sendMessage } from '@/Functions/Chat';
import { jwtDecode } from "jwt-decode";

const Chat: React.FC = () => {

  const [socket, setSocket] = useState<any>(null);
  const [conversationsList, setConversationsList] = useState<ConversationInformations[]>([]);
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [conversationActive, setConversationActive] = useState<string>('');
  const [userId , setUserId] = useState<string>('');

  const handleConversationActive = (id: string) => {
    setConversationActive(id);
    getMessages(id, localStorage.getItem('token') as string, socket);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newSocket = io('http://localhost:4000');
      setSocket(newSocket);
      const token = localStorage.getItem('token');
      if (token) {
        setUserId((jwtDecode(token) as { id: string }).id);
        console.log((jwtDecode(token) as { id: string }).id);
        newSocket.emit('connection', { id: token });

        newSocket.emit('getConversations', { id: token });
        newSocket.on('conversations', (data) => {
          setConversationsList(data.conversations);
        });

        newSocket.on('getMessages', (data) => {
          console.log(data);
          setMessagesList(data.messages);
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
            {
                conversationsList.map((conversation) => {
                  return (
                    <ConvCard date='Il y a 3 jours' id={conversation._id} message='bonjourno' handleConversationActive={handleConversationActive}/>
                  );
                })
              }
            
          </div>
          <div className={styles.rightColumn}>
            <div>
              <ChatCard id="12" message='bonjourno' date="Il y a 3 jours" position='left'/>
              <ChatCard id="12" message='bonjourno' date="Il y a 3 jours" position='right'/>
              {messagesList.map((message) => {
                return (
                  <ChatCard id={message.senderId} message={message.content} date={message.date.toString()} position={message.senderId === userId ? 'right' : 'left'}/>
                );
              })}
            </div>
            <div className={styles.inputHolder}>
              <input placeholder='write' className={styles.input} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(conversationActive, localStorage.getItem('token') as string, e.currentTarget.value, socket);
                  e.currentTarget.value = '';
              }}}/>
              <button type="submit" >Send</button>
            </div>
            
          </div>
      </div>

    </main>
  </div>
  );
};

export default Chat;
