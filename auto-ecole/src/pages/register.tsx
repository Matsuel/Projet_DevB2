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
                    <h2>Moyen de paiement</h2>
                    <div className={styles.oui4}>
                      <input type="checkbox" />
                      <p>Carte Bancaire</p>
                      <input type="checkbox" />
                      <p>Cheque</p>
                      <input type="checkbox" />
                      <p>Especes</p>
                    </div>
                </div>
                <div className={styles.oui2}>
                    <h2>Labels de qualité, atouts et garanties:</h2>
                    <div className={styles.oui4}>
                      <input type="checkbox" />
                      <p>certifiée Qualiopi</p>
                      <input type="checkbox" />
                      <p>label de qualité </p>
                      <input type="checkbox" />
                      <p>certification qualicert</p>
                      <input type="checkbox" />
                      <p>garantie financiere</p>
                      <input type="checkbox" />
                      <p>Etablissement datadocké</p>
                    </div>
                </div>
                <div className={styles.oui2}>
                    <h2>Modes de financement:</h2>
                    <div className={styles.oui4}>
                      <input type="checkbox" />
                      <p>CPF</p>
                      <input type="checkbox" />
                      <p>Aide apprentis</p>
                      <input type="checkbox" />
                      <p>Permis 1€</p>
                      <input type="checkbox" />
                      <p>Financement france travail</p>
                    </div>
                </div>
                <div className={styles.oui2}>
                    <h2>Formations proposées</h2>
                    <div className={styles.oui4}>
                      <input placeholder='Formation 1'/>
                      <input placeholder='Formation 2'/>
                    </div>
                </div>
                <button className={styles.button_register}>Inscription ecole</button>
            </div>
            <div className={styles.oui3}>
                <h1>ancien eleve</h1>
                <input placeholder='email'/>
                <input placeholder='password'/>
                <button className={styles.button_register}>Inscription ancien eleve</button>
            </div>
            <div className={styles.oui3}>
                <h1>Nouveau</h1>
                <input placeholder='email'/>
                <input placeholder='password'/>
                <button className={styles.button_register}>Inscription nouveau</button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Register;