import React, { useState } from 'react';

import styles from '@/styles/monitor.module.css';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import { MonitorInfos } from '@/types/Monitor';
import Head from 'next/head';
import { handleAutoEcoleClick } from '@/Functions/Router';
import { socket } from '../_app';

const fetcher = (url: string) => axios.get(url).then(res => res.data)

interface MonitorProps {

}

const Monitor = ({ }: MonitorProps) => {

    const router = useRouter();
    const { id } = router.query;

    const [data, setData] = useState<MonitorInfos>();
    if (id && !data) {
        socket.emit('monitor', { id: id });
        socket.on('monitor', (data: any) => {
            setData(data);
        });
    }

    if (!data) return <div>Chargement...</div>

    return (
        <div className={styles.Monitor_container}>
            <Head>
                <title>
                    {
                        data.monitor.monitors[0].name ? data.monitor.monitors[0].name : "Moniteur"
                    }
                </title>
            </Head>
            <h1 id="nom">{data.monitor.monitors[0].name}</h1>
            <h2 id="tel" onClick={() => handleAutoEcoleClick(data.autoEcole._id, router)}>
                {data.autoEcole.name}
            </h2>

            {data.reviews.length > 0 ? 
            <>
            <h2>Commentaires</h2> 
            <ul>
                {data.reviews.map((review, index) => {
                    return (
                        <li key={index}>{review.rate ? review.rate + '/5 - ' : ''} {review.comment}</li>
                    )
                })}
            </ul>
            </>
            : <>
            <h2>Pas de commentaires pour l'instant</h2>
            
            </>}
            
        </div>
    );
};

export default Monitor;
