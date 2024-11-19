import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/LoginPanel.module.css';

interface LoginPanelProps {
  onClose: () => void;
}

const LoginPanel: React.FC<LoginPanelProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axios.post('/api/login', {
        correo: email,
        contrasenia: password,
      });

      if (response.status === 200) {
        // Assuming no response data is expected on success, handle accordingly
        alert('Login exitoso. Bienvenid@.');
        window.location.reload(); // Recargar la página
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorMessage(data.error || 'Solicitud incorrecta');
        } else if (status === 401) {
          setErrorMessage(data.error || 'Correo o contraseña incorrectos.');
        } else {
          setErrorMessage('Ocurrió un error inesperado.');
        }
      } else {
        setErrorMessage('Error al conectar con el servidor.');
      }
    }
  };

  return (
    <div className={styles.loginPanel}>
      <h1 className={styles.heading}>Iniciar Sesión</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className={styles.label}>Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button type="submit" className={styles.submitButton}>
          Ingresar
        </button>
      </form>
      <button className={styles.returnButton} onClick={onClose}>
        Volver a la página principal
      </button>
    </div>
  );
};

export default LoginPanel;

