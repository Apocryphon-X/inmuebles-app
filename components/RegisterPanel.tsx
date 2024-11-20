import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/LoginPanel.module.css';

interface RegisterPanelProps {
  onClose: () => void;
}

const RegisterPanel: React.FC<RegisterPanelProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    apellidoPaterno: '',
    apellidoMaterno: '',
    nombre: '',
    correo: '',
    telefono: '',
    contrasenia: '',
    tipoUsuario: 'ALUMNO', // Valor por defecto
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para limitar la entrada a solo números
  const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axios.post('/api/signup', formData);

      if (response.status === 201) {
        alert('Registro exitoso. Bienvenid@.');
        window.location.reload(); // Recargar la página principal
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorMessage(data || 'Solicitud incorrecta');
        } else if (status === 409) {
          setErrorMessage('El correo ya está registrado.');
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
      <h1 className={styles.heading}>Formulario de Registro</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="apellidoPaterno" className={styles.label}>Apellido paterno</label>
          <input
            type="text"
            id="apellidoPaterno"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="apellidoMaterno" className={styles.label}>Apellido materno</label>
          <input
            type="text"
            id="apellidoMaterno"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="nombre" className={styles.label}>Nombre(s)</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="correo" className={styles.label}>Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="telefono" className={styles.label}>Número telefónico</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            onInput={handleNumericInput} // Aplicar función para limitar la entrada
            inputMode="numeric" // Sugerir teclado numérico en móviles
            maxLength={10} // Limitar a 10 dígitos
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="contrasenia" className={styles.label}>Contraseña</label>
          <input
            type="password"
            id="contrasenia"
            name="contrasenia"
            value={formData.contrasenia}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label}>Tipo de usuario</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="tipoUsuario"
                value="ALUMNO"
                checked={formData.tipoUsuario === 'ALUMNO'}
                onChange={handleInputChange}
                className={styles.radioButton}
              />
              Estudiante
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="tipoUsuario"
                value="ARRENDATARIO"
                checked={formData.tipoUsuario === 'ARRENDATARIO'}
                onChange={handleInputChange}
                className={styles.radioButton}
              />
              Arrendatario
            </label>
          </div>
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button type="submit" className={styles.submitButton}>
          Registrarse
        </button>
      </form>
      <button className={styles.returnButton} onClick={onClose}>
        Volver a la página principal
      </button>
    </div>
  );
};

export default RegisterPanel;

