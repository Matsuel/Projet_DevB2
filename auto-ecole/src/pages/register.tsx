import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Register.module.scss';
import { registerAutoEcole, registerChercheur } from '@/Functions/Register';
import Header from "@/Components/Header";
import { useRouter } from 'next/router';
import { socket } from './_app';


const Register: React.FC = () => {

  const router = useRouter();

  const [register, setRegister] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const [showEcole, setShowEcole] = useState<boolean>(false);
  const [showNouveau, setShowNouveau] = useState<boolean>(false);

  const handleAutoEcole = () => {
    setShowEcole(true);
    setShowNouveau(false);
  }

  const handleNouveau = () => {
    setShowNouveau(true);
    setShowEcole(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file);
  }

  useEffect(() => {
    if (register) {
      localStorage.setItem('token', token);
      router.push('/');
    }
  }, [register]);

  socket.on('registerAutoEcole', (data: any) => {
    console.log(data);
    if (data.register) {
      setRegister(true);
      setToken(data.token);
    } else {
      setRegisterError('Erreur lors de l\'inscription');
    }
  });

  return (
    <div>
      <Head>
        <title>Register</title>
      </Head>
      <main>
        <Header />
        <div className={styles.oui}>
          <p>{registerError}</p>

          <div className={styles.buttons_choice}>
            <button className={styles.button_choice} onClick={handleAutoEcole}>Register AutoEcole</button>
            <button className={styles.button_choice} onClick={handleNouveau}>Register nouveau client</button>
          </div>

          {showEcole &&
            <form id="auto-ecole" onSubmit={(e) => registerAutoEcole(e, setRegister, setRegisterError, setToken, selectedFile)} className={styles.form}>

              <div className={styles.inputs}>
                <h1>Ecole</h1>
                <input className={styles.inputText} type="text" placeholder='Nom' id="auto-ecole-nom" required />
                <input className={styles.inputText} type="email" placeholder='Mail' id="auto-ecole-email" required />
                <input className={styles.inputText} type="password" placeholder='Password' id="auto-ecole-password" required />
                <input className={styles.inputText} type="text" placeholder='Address' id="auto-ecole-address" required />
                <input className={styles.inputText} type="number" placeholder='Zip' id="auto-ecole-zip" required />
                <input className={styles.inputText} type="text" placeholder='City' id="auto-ecole-city" required />
                <input className={styles.inputText} type="text" placeholder='ouais mails des etudiants' id="auto-ecole-mails-etudiants" required />
                <input className={styles.inputText} type="text" placeholder='nom de prof 1' id="auto-ecole-prof1" required />
                <input className={styles.inputText} type="text" placeholder='nom de prof 2' id="auto-ecole-prof2" required />
                <input className={styles.inputText} type="tel" placeholder='phone' id="auto-ecole-phone" required />
                <label className={styles.inputFileLabel} htmlFor="auto-ecole-photo">Photo</label>
                <input className={styles.inputFile} type="file" placeholder='photos' id="auto-ecole-photo" onChange={handleFileChange} required />


                <h2>Moyen de paiement</h2>

                <div className={styles.checkboxs}>
                  <div className={styles.oui4}>
                    <input className={styles.checkbox} type="checkbox" id="auto-ecole-carte" />
                    <label className={styles.checkboxLabel} htmlFor="auto-ecole-carte">Carte Bancaire</label>
                    <input className={styles.checkbox} type="checkbox" id="auto-ecole-cheque" />
                    <label className={styles.checkboxLabel} htmlFor="auto-ecole-cheque">Cheque</label>
                    <input className={styles.checkbox} type="checkbox" id="auto-ecole-especes" />
                    <label className={styles.checkboxLabel} htmlFor="auto-ecole-especes">Especes</label>
                  </div>
                </div>
                <h2>Labels de qualité, atouts et garanties:</h2>

                <div className={styles.checkboxs}>
                  <div className={styles.oui4}>
                    <input className={styles.checkbox} type="checkbox" id="auto-ecole-qualiopi" />
                    <label className={styles.checkboxLabel} htmlFor="auto-ecole-qualiopi">Certifiée Qualiopi</label>
                    <input className={styles.checkbox} type="checkbox" id="auto-ecole-label-qualite" />
                    <label className={styles.checkboxLabel} htmlFor="auto-ecole-label-qualite">label de qualité </label>
                    <input className={styles.checkbox} type="checkbox" id="auto-ecole-qualicert" />
                    <label className={styles.checkboxLabel} htmlFor="auto-ecole-qualicert">certification qualicert</label>
                    <input className={styles.checkbox} type="checkbox" id="auto-ecole-garantie-fin" />
                    <label className={styles.checkboxLabel} htmlFor="auto-ecole-garantie-fin">garantie financiere</label>
                    <input className={styles.checkbox} type="checkbox" id="auto-ecole-datadocke" />
                    <label className={styles.checkboxLabel} htmlFor="auto-ecole-datadocke">Etablissement datadocké</label>
                  </div>
                </div>

                <h2>Modes de financement:</h2>

                <div className={styles.checkboxs}>
                  <input className={styles.checkbox} type="checkbox" id="auto-ecole-cpf" />
                  <label className={styles.checkboxLabel} htmlFor="auto-ecole-cpf">CPF</label>
                  <input className={styles.checkbox} type="checkbox" id="auto-ecole-aide-apprentis" />
                  <label className={styles.checkboxLabel} htmlFor="auto-ecole-aide-apprentis">Aide apprentis</label>
                  <input className={styles.checkbox} type="checkbox" id="auto-ecole-permis1" />
                  <label className={styles.checkboxLabel} htmlFor="auto-ecole-permis1">Permis 1€</label>
                  <input className={styles.checkbox} type="checkbox" id="auto-ecole-fin-francetravail" />
                  <label className={styles.checkboxLabel} htmlFor="auto-ecole-fin-francetravail">Financement france travail</label>
                </div>

                <h2>Formations proposées</h2>
                <div className={styles.form}>
                  <input className={styles.inputText} type="text" placeholder='Formation 1' id="auto-ecole-formation1" required />
                  <input className={styles.inputText} type="text" placeholder='Formation 2' id="auto-ecole-formation2" />
                </div>
                <button type="submit" className={styles.button_register}>Inscription ecole</button>
              </div>
            </form>}

          {showNouveau &&
            <form id="nouveau" onSubmit={(e) => registerChercheur(e, setRegister, setRegisterError, setToken)} className={styles.form}>
              <div className={styles.inputs}>
                <h1>Nouveau</h1>
                <input className={styles.inputText} type="email" placeholder='email' id="nouveau-email" />
                <input className={styles.inputText} type="password" placeholder='password' id="nouveau-password" />
              </div>
              <div className={styles.checkboxs}>
                <input className={styles.checkbox} type="checkbox" id="nouveau-notifs" />
                <label className={styles.checkboxLabel} htmlFor="nouveau-notifs">notifs?</label>
              </div>
              <button type="submit" className={styles.button_register}>Inscription nouveau</button>
            </form>
          }
        </div>
      </main>
    </div>
  );
};

export default Register;