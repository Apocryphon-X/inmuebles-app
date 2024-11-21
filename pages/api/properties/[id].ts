import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';

type Property = {
  id: number;
  title: string;
  location: string;
  rent: number;
  type: string;
  info: string;
  date: string;
  images: string[];
};

type Row = {
  id: number;
  title: string;
  location: string;
  rent: number;
  type: string;
  info: string;
  date: string;
  image: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id } = query;

  if (method === 'GET') {
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    try {
      const property = await new Promise<Property | null>((resolve, reject) => {
        const db = new sqlite3.Database('data/main_data.db', (err) => {
          if (err) {
            console.error(err);
            reject(err);
          }
        });

        const query = `
          SELECT
            p.id_publicacion AS id,
            p.nombre_inmueble AS title,
            p.ubicacion AS location,
            p.renta_mensual AS rent,
            p.tipo_inmueble AS type,
            p.informacion_inmueble AS info,
            p.fecha_publicacion AS date,
            i.url AS image
          FROM Publicaciones p
          LEFT JOIN Imagenes i ON p.id_publicacion = i.id_publicacion
          WHERE p.id_publicacion = ?
        `;

        db.all(query, [parseInt(id as string)], (err, rows: unknown[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            const typedRows = rows as Row[];

            if (typedRows.length === 0) {
              resolve(null); // No se encontró la propiedad
            } else {
              const property: Property = {
                id: typedRows[0].id,
                title: typedRows[0].title,
                location: typedRows[0].location,
                rent: typedRows[0].rent,
                type: typedRows[0].type,
                info: typedRows[0].info,
                date: typedRows[0].date,
                images: typedRows
                  .map((row) => row.image)
                  .filter((img): img is string => img !== null),
              };
              resolve(property);
            }
          }
        });

        db.close();
      });

      if (property) {
        res.status(200).json(property);
      } else {
        res.status(404).json({ error: 'Propiedad no encontrada' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${method} no permitido` });
  }
}

