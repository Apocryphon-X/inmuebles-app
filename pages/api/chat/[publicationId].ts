import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const getDbConnection = async () => {
  return open({
    filename: 'data/main_data.db',
    driver: sqlite3.Database,
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const publicationId = query.publicationId as string;

  if (!publicationId) {
    res.status(400).json({ error: 'ID de publicación inválida' });
    return;
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.authToken;

  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado en las cookies' });
    return;
  }

  let userId;
  let userName;
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, JWT_SECRET) as { id_usuario: number; nombre: string };
    userId = decoded.id_usuario;
    userName = decoded.nombre; // El nombre del usuario autenticado
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }

  const db = await getDbConnection();

  try {
    // Obtener el ID del arrendatario asociado a la publicación
    const publication = await db.get(
      `
      SELECT id_arrendatario
      FROM Publicaciones
      WHERE id_publicacion = ?
      `,
      [publicationId]
    );

    if (!publication) {
      res.status(404).json({ error: 'Publicación no encontrada' });
      return;
    }

    const otherParticipant = publication.id_arrendatario;

    if (method === 'GET') {
      let chat = await db.get(
        `
        SELECT id_chat, participant_a, participant_b
        FROM Chats
        WHERE id_publicacion = ?
          AND (participant_a = ? OR participant_b = ?)
        `,
        [publicationId, userId, userId]
      );

      if (!chat) {
        const currentDateTime = new Date().toISOString();
        const result = await db.run(
          `
          INSERT INTO Chats (id_publicacion, participant_a, participant_b, fecha_inicio)
          VALUES (?, ?, ?, ?)
          `,
          [publicationId, userId, otherParticipant, currentDateTime]
        );
        chat = { id_chat: result.lastID, participant_a: userId, participant_b: otherParticipant };
      }

      // Obtener nombres de ambos participantes
      const participants = await db.all(
        `
        SELECT id_usuario, nombre
        FROM Usuarios
        WHERE id_usuario IN (?, ?)
        `,
        [chat.participant_a, chat.participant_b]
      );

      const participantAName = participants.find((p) => p.id_usuario === chat.participant_a)?.nombre || 'Desconocido';
      const participantBName = participants.find((p) => p.id_usuario === chat.participant_b)?.nombre || 'Desconocido';

      // Obtener mensajes del chat
      const messages = await db.all(
        `
        SELECT
          m.id_mensaje AS id,
          m.id_chat,
          m.id_usuario_envia AS senderId,
          m.contenido_mensaje AS content,
          m.fecha_hora AS timestamp
        FROM Mensajes m
        WHERE m.id_chat = ?
        ORDER BY m.fecha_hora ASC
        `,
        [chat.id_chat]
      );

      res.status(200).json({
        participants: {
          YOU: userName,
          participant_a: participantAName,
          participant_b: participantBName,
        },
        messages: messages.map((msg) => ({
          id: msg.id,
          sender: msg.senderId === userId ? 'user' : 'owner',
          content: msg.content,
          timestamp: msg.timestamp,
        })),
      });
    } else if (method === 'POST') {
      const { content } = body;

      if (!content) {
        res.status(400).json({ error: 'Contenido del mensaje inválido' });
        return;
      }

      let chat = await db.get(
        `
        SELECT id_chat
        FROM Chats
        WHERE id_publicacion = ?
          AND (participant_a = ? OR participant_b = ?)
        `,
        [publicationId, userId, userId]
      );

      if (!chat) {
        const currentDateTime = new Date().toISOString();
        const result = await db.run(
          `
          INSERT INTO Chats (id_publicacion, participant_a, participant_b, fecha_inicio)
          VALUES (?, ?, ?, ?)
          `,
          [publicationId, userId, otherParticipant, currentDateTime]
        );
        chat = { id_chat: result.lastID };
      }

      const currentDateTime = new Date().toISOString();

      try {
        const result = await db.run(
          `
          INSERT INTO Mensajes (id_chat, id_usuario_envia, contenido_mensaje, fecha_hora)
          VALUES (?, ?, ?, ?)
          `,
          [chat.id_chat, userId, content, currentDateTime]
        );

        res.status(201).json({
          id: result.lastID,
          sender: 'user',
          content,
          timestamp: currentDateTime,
        });
      } catch (error) {
        console.error('Error al insertar el mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Método ${method} no permitido` });
    }
  } catch (error) {
    console.error('Error interno del servidor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await db.close();
  }
}

