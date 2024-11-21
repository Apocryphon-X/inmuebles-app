import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoginPanel from '../../components/LoginPanel';
import RegisterPanel from '../../components/RegisterPanel';
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
  user: string;
  rating: number;
  comment: string;
  time: string;
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
  const [usuarioNombre, setUsuarioNombre] = useState<string | null>(userData?.nombre || null);

  useEffect(() => {
    const fetchPropertyAndComments = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');

      if (!id) {
        console.error('ID de publicación no proporcionado');
        return;
      }

      try {
        // Fetch property details
        const propertyResponse = await axios.get(`/api/properties/${id}`);
        setProperty(propertyResponse.data);

        // Fetch comments for the property
        const commentsResponse = await axios.get(`/api/comments/${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPropertyAndComments();
  }, []);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newComment.trim() && newRating > 0 && property) {
      try {
        const response = await axios.post(`/api/comments/${property.id}`, {
          comment: newComment,
          rating: newRating,
        });
        setComments((prevComments) => [...prevComments, response.data]);
        setNewComment('');
        setNewRating(0);
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    } else {
      alert('Por favor, completa el comentario y selecciona una valoración.');
    }
  };

  const handleLogoClick = () => {
    setMostrarLogin(false);
    setMostrarRegistro(false);
  };

  if (!property) {
    return (
      <div className={styles.mainContainer}>
        <Header
          onLoginClick={() => setMostrarLogin(true)}
          onRegisterClick={() => setMostrarRegistro(true)}
          onLogoClick={handleLogoClick}
          usuarioNombre={usuarioNombre}
        />
        <main className={styles.main}>
          <h1>Publicación no encontrada</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <Header
        onLoginClick={() => setMostrarLogin(true)}
        onRegisterClick={() => setMostrarRegistro(true)}
        onLogoClick={handleLogoClick}
        usuarioNombre={usuarioNombre}
      />
      <main className={styles.main}>
        {mostrarLogin ? (
          <LoginPanel onClose={() => setMostrarLogin(false)} />
        ) : mostrarRegistro ? (
          <RegisterPanel onClose={() => setMostrarRegistro(false)} />
        ) : (
          <>
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
              <button className={styles.contactButton}>Contactar al dueño</button>
            </section>

            <section className={styles.commentsSection}>
              <h2>Comentarios de estudiantes</h2>
              <div className={styles.comments}>
                {comments.map((comment, index) => (
                  <div key={index} className={styles.comment}>
                    <h3>{comment.user}</h3>
                    <div className={styles.rating}>
                      {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                    </div>
                    <p className={styles.commentText}>{comment.comment}</p>
                    <span className={styles.commentTime}>{comment.time}</span>
                  </div>
                ))}
              </div>
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
            </section>
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

export default PostDetails;

