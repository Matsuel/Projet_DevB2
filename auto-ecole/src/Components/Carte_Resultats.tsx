import React from 'react';
import styles from '@/styles/Carte.module.css'; 
import ReactStars from 'react-stars';

interface CarteProps {
  nom: string;
  address: string;
  stars: number;
}

const Carte: React.FC<CarteProps> = ({ nom, address, stars }) => {
  return (
    <div className={styles.main}>
      <h2>{nom}</h2>
      <h3>{address}</h3>
      <ReactStars 
        count={5} 
        size={24} 
        color2={'#ffd700'} 
        value={stars}
        edit={false}
      />     
    </div>
  );
};

export default Carte;
