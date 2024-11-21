import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void; // Nuevo callback para registro
  onLogoClick: () => void;
  usuarioNombre: string | null; // Prop para mostrar el nombre del usuario
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick, onLogoClick, usuarioNombre }) => {
  const router = useRouter();

  const handleUserClick = () => {
    if (usuarioNombre) {
      router.push('/profile'); // Redirige a /profile si hay usuario
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={onLogoClick}>
        INMUEBLES
      </div>
      <div className={styles.buttonContainer}>
        {usuarioNombre ? (
          <span className={styles.welcomeMessage}>
            Bienvenid@,{' '}
            <span
              className={`${styles.userName} ${styles.clickable}`}
              onClick={handleUserClick}
            >
              {usuarioNombre}
            </span>
          </span>
        ) : (
          <>
            <button className={styles.headerButton} onClick={onLoginClick}>
              Iniciar sesión
            </button>
            <button className={styles.headerButton} onClick={onRegisterClick}>
              Registrarse
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

