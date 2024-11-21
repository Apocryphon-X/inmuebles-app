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
  const { method } = req;

  if (method === 'GET') {
    try {
      const properties = await new Promise<Property[]>((resolve, reject) => {
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
        `;

        db.all(query, [], (err, rows: unknown[]) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            const typedRows = rows as Row[];

            const propertiesMap: Record<number, Property> = {};

            typedRows.forEach((row) => {
              if (!propertiesMap[row.id]) {
                propertiesMap[row.id] = {
                  id: row.id,
                  title: row.title,
                  location: row.location,
                  rent: row.rent,
                  type: row.type,
                  info: row.info,
                  date: row.date,
                  images: [],
                };
              }
              if (row.image) {
                propertiesMap[row.id].images.push(row.image);
              }
            });

            const properties = Object.values(propertiesMap);
            resolve(properties);
          }
        });

        db.close();
      });

      res.status(200).json(properties);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${method} no permitido` });
  }
}

