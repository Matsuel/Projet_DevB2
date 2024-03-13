import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header from "@/Components/Header";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    localStorage.getItem('token') ? null: window.location.href = '/login';
  });

  return (
    <div>
      <Head>
        <title>Accueil</title>
      </Head>
      <main>
        <Header />
        <h1>Wow incroyable ce site d'avis</h1>
        <div>
          <input placeholder="Rechercherrrrr" className={styles.rechercher}/>
          <button className={styles.search}>Go go</button>
        </div>
        
      </main>
    </div>
  );
}
