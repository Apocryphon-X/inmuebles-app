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

  // Recupera mensajes del chat al cargar
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chat/${publicationId}`);
        setMessages(response.data); // Sobrescribir mensajes para evitar acumulaciones
        setError(null); // Limpia cualquier error anterior
      } catch (err) {
        console.error('Error al obtener los mensajes:', err);
        setError('No se pudieron cargar los mensajes. Intenta de nuevo.');
      }
    };

    fetchMessages();
  }, [publicationId]);

  // Lógica para verificar mensajes nuevos periódicamente
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/chat/${publicationId}`);
        setMessages(response.data); // Sobrescribir mensajes cada vez
      } catch (err) {
        console.error('Error al verificar nuevos mensajes:', err);
      }
    }, 5000); // Revisa cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [publicationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    setIsLoading(true);

    try {
      const response = await axios.post(`/api/chat/${publicationId}`, {
        content: newMessage,
      });
      setMessages((prev) => [...prev, response.data]); // Añadir el mensaje enviado
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
        <span>Chat con el dueño</span>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

<div className={styles.chatBody}>
  {error && <p className={styles.error}>{error}</p>}
  {messages.map((message) => (
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
  ))}
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

