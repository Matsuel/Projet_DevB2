import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/autoecole.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';

export interface AutoEcoleInterface {
  name: string;
  mail: string;
  address: string;
  zip: number;
  city: string;
  pics: string;
  monitors: MonitorProps[];
  phone: string;
  card: boolean;
  cheque: boolean;
  especes: boolean;
  qualiopi: boolean;
  label_qualite: boolean;
  qualicert: boolean;
  garantie_fin: boolean;
  datadocke: boolean;
  cpf: boolean;
  aide_apprentis: boolean;
  permis1: boolean;
  fin_francetravail: boolean;
  formations: string[];
  students: string[];
  note: number;
}

interface MonitorProps {
  _id: string;
  name: string;
}

interface ReviewAutoEcole {
  rate: number;
  comment: string;
}

const Autoecole: React.FC<{ id: string | undefined }> = ({ id }) => {
  const [datas, setDatas] = useState<AutoEcoleInterface>()
  const [reviews, setReviews] = useState<ReviewAutoEcole[]>([]);
  const router = useRouter();
  const idArray = router.query.id;
  useEffect(() => {
    const fetchData = async () => {
      if (idArray) {
        const id = idArray[idArray.length - 1];
        const data = await axios.get(`http://localhost:3500/autoecole/${id}`);
        console.log(data.data);
        if ('find' in data.data.autoEcole) {
          window.location.href = '/';
        } else {
          setDatas(data.data.autoEcole);
          setReviews(data.data.reviews);
        }
      }
    }
    fetchData();
  }, [idArray])
  return (

    <div>
      <Head>
        <title>
          {
            datas?.name ? datas.name : "Autoecole"
          }
        </title>
      </Head>
      <main>
        <Header />
        <h1 id="nom">{datas?.name}</h1>
        <h2 id="tel">{datas?.phone}</h2>
        <h3 id="address">{datas?.address}</h3>
        <h3 id="address">{datas?.zip}</h3>
        <h3 id="address">{datas?.city}</h3>
        <h3 id="address">{datas?.note}/5</h3>
        {
          datas?.pics != "" && <Image src={`data:image/jpeg;base64,${datas?.pics}`} alt="photo" width={200} height={200} />
        }
        <ul>
          {datas?.monitors.map((monitor) => {
            return (
              <li key={monitor._id}>{monitor.name}</li>
            )
          })}
        </ul>

        {datas?.card || datas?.cheque || datas?.especes ? <h1 className={styles.title}>Moyen de paiement</h1> : null}
        <ul>
          {datas?.card ? <li >Carte</li> : null}
          {datas?.cheque ? <li >Cheque</li> : null}
          {datas?.especes ? <li >Especes</li> : null}
        </ul>


        {datas?.qualiopi || datas?.label_qualite || datas?.qualicert || datas?.garantie_fin || datas?.datadocke ? <h1 className={styles.title}>Labels de qualité, atouts et garanties:</h1> : null}
        <ul>
          {datas?.qualiopi ? <li >Certifiée Qualiopi</li> : null}
          {datas?.label_qualite ? <li >Label de qualité</li> : null}
          {datas?.qualicert ? <li >Certification qualicert</li> : null}
          {datas?.garantie_fin ? <li >Garantie financiere</li> : null}
          {datas?.datadocke ? <li >Etablissement datadocké</li> : null}
        </ul>

        {datas?.cpf || datas?.aide_apprentis || datas?.permis1 || datas?.fin_francetravail ? <h1 className={styles.title}>Modes de financement:</h1> : null}
        <ul>
          {datas?.cpf ? <li >CPF</li> : null}
          {datas?.aide_apprentis ? <li >Aide apprentis</li> : null}
          {datas?.permis1 ? <li >Permis 1€</li> : null}
          {datas?.fin_francetravail ? <li >Financement france travail</li> : null}
        </ul>


        <h1 className={styles.title}>Formations:</h1>
        <ul>
          {datas?.formations.map((formation, index) => {
            return (
              <li key={index}>{formation}</li>
            )
          })}
        </ul>

        {reviews.length > 0 && <h1 className={styles.title}>Avis:</h1>}
        <ul>
          {reviews.map((review, index) => {
            return (
              <li key={index}>{review.rate}/5 - {review.comment}</li>
            )
          })}
        </ul>
      </main>
    </div>
  );
};

export default Autoecole;
