import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie'; // Para parsear las cookies del request

const getDbConnection = async () => {
  return open({
    filename: 'data/main_data.db',
    driver: sqlite3.Database,
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const { id } = query;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  const db = await getDbConnection();

  try {
    if (method === 'GET') {
      // Obtener comentarios
      const comments = await db.all(
        `
        SELECT
          c.id_comentario AS id,
          c.id_publicacion AS publicationId,
          c.id_usuario AS userId,
          u.nombre AS userName,
          c.contenido_comentario AS content,
          c.valoracion AS rating,
          c.fecha_hora AS dateTime
        FROM Comentarios c
        JOIN Usuarios u ON c.id_usuario = u.id_usuario
        WHERE c.id_publicacion = ?
      `,
        [id]
      )
      ;
        res.status(200).json(comments);
    } else if (method === 'POST') {
      // Crear un nuevo comentario
      const { comment, rating } = body;

      if (!comment || !rating || typeof rating !== 'number') {
        res.status(400).json({ error: 'Datos del comentario inválidos' });
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

      const currentDateTime = new Date().toISOString(); // Fecha y hora actual en formato ISO

      try {
        const result = await db.run(
          `
          INSERT INTO Comentarios (id_publicacion, id_usuario, contenido_comentario, valoracion, fecha_hora)
          VALUES (?, ?, ?, ?, ?)
        `,
          [id, userId, comment, rating, currentDateTime]
        );

        res.status(201).json({
          id: result.lastID,
          publicationId: id,
          userId,
          content: comment,
          rating,
          dateTime: currentDateTime,
        });
      } catch (error) {
        console.error('Error al insertar el comentario:', error);
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

