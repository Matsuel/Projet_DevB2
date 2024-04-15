import React, { useEffect, useState } from 'react';
import Header from '@/Components/Header';
import Head from 'next/head';
import useSWR from 'swr';
import axios from 'axios';
import { useRouter } from 'next/router';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);


const Classement = () => {

    const router = useRouter();

    const [showAutoEcole, setShowAutoEcole] = useState<boolean>(false);
    const [showMoniteur, setShowMoniteur] = useState<boolean>(false);
    const [autosEcoles, setAutosEcoles] = useState<any[]>([]);
    const [moniteurs, setMoniteurs] = useState<any[]>([]);

    const { data: autoEcoleData } = useSWR('http://localhost:3500/autosecolesclass', fetcher);
    const { data: moniteurData } = useSWR('http://localhost:3500/moniteursclass', fetcher);
    console.log(moniteurData);
    useEffect(() => {
        if(autoEcoleData && moniteurData) {
            setAutosEcoles(autoEcoleData.autoEcoles);
            setMoniteurs(moniteurData.moniteurs);
        }
    }, [autoEcoleData, moniteurData]);
    if(!autoEcoleData || !moniteurs) return <div>Chargement...</div>;

    return (
        <div>
            <Head>
                <title>Classement</title>
            </Head>
            <Header />

            <button onClick={() => setShowAutoEcole(!showAutoEcole)}>Voir les auto-écoles</button>
            {
                showAutoEcole ? (
                    autosEcoles.map((autoEcole: any, index: number) => (
                        <div key={index}>
                            <h1>{autoEcole.name}</h1>
                            <p>{autoEcole.note}</p>
                        </div>
                    ))
                ) : (
                    null
                )
            }

            <button onClick={() => setShowMoniteur(!showMoniteur)}>Voir les moniteurs</button>
            {
                showMoniteur ? (
                    moniteurs.map((moniteur: any, index: number) => (
                        <div key={index}>
                            <h1>{moniteur.name}</h1>
                            <p>{moniteur.avg}</p>
                        </div>
                    ))
                ) : (
                    null
                )
            }
            
        </div>
    );
};

export default Classement;