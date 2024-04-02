import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/autoecole.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useSWR from 'swr';
import { createConversation } from '@/Functions/Chat';
import { AutoEcoleInfos } from '@/types/AutoEcole';
import { handleMonitorClick } from '@/Functions/Router';

const fetcher = (url: string) => axios.get(url).then(res => res.data)

const Autoecole = () => {
  const router = useRouter();
  const {id} = router.query;

  const { data , error, isLoading } = useSWR<AutoEcoleInfos>(id && `http://localhost:3500/autoecole/${id}`, fetcher)

  if(isLoading || !data) return <div>Chargement...</div>
  if(error) return <div>Erreur</div>
  const { autoEcole, reviews, monitorsReviews } = data;

  return (

    <div>
      <Head>
        <title>
          {
            autoEcole.name ? autoEcole.name : "Autoecole"
          }
        </title>
      </Head>
      <main>
        <Header />
        <h1 id="nom">{autoEcole.name}</h1>
        <h2 id="tel">{autoEcole.phone}</h2>
        <h3 id="address">{autoEcole.address}</h3>
        <h3 id="address">{autoEcole.zip}</h3>
        <h3 id="address">{autoEcole.city}</h3>
        <h3 id="address">{autoEcole.mail}</h3>
        {
          autoEcole.pics != "" && <Image src={`data:image/jpeg;base64,${autoEcole.pics}`} alt="photo" width={200} height={200} />
        }
        <ul>
          {autoEcole.monitors.map((monitor, index) => {
            return (
              <>
              <li key={monitor._id} onClick={()=> handleMonitorClick(monitor._id, router)}>{monitor.name}</li>
              <ul>
                {monitorsReviews[index].map((review, index) => {
                  return (
                    <li key={index}>{review.rate ? review.rate + '/5 - ' : ''} {review.comment}</li>
                  )
                })}
              </ul>
              
              </>
            )
          })}
        </ul>

        {autoEcole.card || autoEcole.cheque || autoEcole.especes ? <h1 className={styles.title}>Moyen de paiement</h1> : null}
        <ul>
          {autoEcole.card ? <li >Carte</li> : null}
          {autoEcole.cheque ? <li >Cheque</li> : null}
          {autoEcole.especes ? <li >Especes</li> : null}
        </ul>


          {autoEcole.qualiopi || autoEcole.label_qualite || autoEcole.qualicert || autoEcole.garantie_fin || autoEcole.datadocke ? <h1 className={styles.title}>Labels de qualité, atouts et garanties:</h1> : null}
        <ul>
          {autoEcole.qualiopi ? <li >Certifiée Qualiopi</li> : null}
          {autoEcole.label_qualite ? <li >Label de qualité</li> : null}
          {autoEcole.qualicert ? <li >Certification qualicert</li> : null}
          {autoEcole.garantie_fin ? <li >Garantie financiere</li> : null}
          {autoEcole.datadocke ? <li >Etablissement datadocké</li> : null}
        </ul>

        {autoEcole.cpf || autoEcole.aide_apprentis || autoEcole.permis1 || autoEcole.fin_francetravail ? <h1 className={styles.title}>Modes de financement:</h1> : null}
        <ul>
          {autoEcole.cpf ? <li >CPF</li> : null}
          {autoEcole.aide_apprentis ? <li >Aide apprentis</li> : null}
          {autoEcole.permis1 ? <li >Permis 1€</li> : null}
          {autoEcole.fin_francetravail ? <li >Financement france travail</li> : null}
        </ul>


        <h1 className={styles.title}>Formations:</h1>
        <ul>
          {autoEcole.formations.map((formation, index) => {
            return (
              <li key={index}>{formation}</li>
            )
          })}
        </ul>

        {reviews.length > 0 && <h1 className={styles.title}>Avis:</h1>}
        <ul>
          {reviews.map((review, index) => {
            return (
              <li key={index}
              onClick={() => createConversation(review.creatorId, localStorage.getItem('token') as string)}
              >{review.rate ? review.rate + '/5 - ' : ''} {review.comment}</li>
            )
          })}
        </ul>
      </main>
    </div>
  );
};

export default Autoecole;
