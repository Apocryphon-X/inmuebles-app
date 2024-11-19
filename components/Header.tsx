import React from 'react';
import styles from '../styles/Header.module.css';

interface HeaderProps {
  onLoginClick: () => void;
  onLogoClick: () => void;
  usuarioNombre: string | null; // Nuevo prop
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onLogoClick, usuarioNombre }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={onLogoClick}>
        INMUEBLES
      </div>
      <div className={styles.buttonContainer}>
        {usuarioNombre ? (
          <span className={styles.welcomeMessage}>Bienvenid@, {usuarioNombre}</span>
        ) : (
          <>
            <button onClick={onLoginClick}>Iniciar sesión</button>
            <button>Registrarse</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

