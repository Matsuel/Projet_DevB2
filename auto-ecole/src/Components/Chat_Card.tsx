import React from 'react';
import styles from '@/styles/ChatCard.module.css';

interface CarteProps {
  id: string;
  message: string;
  date: string;
  position: 'left' | 'right';
}

const Carte: React.FC<CarteProps> = ({ id, message, date, position }) => {
  const cardClass = position === 'left' ? styles.left : styles.right;

  return (
    <div className={`${styles.main} ${cardClass}`}>
      <h2>{id}</h2>
      <h3>{message}</h3>
      <h3>
        {
          new Date(date).getHours() + ":" +
          (new Date(date).getMinutes().toString().padStart(2, '0'))
        }
      </h3>
    </div>
  );
};

export default Carte;
