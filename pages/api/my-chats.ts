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
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado en las cookies' });
  }

  let userId;
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, JWT_SECRET) as { id_usuario: number };
    userId = decoded.id_usuario;
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const db = await getDbConnection();

  try {
    const chats = await db.all(
      `
      SELECT
        c.id_chat,
        c.id_publicacion,
        p.nombre_inmueble,
        CASE
          WHEN c.participant_a = ? THEN u_b.nombre
          WHEN c.participant_b = ? THEN u_a.nombre
          ELSE 'Usuario desconocido'
        END AS other_user_name,
        c.fecha_inicio
      FROM Chats c
      INNER JOIN Publicaciones p ON c.id_publicacion = p.id_publicacion
      INNER JOIN Usuarios u_a ON c.participant_a = u_a.id_usuario
      INNER JOIN Usuarios u_b ON c.participant_b = u_b.id_usuario
      WHERE c.participant_a = ? OR c.participant_b = ?
      ORDER BY c.fecha_inicio DESC
      `,
      [userId, userId, userId, userId]
    );

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error al obtener los chats:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await db.close();
  }
}

