import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import ReactStars from 'react-stars';
import styles from '@/styles/add.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';

interface AutoEcoleReview {
  stars: number;
  comment: string;
}

interface MonitorReview {
  stars: number;
  comment: string;
  name?: string;
  _id?: string;
}

const Add: React.FC = () => {

  const router = useRouter();

  const [autoecoleReview, setAutoecoleReview] = useState<AutoEcoleReview>({ stars: 0, comment: '' });
  const [monitorsReview, setMonitorsReview] = useState<MonitorReview[]>([]);

  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }

  useEffect(() => {
    const fetchData = async () => {
      setMonitorsReview([]);
      const response = await axios.post('http://localhost:3500/autoecoleinfos', { token: token });
      if (response.data.autoEcole){
      const newMonitorsReview = response.data.autoEcole.monitors.map((monitor: any) => {
        return { stars: 0, comment: '', name: monitor.name, _id: monitor._id };
      });
      setMonitorsReview(newMonitorsReview);
    }else{
      router.push('/');
    }

    };
    fetchData();
  }, []);

  const handleSubmitAutoecole = async () => {
    const response = await axios.post('http://localhost:3500/reviewsautoecole', { review: autoecoleReview, token: token });
    if (response.data.posted) {
      router.push('/autoecole/' + response.data.autoEcoleId);
    } else {
      alert('Erreur lors de la publication de l\'avis');
    }
  };

  const handleSubmitMonitor = async (monitor: MonitorReview) => {
    const response = await axios.post('http://localhost:3500/reviewsmonitor', { review: monitor, token: token });
    console.log(response.data);
    if (response.data.posted) {
      router.push('/autoecole/' + response.data.autoEcoleId);
    } else {
      alert('Erreur lors de la publication de l\'avis');
    }
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
                <button type="button" onClick={() => handleSubmitMonitor(monitor)}>
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
