import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/chat.module.scss';
import ConvCard from '@/Components/Chat_Conv_Card';
import ChatCard from '@/Components/Chat_Card';
import { ConversationInformations, Message } from '@/types/Chat';
import { getMessages, sendMessage } from '@/Functions/Chat';
import { jwtDecode } from "jwt-decode";
import { getToken } from '@/Functions/Token';
import { useRouter } from 'next/router';
import { socket } from './_app';

const Chat: React.FC = () => {

  const router = useRouter();

  const [conversationsList, setConversationsList] = useState<ConversationInformations[]>([]);
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [conversationActive, setConversationActive] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  let token = getToken(router, jwtDecode);

  const handleConversationActive = (id: string) => {
    if (id === conversationActive) return;
    setConversationActive(id);
    getMessages(id, token as string, socket);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        setUserId((jwtDecode(token) as { id: string }).id);
        socket.emit('connection', { id: token });

        socket.emit('getConversations', { id: token });
        socket.on('conversations', (data) => {
          setConversationsList(data.conversations);
        });

        socket.on('getMessages', (data) => {
          setMessagesList(data.messages);
        });
      } else {
        router.push('/login');
      }
    }
  }, []);

  const ref = React.createRef<HTMLDivElement>();

  return (
    <div>
      <Head>
        <title>Chat</title>
      </Head>
      <main>
        <Header />
        <div className={styles.main}>
          <div className={styles.leftColumn}>
            <input placeholder='search' />
            <button type="submit" >Search</button>
            {
              conversationsList.map((conversation) => {
                return (
                  <ConvCard
                    date={conversation.date.toString()}
                    id={conversation._id}
                    message={conversation.lastMessage}
                    handleConversationActive={handleConversationActive}
                  />
                );
              })
            }

          </div>
          <div className={styles.rightColumn}>
            <div>
              {messagesList.map((message,index) => {
                return (
                  <ChatCard id={message.senderId} message={message.content} date={message.date.toString()} position={message.senderId === userId ? 'right' : 'left'} ref={index === messagesList.length - 1 ? ref : undefined} />
                );
              })}
            </div>
            <div className={styles.inputHolder}>
              <input placeholder='write' className={styles.input} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(conversationActive, token as string, e.currentTarget.value, socket);
                  e.currentTarget.value = '';
                }
              }} />
              <button type="submit" >Send</button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Chat;
