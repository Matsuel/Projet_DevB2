import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import ReactStars from 'react-stars';
import styles from '@/styles/add.module.css';
import axios from 'axios';

interface AutoEcoleReview {
  stars: number;
  comment: string;
}

interface MonitorReview {
  stars: number;
  comment: string;
}

const Add: React.FC = () => {

  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }

  const [autoecoleReview, setAutoecoleReview] = useState<AutoEcoleReview>({ stars: 0, comment: '' });
  // const [monitorsReview, setMonitorsReview] = useState<MonitorReview[]>([]);

  const handleSubmitAutoecole = async () => {
    const response = await axios.post('http://localhost:3500/reviewsautoecole', { review: autoecoleReview, token: token });
    console.log(response.data);
  };

  return (
    <div>
      <Head>
        <title>Add</title>
      </Head>
      <main>
        <Header />
        <form>
          <h1>Super nom d'auto ecole</h1>
          <ReactStars
            count={5}
            size={24}
            color2={'#ffd700'}
            value={autoecoleReview.stars}
            onChange={(newRating) => setAutoecoleReview({ ...autoecoleReview, stars: newRating })}
          />
          <textarea id="autoecole-comment" placeholder='Commentaire' className={styles.add} required onChange={(e) => setAutoecoleReview({ ...autoecoleReview, comment: e.target.value })} />
          <button type="button" onClick={handleSubmitAutoecole}>avis autoecole</button>

          <h2>Super nom de prof</h2>
          <ReactStars
            count={5}
            size={24}
            color2={'#ffd700'}
          // value={prof1star}
          // onChange={handleProf1StarsChange}
          />
          <textarea id="prof1-comment" placeholder='Commentaire' className={styles.add} required />
          <button type="button">avis prof1</button>
        </form>
      </main>
    </div>
  );
};

export default Add;
