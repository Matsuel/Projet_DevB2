import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Header.module.scss'; // Assuming you have a CSS module for styling

const Header: React.FC = () => {

  const [token, setToken] = useState<string>('')

  useEffect(() => {
  if (typeof window !== 'undefined') {
    setToken(localStorage.getItem('token') || '')
  }
  }, [])

  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <div className={styles.links}>
              {token !== "" ?
                <>
                  <Link href="/chat">Chat</Link>
                  <Link href="/add">Ajouter</Link>
                  <Link href="/logout">Déconnexion</Link>
                  <Link href="/compte">Compte</Link>
                </>
                :
                <>
                  <Link href="/login">Connexion</Link>
                  <Link href="/register">Inscription</Link>
                </>
              }
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
