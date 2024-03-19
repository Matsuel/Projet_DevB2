import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import ReactStars from 'react-stars';
import styles from '@/styles/add.module.css';



const Add: React.FC = () => {

  return (
    <div>
    <Head>
      <title>Add</title>
    </Head>
    <main>
      <Header />
      

      <h1>Super nom d'auto ecole</h1>
      <form id="autoecole">
        <ReactStars 
        count={5} 
        size={24} 
        color2={'#ffd700'} 
        value={0}
        // onChange={ratingChanged}
        />    
        <textarea id="autoecole-comment" placeholder='Commentaire' className={styles.add} required/> 
        <button type="submit">avis ecole</button>
      </form>

      <h2>Super nom de prof</h2>
      <form id="prof1">
        <ReactStars 
        count={5} 
        size={24} 
        color2={'#ffd700'} 
        value={0}
        // onChange={ratingChanged}
        />    
        <textarea id="prof1-comment" placeholder='Commentaire' className={styles.add} required/> 
        <button type="submit">avis prof1</button>
      </form>
    </main>
  </div>
  );
};

export default Add;
