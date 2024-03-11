import React from 'react';
import Head from 'next/head';
import styles from '@/styles/Login.module.css'; 
import Header from "@/Components/Header";


const Login: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <main>
        <Header />
        <h1>login</h1>
        <form id="login">
            <input type="text" placeholder='email' id="login-email"/>
            <input type="password" placeholder='Password' id="login-password"/>
            <button type="submit" className={styles.button_login}>Login</button>
        </form>

      </main>
    </div>
  );
};

export default Login;
