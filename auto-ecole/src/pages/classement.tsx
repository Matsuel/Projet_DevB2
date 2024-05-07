import React, { useEffect, useState } from 'react';
import Header from '@/Components/Header';
import Head from 'next/head';
import { socket } from './_app';

const Classement = () => {

    const [showAutoEcole, setShowAutoEcole] = useState<boolean>(false);
    const [showMoniteur, setShowMoniteur] = useState<boolean>(false);
    const [autosEcoles, setAutosEcoles] = useState<any[]>([]);
    const [moniteurs, setMoniteurs] = useState<any[]>([]);

    useEffect(() => {
        socket.emit('autosecolesclass');
        socket.on('autosecolesclass', (data: any) => {
            setAutosEcoles(data.autoEcoles);
        });
        socket.emit('moniteursclass');
        socket.on('moniteursclass', (data: any) => {
            setMoniteurs(data.moniteurs);
        });
    }, []);

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