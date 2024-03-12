import React from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/autoecole.module.css';


const Autoecole: React.FC = () => {
  return (
    <div>
    <Head>
      <title>Autoecole</title>
    </Head>
    <main>
      <Header />
      <h1 id="nom">nom</h1>
      <h2 id="tel">big numero telefono</h2>
      <h3 id="address">address</h3>
      <h3 id="photos">super photos</h3>
      <ul>
        <li id="prof1">Prof 1</li>
        <li id="prof2">Prof 2</li>
      </ul> 
      <h1 className={styles.title}>Moyen de paiement</h1>
      <ul>
        <li >Carte?</li>
        <li >Cheque?</li>
        <li >Especes?</li>
      </ul>

      <h1 className={styles.title}>Labels de qualité, atouts et garanties:</h1>
      <ul>
        <li >certifiée Qualiopi?</li>
        <li >label de qualité ?</li>
        <li >certification qualicert?</li>
        <li >garanite financiere?</li>
        <li >Etablissement datadocké?</li>
      </ul>

      <h1 className={styles.title}>Modes de financement:</h1>
      <ul>
        <li >CPF?</li>
        <li >Aide apprentis?</li>
        <li >Permis 1€?</li>
        <li >Financement france travail?</li>
      </ul>


      <h1 className={styles.title}>Formations:</h1>
      <ul>
        <li >Formation uno</li>
        <li >Formation dos</li>
      </ul>
    </main>
  </div>
  );
};

export default Autoecole;
