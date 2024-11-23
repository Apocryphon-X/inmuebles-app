import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Chat from '../components/Chat'; // Importar el componente de chat
import styles from '../styles/MyChats.module.css';

interface ChatItem {
  id_chat: number;
  id_publicacion: number;
  nombre_inmueble: string;
  other_user_name: string; // Nombre del otro participante
  fecha_inicio: string;
}

interface ChatsProps {
  userData: UserPayload | null;
}

interface UserPayload {
  id_usuario: number;
  nombre: string;
  correo: string;
}

const Chats: React.FC<ChatsProps> = ({ userData }) => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<number | null>(null); // ID del chat activo
  const [activeChatTitle, setActiveChatTitle] = useState<string>(''); // Título del chat activo

  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('/api/my-chats');
        setChats(response.data);
        setError(null); // Limpiar errores anteriores
      } catch (err: any) {
        console.error('Error al obtener los chats:', err);
        setError('Ocurrió un error al cargar los chats.');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleOpenChat = async (chatId: number) => {
    try {
      const response = await axios.get(`/api/chat/${chatId}`);
      const { other_user_name } = response.data; // Ajusta según el API
      setActiveChat(chatId); // Establece el ID del chat activo
      setActiveChatTitle(`Chat con ${other_user_name}`); // Actualiza el título del chat
    } catch (err) {
      console.error('Error al abrir el chat:', err);
      setError('No se pudo abrir el chat. Intenta de nuevo.');
    }
  };

  const handleCloseChat = () => {
    setActiveChat(null); // Cierra el chat activo
    setActiveChatTitle(''); // Limpia el título del chat
  };

  return (
    <div className={styles.mainContainer}>
      <Header
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
        onLogoClick={() => router.push('/')}
        usuarioNombre={userData?.nombre || null}
      />
      <main className={styles.content}>
        <h1 className={styles.title}>Mis Chats Activos</h1>
        {loading && <p className={styles.loading}>Cargando chats...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !chats.length && (
          <p className={styles.noChats}>No tienes chats activos.</p>
        )}
        <div className={styles.chatList}>
          {chats.map((chat) => (
            <div
              key={chat.id_chat}
              className={styles.chatCard}
              onClick={() => handleOpenChat(chat.id_chat)} // Cambiar a `id_chat`
            >
              <h2 className={styles.chatTitle}>{chat.nombre_inmueble}</h2>
              <p className={styles.chatDetail}>Con: {chat.other_user_name}</p>
              <p className={styles.chatDetail}>
                Inicio: {new Date(chat.fecha_inicio).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        {activeChat !== null && (
          <div className={styles.chatOverlay}>
            <Chat
              publicationId={String(activeChat)} // Asegúrate de usar el ID correcto aquí
              onClose={handleCloseChat} // Maneja el cierre del chat
            />
          </div>
        )}
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

export default Chats;

