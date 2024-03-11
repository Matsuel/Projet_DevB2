import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Header.module.css'; // Assuming you have a CSS module for styling

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/login">Connexion</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
