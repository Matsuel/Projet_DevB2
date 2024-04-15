import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import ReactStars from 'react-stars';
import styles from '@/styles/add.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ReviewMonitor } from '@/types/Monitor';
import { getToken } from '@/Functions/Token';
import {jwtDecode} from 'jwt-decode';
import { fetchData, handleSubmitAutoecole, handleSubmitMonitor } from '@/Functions/Add';

interface AutoEcoleReview {
  stars: number;
  comment: string;
}

const Add: React.FC = () => {

  const router = useRouter();

  const [autoecoleReview, setAutoecoleReview] = useState<AutoEcoleReview>({ stars: 0, comment: '' });
  const [monitorsReview, setMonitorsReview] = useState<ReviewMonitor[]>([]);

  let token = getToken(router, jwtDecode);

  useEffect(() => {    
    token && token !== '' ? fetchData(setMonitorsReview, token as string, router) : router.push('/login');
  }, []);

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
          <button type="button" onClick={()=>handleSubmitAutoecole(router, autoecoleReview,token as string)}>avis autoecole</button>

          {monitorsReview.map((monitor, index) => {
            return (
              <div key={index}>
                <h2>{monitor.name}</h2>
                <ReactStars
                  count={5}
                  size={24}
                  color2={'#ffd700'}
                  value={monitor.stars}
                  onChange={(newRating) => {
                    const newMonitorsReview = [...monitorsReview];
                    newMonitorsReview[index].stars = newRating;
                    setMonitorsReview(newMonitorsReview);
                  }}
                />
                <textarea id="prof1-comment" placeholder='Commentaire' className={styles.add} required onChange={(e) => {
                  const newMonitorsReview = [...monitorsReview];
                  newMonitorsReview[index].comment = e.target.value;
                  setMonitorsReview(newMonitorsReview);
                }} />
                <button type="button" onClick={() => handleSubmitMonitor(monitor, token as string, router)}>
                  avis prof1</button>
              </div>
            )
          })}
        </form>
      </main>
    </div>
  );
};

export default Add;
