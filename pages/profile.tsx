import { GetServerSideProps } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Profile.module.css';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

interface UserPayload {
  id_usuario: number;
  nombre: string; // Nombre completo
  correo: string;
  telefono: string;
  tipo_usuario: string;
}

interface ProfileProps {
  userData: UserPayload | null;
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/'); // Redirige a la raíz
  };

  const handleCreatePostClick = () => {
    router.push('/create-post'); // Redirige a la página para crear publicaciones
  };

  // Extraer el apellido paterno del nombre completo
  const apellidoPaterno = userData?.nombre?.split(' ')[1] || 'No disponible';

  return (
    <div className={styles.mainContainer}>
      <Header
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
        onLogoClick={handleLogoClick}
        usuarioNombre={userData?.nombre || null}
      />
      <main className={styles.profileContent}>
        <h1 className={styles.title}>Perfil</h1>
        <div className={styles.profileCard}>
          <div className={styles.profileItem}>
            <span className={styles.label}>Apellido Paterno:</span>
            <span>{apellidoPaterno}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>Nombre(s):</span>
            <span>{userData?.nombre?.split(' ')[0] || 'No disponible'}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>Correo Electrónico:</span>
            <span>{userData?.correo || 'No disponible'}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>Teléfono:</span>
            <span>{userData?.telefono || 'No disponible'}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>Tipo de Usuario:</span>
            <span>{userData?.tipo_usuario || 'No disponible'}</span>
          </div>
        </div>
        {userData?.tipo_usuario === 'ARRENDATARIO' && (
          <button
            className={styles.createPostButton}
            onClick={handleCreatePostClick}
          >
            Crear publicación
          </button>
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

  if (!userData) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData,
    },
  };
};

export default Profile;

