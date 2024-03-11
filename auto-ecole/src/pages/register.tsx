import React from 'react';
import Head from 'next/head';
import styles from '@/styles/Register.module.css'; 

const Register: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Register</title>
      </Head>
      <main>
        <div className={styles.oui}>
            <div className={styles.oui3}>
                <h1>Ecole</h1>
                <input placeholder='Nom'/>
                <input placeholder='Mail'/>
                <input placeholder='Password'/>
                <input placeholder='Address'/>
                <input placeholder='photos'/>
                <input placeholder='Address'/>
                <input placeholder='nom de prof 1'/>
                <input placeholder='nom de prof 2'/>
                <input placeholder='contact'/>
                <div className={styles.oui2}>
                    <h2>CHecklist</h2>
                    <div className={styles.oui4}>
                      <input type="checkbox" />
                      <p>hehe</p>
                      <input type="checkbox" />
                      <input type="checkbox" />
                    </div>
                    

                </div>
                
                <button className={styles.button_register}>Ecole</button>
            </div>
            <div className={styles.oui3}>
                <h1>ancien eleve</h1>
                <input placeholder='username'/>
                <input placeholder='password'/>
                <button className={styles.button_register}>Ecole</button>
            </div>
            <div className={styles.oui3}>
                <h1>Register</h1>
                <input placeholder='username'/>
                <input placeholder='password'/>
                <button className={styles.button_register}>Ecole</button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Register;