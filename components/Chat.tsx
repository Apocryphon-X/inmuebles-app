import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Chat.module.css';

interface Message {
  id: number;
  sender: string; // Puede ser "user" o "owner"
  content: string;
  timestamp: string;
}

interface ChatProps {
  publicationId: string; // ID de la publicación
  onClose: () => void; // Función para cerrar el chat
}

const Chat: React.FC<ChatProps> = ({ publicationId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('Cargando...');
  const [participants, setParticipants] = useState<{ YOU: string; participant_a: string; participant_b: string } | null>(null);

  // Recupera información del chat y los mensajes al cargar
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get(`/api/chat/${publicationId}`);
        const { messages, participants } = response.data;

        if (Array.isArray(messages)) {
          setMessages(messages);
          setParticipants(participants);

          // Establecer el título del chat según la lógica proporcionada
          const chatTitle =
            participants.YOU === participants.participant_a
              ? `Chat con ${participants.participant_b}`
              : `Chat con ${participants.participant_a}`;
          setTitle(chatTitle);
        } else {
          console.warn('Formato inesperado en la respuesta de mensajes.');
        }

        setError(null); // Limpia cualquier error anterior
      } catch (err) {
        console.error('Error al obtener datos del chat:', err);
        setError('No se pudieron cargar los datos del chat. Intenta de nuevo.');
      }
    };

    fetchChatData();
  }, [publicationId]);

  // Lógica para verificar mensajes nuevos periódicamente
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/chat/${publicationId}`);
        const { messages } = response.data;

        if (Array.isArray(messages)) {
          setMessages(messages); // Actualiza los mensajes
        }
      } catch (err) {
        console.error('Error al verificar nuevos mensajes:', err);
      }
    }, 5000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [publicationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    setIsLoading(true);

    try {
      const response = await axios.post(`/api/chat/${publicationId}`, {
        content: newMessage,
      });

      if (response.data && response.data.id) {
        setMessages((prev) => [...prev, response.data]); // Añadir el mensaje enviado
      }

      setNewMessage('');
      setError(null); // Limpia cualquier error anterior
    } catch (err) {
      console.error('Error al enviar el mensaje:', err);
      setError('No se pudo enviar el mensaje. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <span>{title}</span>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.chatBody}>
        {error && <p className={styles.error}>{error}</p>}
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageContainer} ${
                message.sender === 'user' ? styles.userMessageContainer : styles.ownerMessageContainer
              }`}
            >
              <div
                className={`${styles.message} ${
                  message.sender === 'user' ? styles.userMessage : styles.ownerMessage
                }`}
              >
                {message.content}
              </div>
              <span className={styles.timestamp}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <p className={styles.noMessages}>No hay mensajes todavía.</p>
        )}
      </div>

      <div className={styles.chatFooter}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={styles.chatInput}
        />
        <button onClick={handleSendMessage} className={styles.sendButton} disabled={isLoading}>
          {isLoading ? '...' : '▶'}
        </button>
      </div>
    </div>
  );
};

export default Chat;

