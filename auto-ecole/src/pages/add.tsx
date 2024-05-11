import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import ReactStars from 'react-stars';
import styles from '@/styles/add.module.scss';
import { useRouter } from 'next/router';
import { ReviewMonitor } from '@/types/Monitor';
import { getToken } from '@/Functions/Token';
import { jwtDecode } from 'jwt-decode';
import { fetchData, handleSubmitAutoecole, handleSubmitMonitor } from '@/Functions/Add';
import { socket } from './_app';

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
    if (token && token !== '') {
      fetchData(setMonitorsReview, token as string, router);
    } else {
      router.push('/login');
    }
  }, []);


  socket.on('autoecoleinfos', (data: any) => {
    if (data.autoEcole) {
      const newMonitorsReview = data.autoEcole.monitors.map((monitor: any) => {
        return { stars: 0, comment: '', name: monitor.name, _id: monitor._id };
      });
      setMonitorsReview(newMonitorsReview);
    }
  });

  socket.on('reviewsautoecole', (data: any) => {
    if (data.posted) {
      router.push('/autoecole/' + data.autoEcoleId);
    } else {
      alert('Erreur lors de la publication de l\'avis');
    }
  });

  socket.on('reviewsmonitor', (data: any) => {
    if (data.posted) {
      router.push('/autoecole/' + data.autoEcoleId);
    } else {
      alert('Erreur lors de la publication de l\'avis');
    }
  });

  return (
    <div>
      <Head>
        <title>Add</title>
      </Head>
      <main>
        <Header />
        <div className={styles.main}>
          <form className={styles.form}>
            <h1 className={styles.title}>Super nom d&apos;auto ecole</h1>
            <ReactStars
              className={styles.stars}
              count={5}
              size={24}
              color2={'#ffd700'}
              value={autoecoleReview.stars}
              onChange={(newRating) => setAutoecoleReview({ ...autoecoleReview, stars: newRating })}
            />
            <textarea id="autoecole-comment" placeholder='Commentaire' className={styles.inputText} required onChange={(e) => setAutoecoleReview({ ...autoecoleReview, comment: e.target.value })} />
            <button className={styles.buttonadd} type="button" onClick={() => handleSubmitAutoecole(router, autoecoleReview, token as string)}>Poster l&apos;avis sur l&apos;auto ecole</button>

            {monitorsReview.map((monitor, index) => {
              return (
                <div key={index} className={styles.form}>
                  <h2 className={styles.title}>{monitor.name}</h2>
                  <ReactStars
                    className={styles.stars}
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
                  <textarea id="prof1-comment" placeholder='Commentaire' className={styles.inputText} required onChange={(e) => {
                    const newMonitorsReview = [...monitorsReview];
                    newMonitorsReview[index].comment = e.target.value;
                    setMonitorsReview(newMonitorsReview);
                  }} />
                  <button type="button" onClick={() => handleSubmitMonitor(monitor, token as string, router)} className={styles.buttonadd}>Poster l&apos;avis prof1</button>
                </div>
              )
            })}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Add;
