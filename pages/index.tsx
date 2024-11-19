import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import LoginPanel from '../components/LoginPanel';
import styles from '../styles/PaginaPrincipal.module.css';
import jwt from 'jsonwebtoken';

interface Property {
  id: number;
  title: string;
  image: string;
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
  const [filtros, setFiltros] = useState<string[]>(['Precio', 'Tamaño', 'Ubicación']);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [usuarioNombre, setUsuarioNombre] = useState<string | null>(userData?.nombre || null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/properties');
        setDepartamentosRecientes(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const filtrarInmuebles = (filtro: string) => console.log(`Aplicando filtro: ${filtro}`);

  const handleLogoClick = () => {
    setMostrarLogin(false);
    setMostrarFiltros(false);
  };

  return (
    <div className={styles.mainContainer}>
      <Header
        onLoginClick={() => setMostrarLogin(true)}
        onLogoClick={handleLogoClick}
        usuarioNombre={usuarioNombre}
      />
      <main className={styles.mainContent}>
        {mostrarLogin ? (
          <LoginPanel onClose={() => setMostrarLogin(false)} />
        ) : (
          <>
            <div className={styles.flexCenter}>
              <button
                className={styles.filterButton}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                Filtros
              </button>
            </div>
            {mostrarFiltros && (
              <div className={styles.filterMenu}>
                {filtros.map((filtro: string, index: number) => (
                  <button
                    key={index}
                    className={styles.filterOption}
                    onClick={() => filtrarInmuebles(filtro)}
                  >
                    {filtro}
                  </button>
                ))}
              </div>
            )}
            <h1 className={styles.title}>{titulo}</h1>
            <div className={styles.propertyGrid}>
              {departamentosRecientes.map(({ id, title, image }: Property) => (
                <PropertyCard key={id} title={title} image={image} />
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

