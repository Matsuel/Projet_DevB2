import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/autoecole.module.scss';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AutoEcoleInfos } from '@/types/AutoEcole';
import { handleMonitorClick } from '@/Functions/Router';
import { socket } from '../_app';
import { geocode } from '@/Functions/Map';
import Map from '@/Components/Map';
import { LngLatLike } from 'mapbox-gl';

const Autoecole = () => {
  const router = useRouter();
  const { id } = router.query;
  const [center, setCenter] = useState<number[] | null>(null)

  const [data, setData] = useState<AutoEcoleInfos>();

  if (id && !data) {
    socket.emit('autoEcole', { id: id });
    socket.on('autoEcole', (data: any) => {
      setData(data);
    });
  }

  socket.on('createConversation', (data: any) => {
    if (data.created) {
      router.push(`/chat/${data.conversationId}`)
    }
  })

  useEffect(() => {
    const fetchGeocode = async () => {
      if (data) {
        const a = await geocode(data.autoEcole.address, data.autoEcole.city, data.autoEcole.zip);
        if (a) {
          setCenter(a)
        }
      }
    }
    fetchGeocode();
  }, [data])

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
        <div className={styles.main}>

          <div className={styles.infos}>
            <h1 id="nom" className={styles.title}><svg className={styles.house} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
              {data.autoEcole.name.charAt(0).toUpperCase() + data.autoEcole.name.slice(1)}
            </h1>
            <div className={styles.contact}>
              <h2 className={styles.contactText} id="tel">Phone: {data.autoEcole.phone}</h2>
              <h3 className={styles.contactText} id="address">Address: {data.autoEcole.address}</h3>
              <h3 className={styles.contactText} id="address">Zip: {data.autoEcole.zip}</h3>
              <h3 className={styles.contactText} id="address">City :{data.autoEcole.city}</h3>
              <h3 className={styles.contactText} id="address">Contact: {data.autoEcole.mail}</h3>
            </div>
            {
              data.autoEcole.pics != "" && <Image src={`data:image/jpeg;base64,${data.autoEcole.pics}`} alt="photo" className={styles.photo} width={0} height={0} />
            }
          </div>

          <div className={styles.map}>

            <h2 className={styles.title}>Localisation</h2>
            <h3 className={styles.contactText}>
              {data.autoEcole.address} {data.autoEcole.zip} {data.autoEcole.city}
            </h3>
            {center &&
              <Map
                coordinates={center as LngLatLike}
              />}
          </div>


          <div className={styles.aviss}>
            <h2 className={styles.title}>Avis sur l&apos;auto-école</h2>
            {data.autoEcole.monitors.map((monitor, index) => {
              return (
                <div className={styles.avis} key={monitor._id}>

                  <h3 key={monitor._id} onClick={() => handleMonitorClick(monitor._id, router)}><svg className={styles.person} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>{monitor.name}</h3>


                  <ul>
                    {data.monitorsReviews[index].map((review, index) => {
                      return (
                        <li key={index}>{review.rate ? review.rate + '/5 - ' : ''} {review.comment}</li>
                      )
                    })}
                  </ul>

                </div>
              )
            })}
          </div>

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

          <div className={styles.aviss}>
            {data.reviews.length > 0 && <h1 className={styles.title}>Avis:</h1>}
            {data.reviews.map((review, index) => {
              return (
                <div key={index} className={styles.avis}>
                  {review.rate ? review.rate + '/5 - ' : ''} {review.comment}
                </div>
              )
            })}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Autoecole;
