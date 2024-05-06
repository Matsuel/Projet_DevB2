import React, { useState } from 'react';
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
import { getToken } from '@/Functions/Token';
import { jwtDecode } from 'jwt-decode';
import { socket } from '../_app';

const fetcher = (url: string) => axios.get(url).then(res => res.data)

const Autoecole = () => {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<AutoEcoleInfos>();

  if (id && !data) {
    socket.emit('autoEcole', { id: id });
    socket.on('autoEcole', (data: any) => {
      setData(data);
    });
  }

  if (!data) return <div>Chargement...</div>

  return (

    <div>
      <Head>
        <title>
          {
            data.autoEcole.name ? data.autoEcole.name : "Autoecole"
          }
        </title>
      </Head>
      <main>
        <Header />
        <h1 id="nom"><svg className={styles.house} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
        </svg>{data.autoEcole.name}</h1>
        <h2 id="tel">Phone: {data.autoEcole.phone}</h2>
        <h3 id="address">Address: {data.autoEcole.address}</h3>
        <h3 id="address">Zip: {data.autoEcole.zip}</h3>
        <h3 id="address">City :{data.autoEcole.city}</h3>
        <h3 id="address">Contact: {data.autoEcole.mail}</h3>
        {
          data.autoEcole.pics != "" && <Image src={`data:image/jpeg;base64,${data.autoEcole.pics}`} alt="photo" width={200} height={200} />
        }
        <ul>
          {data.autoEcole.monitors.map((monitor, index) => {
            return (
              <>

                <li key={monitor._id} onClick={() => handleMonitorClick(monitor._id, router)}><svg className={styles.person} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>{monitor.name}</li>
                <ul>
                  {data.monitorsReviews[index].map((review, index) => {
                    return (
                      <li key={index}>{review.rate ? review.rate + '/5 - ' : ''} {review.comment}</li>
                    )
                  })}
                </ul>

              </>
            )
          })}
        </ul>

        {data.autoEcole.card || data.autoEcole.cheque || data.autoEcole.especes ? <h1 className={styles.title}>Moyen de paiement</h1> : null}
        <ul>
          {data.autoEcole.card ? <li >Carte</li> : null}
          {data.autoEcole.cheque ? <li >Cheque</li> : null}
          {data.autoEcole.especes ? <li >Especes</li> : null}
        </ul>


        {data.autoEcole.qualiopi || data.autoEcole.label_qualite || data.autoEcole.qualicert || data.autoEcole.garantie_fin || data.autoEcole.datadocke ? <h1 className={styles.title}>Labels de qualité, atouts et garanties:</h1> : null}
        <ul>
          {data.autoEcole.qualiopi ? <li >Certifiée Qualiopi</li> : null}
          {data.autoEcole.label_qualite ? <li >Label de qualité</li> : null}
          {data.autoEcole.qualicert ? <li >Certification qualicert</li> : null}
          {data.autoEcole.garantie_fin ? <li >Garantie financiere</li> : null}
          {data.autoEcole.datadocke ? <li >Etablissement datadocké</li> : null}
        </ul>

        {data.autoEcole.cpf || data.autoEcole.aide_apprentis || data.autoEcole.permis1 || data.autoEcole.fin_francetravail ? <h1 className={styles.title}>Modes de financement:</h1> : null}
        <ul>
          {data.autoEcole.cpf ? <li >CPF</li> : null}
          {data.autoEcole.aide_apprentis ? <li >Aide apprentis</li> : null}
          {data.autoEcole.permis1 ? <li >Permis 1€</li> : null}
          {data.autoEcole.fin_francetravail ? <li >Financement france travail</li> : null}
        </ul>


        <h1 className={styles.title}>Formations:</h1>
        <ul>
          {data.autoEcole.formations.map((formation, index) => {
            return (
              <li key={index}>{formation}</li>
            )
          })}
        </ul>

        {data.reviews.length > 0 && <h1 className={styles.title}>Avis:</h1>}
        <ul>
          {data.reviews.map((review, index) => {
            return (
              <li key={index}>
                {review.rate ? review.rate + '/5 - ' : ''} {review.comment}
                </li>
            )
          })}
        </ul>
      </main>
    </div>
  );
};

export default Autoecole;
