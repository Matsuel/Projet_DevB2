import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import ReactStars from 'react-stars';
import styles from '@/styles/add.module.css';

const Add: React.FC = () => {

  const [autoecolestar, setAutoecolestar] = useState(0);
  const [autoecolecomment, setAutoecolecomment] = useState('');
  const [prof1star, setProf1ecolestar] = useState(0);
  const [prof1ecolecomment, setProf1ecolecomment] = useState('');

  useEffect(() => {
    console.log(autoecolestar);
  }, [autoecolestar]);

  const handleAutoecoleStarsChange = (value: number) => {
    setAutoecolestar(value);
  }

  const handleAutoecoleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAutoecolecomment(event.target.value);
  }

  const handleProf1StarsChange = (value: number) => {
    setProf1ecolestar(value);
  }

  const handleProf1CommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProf1ecolecomment(event.target.value);
  }

  const handleSubmitAutoecole = () => {
    // Handle submission logic for autoecole
  }

  const handleSubmitProf1 = () => {
    // Handle submission logic for prof1
  }

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
            value={autoecolestar}
            onChange={handleAutoecoleStarsChange}
          />
          <textarea id="autoecole-comment" placeholder='Commentaire' className={styles.add} required onChange={handleAutoecoleCommentChange} />
          <button type="button" onClick={handleSubmitAutoecole}>avis ecole</button>

          <h2>Super nom de prof</h2>
          <ReactStars
            count={5}
            size={24}
            color2={'#ffd700'}
            value={prof1star}
            onChange={handleProf1StarsChange}
          />
          <textarea id="prof1-comment" placeholder='Commentaire' className={styles.add} required onChange={handleProf1CommentChange} />
          <button type="button" onClick={handleSubmitProf1}>avis prof1</button>
        </form>
      </main>
    </div>
  );
};

export default Add;
