import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoginPanel from '../../components/LoginPanel';
import RegisterPanel from '../../components/RegisterPanel';
import Chat from '../../components/Chat';
import styles from '../../styles/PostDetails.module.css';
import jwt from 'jsonwebtoken';

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

interface Comment {
  id: number;
  publicationId: number;
  userId: number;
  userName: string;
  content: string;
  rating: number;
  dateTime: string;
}

interface UserPayload {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  tipo_usuario: string;
}

interface PostDetailsProps {
  userData: UserPayload | null;
}

const PostDetails: React.FC<PostDetailsProps> = ({ userData }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchPropertyAndComments = async () => {
      if (!id) {
        console.error('ID de publicación no proporcionado');
        return;
      }

      try {
        const propertyResponse = await axios.get(`/api/properties/${id}`);
        setProperty(propertyResponse.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }

      try {
        const commentsResponse = await axios.get(`/api/comments/${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPropertyAndComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) {
      alert('Debes iniciar sesión para poder comentar.');
      return;
    }

    if (newComment.trim() && newRating > 0 && property) {
      try {
        const response = await axios.post(`/api/comments/${property.id}`, {
          comment: newComment,
          rating: newRating,
        });

        setComments((prevComments) => [
          ...prevComments,
          {
            id: response.data.id,
            publicationId: property.id,
            userId: userData.id_usuario,
            userName: userData.nombre,
            content: newComment,
            rating: newRating,
            dateTime: new Date().toISOString(),
          },
        ]);
        setNewComment('');
        setNewRating(0);
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    } else {
      alert('Por favor, completa el comentario y selecciona una valoración.');
    }
  };

  const handleContactClick = () => {
    if (!userData) {
      setMostrarLogin(true); // Muestra el panel de inicio de sesión si no está logueado
    } else {
      setMostrarChat(true); // Abre el chat si el usuario está logueado
    }
  };

  const handleLogoClick = () => {
    router.push('/');
    setMostrarLogin(false);
    setMostrarRegistro(false);
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
        usuarioNombre={userData?.nombre || null}
      />
      <main className={styles.mainContent}>
        {mostrarLogin ? (
          <LoginPanel onClose={() => setMostrarLogin(false)} />
        ) : mostrarRegistro ? (
          <RegisterPanel onClose={() => setMostrarRegistro(false)} />
        ) : !property ? (
          <h1>Cargando...</h1>
        ) : (
          <div className={styles.innerContent}>
            <section className={styles.propertyDetails}>
              <h1 className={styles.propertyName}>{property.title}</h1>
              <div className={styles.imageContainer}>
                {property.images.length > 0 ? (
                  property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${property.title} - imagen ${index + 1}`}
                      className={styles.propertyImage}
                    />
                  ))
                ) : (
                  <p>No hay imágenes disponibles</p>
                )}
              </div>
              <p className={styles.propertyInfo}>{property.info}</p>
              <p className={styles.propertyLocation}>
                <strong>Ubicación:</strong> {property.location}
              </p>
              <p className={styles.propertyRent}>
                <strong>Renta mensual:</strong> ${property.rent}
              </p>
              <p className={styles.propertyType}>
                <strong>Tipo:</strong> {property.type}
              </p>
              <button
                className={styles.contactButton}
                onClick={handleContactClick}
              >
                Contactar al dueño
              </button>
            </section>

            <section className={styles.commentsSection}>
              <h2>Comentarios de estudiantes</h2>
              <div className={styles.comments}>
                {comments.map((comment) => (
                  <div className={styles.comment} key={comment.id}>
                    <div className={styles.commentHeader}>
                      <h3>{comment.userName || 'Anónimo'}</h3>
                      <div className={styles.ratingContainer}>
                        <div className={styles.rating}>
                          {'★'.repeat(comment.rating)}
                          {'☆'.repeat(5 - comment.rating)}
                        </div>
                      </div>
                    </div>
                    <p className={styles.commentText}>{comment.content}</p>
                    <span className={styles.commentDate}>
                      {formatDistanceToNow(new Date(comment.dateTime), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                ))}
              </div>
              {userData ? (
                <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
                  <textarea
                    className={styles.textArea}
                    placeholder="Escribe tu comentario"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className={styles.ratingInput}>
                    <label>Valoración:</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                    >
                      <option value={0}>Selecciona</option>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                          {star}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    Enviar
                  </button>
                </form>
              ) : (
                <p className={styles.loginMessage}>
                  <strong>Debes iniciar sesión para dejar un comentario.</strong>
                </p>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
      {mostrarChat && (
        <div className={styles.chatModal}>
          <Chat publicationId={`${property?.id}`} onClose={() => setMostrarChat(false)} />
        </div>
      )}
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

export default PostDetails;

