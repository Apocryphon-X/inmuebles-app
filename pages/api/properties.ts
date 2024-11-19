import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';

// Define the type for the properties you will return
type Property = {
  id: number;
  title: string;
  image: string;
};

// Create a function to connect to the SQLite database and fetch the properties
async function getProperties(): Promise<Property[]> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('data/main_data.db', (err) => {
      if (err) {
	console.log(err);
	      reject(err);
      }
    });

    db.all('SELECT id_publicacion AS id, nombre_inmueble AS title FROM Publicaciones', [], (err, rows) => {
      if (err) {
	console.log(err);
        reject(err);
      } else {
        // Map the rows to the Property type and add a default image URL
        const properties: Property[] = rows.map(row => ({
          id: row.id,
          title: row.title,
          image: `/images/image${row.id}.jpg` // Assuming images are named by ID
        }));
        resolve(properties);
      }
    });

    db.close(); // Always close the DB connection
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const properties = await getProperties();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching properties from database' });
  }
}

