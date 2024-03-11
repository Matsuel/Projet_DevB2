import React from 'react';
import Head from 'next/head';
import styles from '@/styles/Login.module.css'; 

const Login: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <main>
        <h1>login</h1>
        <input placeholder='username'/>
        <input placeholder='password'/>
        <button className={styles.button_login}/>
      </main>
    </div>
  );
};

export default Login;
