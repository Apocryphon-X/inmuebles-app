import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import LoginPanel from '../components/LoginPanel';
import RegisterPanel from '../components/RegisterPanel';
import styles from '../styles/PaginaPrincipal.module.css';
import jwt from 'jsonwebtoken';
import locations from '../utils/availableLocations'; // Importar ubicaciones

interface Property {
  id: number;
  title: string;
  location: string;
  rent: number;
  type: string;
  info: string;
  date: string;
  images: string[];
}

interface UserPayload {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  tipo_usuario: string;
}

interface PaginaPrincipalProps {
  userData: UserPayload | null;
}

const PaginaPrincipal: React.FC<PaginaPrincipalProps> = ({ userData }) => {
  const [titulo, setTitulo] = useState('Departamentos más recientes');
  const [departamentosRecientes, setDepartamentosRecientes] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]); // Guardar todos los datos originales
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [usuarioNombre, setUsuarioNombre] = useState<string | null>(userData?.nombre || null);

  // Estados para los filtros
  const [selectedUbicacion, setSelectedUbicacion] = useState<string | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);

  const tipos = ['Casa', 'Recamara', 'Departamento']; // Tipos de inmuebles

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/properties');
        const propertiesWithRandomImages = response.data.map((property: Property) => ({
          ...property,
          image: getRandomImage(property.images),
        }));
        setDepartamentosRecientes(propertiesWithRandomImages);
        setAllProperties(propertiesWithRandomImages); // Guardar datos originales
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Función para seleccionar una imagen aleatoria
  const getRandomImage = (images: string[]): string => {
    if (images.length === 0) return '/images/default.jpg';
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  // Función para normalizar cadenas (eliminar acentos)
  const normalizeString = (str: string): string =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const aplicarFiltros = () => {
    let filtrados = [...allProperties]; // Usar todos los datos originales

    if (selectedUbicacion) {
      filtrados = filtrados.filter(
        (prop) => normalizeString(prop.location) === normalizeString(selectedUbicacion)
      );
    }

    if (selectedTipo) {
      filtrados = filtrados.filter((prop) => prop.type === selectedTipo);
    }

    setDepartamentosRecientes(filtrados);

    // Cambiar el título a "Departamentos encontrados"
    setTitulo('Departamentos encontrados');
  };

  const ordenarPorPrecio = () => {
    const ordenados = [...departamentosRecientes].sort((a, b) => a.rent - b.rent);
    setDepartamentosRecientes(ordenados);
  };

  const deshacerFiltros = () => {
    setDepartamentosRecientes(allProperties); // Restaurar todos los datos originales
    setSelectedUbicacion(null);
    setSelectedTipo(null);
    setTitulo('Departamentos más recientes'); // Restaurar el título original
  };

  const handleLogoClick = () => {
    setMostrarLogin(false);
    setMostrarRegistro(false);
    setMostrarFiltros(false);
    deshacerFiltros(); // Deshacer filtros también al hacer clic en el logo
  };

  return (
    <div className={styles.mainContainer}>
      <Header
        onLoginClick={() => {
          setMostrarLogin(true);
          setMostrarRegistro(false);
        }}
        onRegisterClick={() => {
          setMostrarRegistro(true);
          setMostrarLogin(false);
        }}
        onLogoClick={handleLogoClick}
        usuarioNombre={usuarioNombre}
      />
      <main className={styles.mainContent}>
        {mostrarLogin ? (
          <LoginPanel onClose={() => setMostrarLogin(false)} />
        ) : mostrarRegistro ? (
          <RegisterPanel onClose={() => setMostrarRegistro(false)} />
        ) : (
          <>
            <div className={styles.flexCenter}>
              <button
                className={styles.filterButton}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                Filtros
              </button>
              <button className={styles.sortButton} onClick={ordenarPorPrecio}>
                Ordenar por precio
              </button>
            </div>
            {mostrarFiltros && (
              <div className={styles.filterMenu}>
                <div>
                  <label htmlFor="ubicacion-select">Ubicación:</label>
                  <select
                    id="ubicacion-select"
                    value={selectedUbicacion || ''}
                    onChange={(e) => setSelectedUbicacion(e.target.value || null)}
                  >
                    <option value="">Selecciona una ubicación</option>
                    {locations.map((ubicacion, index) => (
                      <option key={index} value={ubicacion}>
                        {ubicacion}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="tipo-select">Tipo de inmueble:</label>
                  <select
                    id="tipo-select"
                    value={selectedTipo || ''}
                    onChange={(e) => setSelectedTipo(e.target.value || null)}
                  >
                    <option value="">Selecciona un tipo de inmueble</option>
                    {tipos.map((tipo, index) => (
                      <option key={index} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <button className={styles.applyFilterButton} onClick={aplicarFiltros}>
                  Aplicar filtros
                </button>
                <button className={styles.resetFilterButton} onClick={deshacerFiltros}>
                  Deshacer filtros
                </button>
              </div>
            )}
            <h1 className={styles.title}>{titulo}</h1>
            <div className={styles.propertyGrid}>
              {departamentosRecientes.map(({ id, title, images, rent }: Property) => (
                <PropertyCard
                  key={id}
                  title={title}
                  image={getRandomImage(images)}
                  redirectUri={`/post-details/${id}`}
                  rent={rent}
                />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies.authToken;

  let userData = null;

  if (token) {
    try {
      const JWT_SECRET = process.env.JWT_SECRET as string;
      userData = jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return {
    props: {
      userData,
    },
  };
};

export default PaginaPrincipal;

