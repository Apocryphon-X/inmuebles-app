import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const getDbConnection = async () => {
  return open({
    filename: 'data/main_data.db', // Cambia el nombre de la base de datos si es necesario
    driver: sqlite3.Database,
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const publicationId = query.publicationId as string; // Extrae publicationId del router dinámico

  if (!publicationId) {
    res.status(400).json({ error: 'ID de publicación inválida' });
    return;
  }

  // Leer el token de la cookie
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.authToken;

  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado en las cookies' });
    return;
  }

  let userId;
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, JWT_SECRET) as { id_usuario: number };
    userId = decoded.id_usuario;
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

    const idUsuarioRecibe = publication.id_arrendatario;

    if (method === 'GET') {
      // Buscar el chat asociado a la publicación y validar al usuario
      let chat = await db.get(
        `
        SELECT id_chat
        FROM Chats
        WHERE id_publicacion = ?
          AND (id_usuario_inicia = ? OR id_usuario_recibe = ?)
        `,
        [publicationId, userId, userId]
      );

      // Si no existe el chat, crearlo
      if (!chat) {
        const currentDateTime = new Date().toISOString();
        const result = await db.run(
          `
          INSERT INTO Chats (id_publicacion, id_usuario_inicia, id_usuario_recibe, fecha_inicio)
          VALUES (?, ?, ?, ?)
          `,
          [publicationId, userId, idUsuarioRecibe, currentDateTime]
        );
        chat = { id_chat: result.lastID };
      }

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

      if (messages.length === 0) {
        res.status(200).json([]); // No hay mensajes, pero el chat existe
      } else {
        const formattedMessages = messages.map((msg) => ({
          id: msg.id,
          sender: msg.senderId === userId ? 'user' : 'owner', // Identificar remitente
          content: msg.content,
          timestamp: msg.timestamp,
        }));
        res.status(200).json(formattedMessages);
      }
    } else if (method === 'POST') {
      const { content } = body;

      if (!content) {
        res.status(400).json({ error: 'Contenido del mensaje inválido' });
        return;
      }

      // Verificar el chat asociado a la publicación
      let chat = await db.get(
        `
        SELECT id_chat
        FROM Chats
        WHERE id_publicacion = ?
          AND (id_usuario_inicia = ? OR id_usuario_recibe = ?)
        `,
        [publicationId, userId, userId]
      );

      // Si no existe el chat, crearlo
      if (!chat) {
        const currentDateTime = new Date().toISOString();
        const result = await db.run(
          `
          INSERT INTO Chats (id_publicacion, id_usuario_inicia, id_usuario_recibe, fecha_inicio)
          VALUES (?, ?, ?, ?)
          `,
          [publicationId, userId, idUsuarioRecibe, currentDateTime]
        );
        chat = { id_chat: result.lastID };
      }

      // Insertar el mensaje en el chat
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

