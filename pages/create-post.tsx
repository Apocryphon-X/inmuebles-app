import { GetServerSideProps } from 'next';
import { useState } from 'react';
import jwt from 'jsonwebtoken';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/CreatePost.module.css';
import { useRouter } from 'next/router';
import locations from '../utils/availableLocations'; // Importa la lista de ubicaciones

interface UserPayload {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  tipo_usuario: string;
}

interface CreatePostProps {
  userData: UserPayload | null;
}

const CreatePost: React.FC<CreatePostProps> = ({ userData }) => {
  const router = useRouter();
  const [images, setImages] = useState<(string | null)[]>(Array(9).fill(null));
  const [renta, setRenta] = useState<string>('');
  const [ubicacion, setUbicacion] = useState<string>('');
  const [tipoInmueble, setTipoInmueble] = useState<string>('');

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    const nombreInmueble = (e.target as HTMLFormElement).nombre.value;
    const descripcion = (e.target as HTMLFormElement).descripcion.value;

    if (!nombreInmueble || !ubicacion || !tipoInmueble || !descripcion || !renta) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    if (!userData?.id_usuario) {
      alert('No se pudo obtener la información del usuario. Intenta nuevamente.');
      return;
    }

    // Normalizar tipo de inmueble si es "Recámara"
    const tipoInmuebleSinAcentos = tipoInmueble === "Recámara" ? "Recamara" : tipoInmueble;

    // Agregar datos al FormData
    formData.append('idArrendatario', userData.id_usuario.toString());
    formData.append('nombreInmueble', nombreInmueble);
    formData.append('ubicacion', ubicacion);
    formData.append('tipoInmueble', tipoInmuebleSinAcentos);
    formData.append('descripcion', descripcion);
    formData.append('rentaMensual', renta);

    // Agregar imágenes al FormData
    images.forEach((image, index) => {
      if (image) {
        const blob = dataURLtoBlob(image);
        formData.append(`imagen_${index}`, blob, `imagen_${index}.jpg`);
      }
    });

    try {
      const response = await fetch('/api/create-post', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al crear la publicación:', errorText);
        alert('Ocurrió un error al intentar crear la publicación.');
        return;
      }

      const result = await response.json();
      alert('Publicación creada exitosamente.');
      router.push(`/post-details/${result.idPublicacion}`);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Error al enviar los datos. Intenta de nuevo más tarde.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/jpeg') {
        alert('El archivo debe estar en formato .jpg.');
        return;
      }
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 720 || img.height < 1024) {
          alert('La imagen debe tener una resolución mínima de 720 × 1024.');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const newImages = [...images];
          newImages[index] = reader.result as string;
          setImages(newImages);
        };
        reader.readAsDataURL(file);
      };
    }
  };

  const handleRentaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    setRenta(inputValue);
  };

  const handleUbicacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUbicacion(e.target.value);
  };

  const handleTipoInmuebleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoInmueble(e.target.value);
  };

  const dataURLtoBlob = (dataURL: string): Blob => {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const binary = atob(data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
  };

  return (
    <div className={styles.mainContainer}>
      <Header
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
        onLogoClick={handleLogoClick}
        usuarioNombre={userData?.nombre || null}
      />
      <main className={styles.content}>
        <h1 className={styles.title}>Formulario para crear publicación</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="nombre">
              Nombre del inmueble
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Escribe el nombre del inmueble"
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="ubicacion">
              Ubicación
            </label>
            <select
              id="ubicacion"
              name="ubicacion"
              value={ubicacion}
              onChange={handleUbicacionChange}
              required
              className={styles.inputField}
            >
              <option value="" disabled>
                Selecciona una ubicación
              </option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="tipoInmueble">
              Tipo de inmueble
            </label>
            <select
              id="tipoInmueble"
              name="tipoInmueble"
              value={tipoInmueble}
              onChange={handleTipoInmuebleChange}
              required
              className={styles.inputField}
            >
              <option value="" disabled>
                Selecciona un tipo de inmueble
              </option>
              <option value="Casa">Casa</option>
              <option value="Recámara">Recámara</option>
              <option value="Departamento">Departamento</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Sube tus fotografías
              <span className={styles.subLabel}>
                (En formato .jpg y con una resolución mínima de 720 × 1024).
              </span>
            </label>
            <div className={styles.photoGrid}>
              {images.map((image, index) => (
                <div key={index} className={styles.photoBox}>
                  <label htmlFor={`file-input-${index}`} className={styles.fileLabel}>
                    {image ? <img src={image} alt={`Imagen ${index + 1}`} className={styles.previewImage} /> : '+'}
                  </label>
                  <input
                    type="file"
                    id={`file-input-${index}`}
                    accept="image/jpeg"
                    className={styles.fileInput}
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="descripcion">
              Descripción del inmueble
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Escribe una breve descripción"
              required
              className={styles.textArea}
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="renta">
              Renta mensual
            </label>
            <div className={styles.currencyField}>
              <span className={styles.currencySymbol}>$</span>
              <input
                type="text"
                id="renta"
                name="renta"
                placeholder="0"
                value={renta}
                onChange={handleRentaChange}
                required
                className={styles.inputField}
              />
              <span className={styles.currencySuffix}>.00 MXN</span>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            Publicar
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.authToken;
  let userData = null;
  if (token) {
    try {
      const JWT_SECRET = process.env.JWT_SECRET as string;
      userData = jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch {
      console.error('Error al decodificar el token');
    }
  }
  if (!userData) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: { userData } };
};

export default CreatePost;

