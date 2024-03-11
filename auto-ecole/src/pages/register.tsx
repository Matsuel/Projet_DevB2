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
          <form id="auto-ecole">
            <div className={styles.oui3}>
                <h1>Ecole</h1>
                <input type="text" placeholder='Nom' id="auto-ecole-nom"/>
                <input type="email" placeholder='Mail' id="auto-ecole-email"/>
                <input type="password" placeholder='Password' id="auto-ecole-password"/>
                <input type="text" placeholder='Address' id="auto-ecole-address"/>
                <input type="file" placeholder='photos' id="auto-ecole-photo"/>
                <input type="text" placeholder='nom de prof 1' id="auto-ecole-prof1"/>
                <input type="text" placeholder='nom de prof 2' id="auto-ecole-prof2"/>
                <input type="tel" placeholder='phone' id="auto-ecole-phone"/>
                <div className={styles.oui2}>
                    <h2>Moyen de paiement</h2>
                    <div className={styles.oui4}>
                        <input type="checkbox" id="auto-ecole-carte" />
                        <label htmlFor="auto-ecole-carte">Carte Bancaire</label>
                        <input type="checkbox" id="auto-ecole-cheque" />
                        <label htmlFor="auto-ecole-cheque">Cheque</label>
                        <input type="checkbox" id="auto-ecole-especes" />
                        <label htmlFor="auto-ecole-especes">Especes</label>
                    </div>
                </div>
                <div className={styles.oui2}>
                    <h2>Labels de qualité, atouts et garanties:</h2>
                    <div className={styles.oui4}>
                        <input type="checkbox" id="auto-ecole-qualiopi" />
                        <label htmlFor="auto-ecole-qualiopi">certifiée Qualiopi</label>
                        <input type="checkbox" id="auto-ecole-label-qualite" />
                        <label htmlFor="auto-ecole-label-qualite">label de qualité </label>
                        <input type="checkbox" id="auto-ecole-qualicert" />
                        <label htmlFor="auto-ecole-qualicert">certification qualicert</label>
                        <input type="checkbox" id="auto-ecole-garantie-fin" />
                        <label htmlFor="auto-ecole-garantie-fin">garantie financiere</label>
                        <input type="checkbox" id="auto-ecole-datadocke" />
                        <label htmlFor="auto-ecole-datadocke">Etablissement datadocké</label>
                    </div>
                </div>
                <div className={styles.oui2}>
                    <h2>Modes de financement:</h2>
                    <div className={styles.oui4}>
                        <input type="checkbox" id="auto-ecole-cpf" />
                        <label htmlFor="auto-ecole-cpf">CPF</label>
                        <input type="checkbox" id="auto-ecole-aide-apprentis" />
                        <label htmlFor="auto-ecole-aide-apprentis">Aide apprentis</label>
                        <input type="checkbox" id="auto-ecole-permis1" />
                        <label htmlFor="auto-ecole-permis1">Permis 1€</label>
                        <input type="checkbox" id="auto-ecole-fin-francetravail" />
                        <label htmlFor="auto-ecole-fin-francetravail">Financement france travail</label>
                    </div>
                </div>
                <div className={styles.oui2}>
                    <h2>Formations proposées</h2>
                    <div className={styles.oui4}>
                        <input type="text" placeholder='Formation 1' id="auto-ecole-formation1"/>
                        <input type="text" placeholder='Formation 2' id="auto-ecole-formation2"/>
                    </div>
                </div>
                <button type="submit" className={styles.button_register}>Inscription ecole</button>
            </div>
        </form>


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