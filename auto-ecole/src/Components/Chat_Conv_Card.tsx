import React from 'react';
import styles from '@/styles/ConvCard.module.css'; 

interface CarteProps {
  id: string;
  message: string;
  date: string;
  handleConversationActive: any;
}

const Carte: React.FC<CarteProps> = ({ id, message, date,handleConversationActive }) => {
  return (
    <div className={styles.main} onClick={() => handleConversationActive(id)}>
      <h2>{id}</h2>
      <h3>{message}</h3>
      <h3>{date}</h3>
    </div>
  );
};

export default Carte;
