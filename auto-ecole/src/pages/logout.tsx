import { useRouter } from 'next/router';
import React from 'react';

const Logout = () => {

    const router = useRouter();

    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        router.push('/');
    }
    
};

export default Logout;
