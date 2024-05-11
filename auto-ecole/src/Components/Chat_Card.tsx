import React from 'react';
import styles from '@/styles/ChatCard.module.scss';

interface CarteProps {
  id: string;
  message: string;
  date: string;
  position: 'left' | 'right';
  ref ?: any;
}

const Carte: React.FC<CarteProps> = ({ id, message, date, position, ref }) => {
  const cardClass = position === 'left' ? styles.left : styles.right;

  if (ref) {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className={`${styles.main} ${cardClass}`} ref={ref} key={id}>
      {/* <h2>{id}</h2> */}
      <h3 className={styles.messageText}>{message}</h3>
      <h3 className={styles.messageDate}>
        {
          new Date(date).getHours() + ":" +
          (new Date(date).getMinutes().toString().padStart(2, '0'))
        }
      </h3>
    </div>
  );
};

export default Carte;
