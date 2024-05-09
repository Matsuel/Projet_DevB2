import React, { useRef, useEffect } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

interface MapProps {
    coordinates: LngLatLike
}

const Map = ({
    coordinates
}: MapProps) => {

    const MapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_API as string;
        const map = new mapboxgl.Map({
            container: MapRef.current as HTMLDivElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: coordinates,
            zoom: 15
        });

        return () => map.remove();
    }, [coordinates])



    return <div ref={MapRef} style={{ width: '100%', height: '100%' }} />
}

export default Map