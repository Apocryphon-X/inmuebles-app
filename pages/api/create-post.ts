import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Necesario para manejar el cuerpo de la solicitud manualmente
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).send(`Método ${req.method} no permitido`);
    return;
  }

  const imagesPath = path.resolve('./public/images');
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
  }

  const chunks: Buffer[] = [];
  req.on('data', (chunk) => chunks.push(chunk));

  req.on('end', async () => {
    try {
      const boundary = req.headers['content-type']?.split('boundary=')[1];
      if (!boundary) {
        res.status(400).send('Boundary no encontrado en la solicitud.');
        return;
      }

      const rawData = Buffer.concat(chunks);
      const boundaryBuffer = Buffer.from(`--${boundary}`);
      const parts = splitBuffer(rawData, boundaryBuffer);

      const fields: Record<string, string> = {};
      const files: { [key: string]: Buffer } = {};

      for (const part of parts) {
        const headerEndIndex = part.indexOf('\r\n\r\n');
        if (headerEndIndex === -1) continue;

        const headers = part.subarray(0, headerEndIndex).toString(); // Usamos subarray en lugar de slice
        const body = part.subarray(headerEndIndex + 4, part.length - 2); // Usamos subarray en lugar de slice

        if (headers.includes('filename=')) {
          const match = headers.match(/filename="(.+?)"/);
          const filename = match ? match[1] : `file_${Date.now()}`;
          files[filename] = body;
        } else {
          const match = headers.match(/name="(.+?)"/);
          const fieldName = match ? match[1] : '';
          fields[fieldName] = body.toString().trim();
        }
      }

      // Extraer y validar los datos
      const idArrendatario = fields.idArrendatario?.toString().trim() || null;
      const nombreInmueble = fields.nombreInmueble?.toString().trim() || null;
      const ubicacion = fields.ubicacion?.toString().trim() || null;
      const tipoInmueble = fields.tipoInmueble?.toString().trim() || null;
      const descripcion = fields.descripcion?.toString().trim() || null;
      const rentaMensual = fields.rentaMensual ? parseFloat(fields.rentaMensual) : null;

      if (!idArrendatario || !nombreInmueble || !ubicacion || !tipoInmueble || !descripcion || !rentaMensual) {
        res.status(400).send('Todos los campos del formulario son obligatorios.');
        return;
      }

      // Guardar en la base de datos
      const db = new sqlite3.Database('data/main_data.db');

      const newPublicationId = await new Promise<number>((resolve, reject) => {
        db.run(
          `INSERT INTO Publicaciones (id_arrendatario, nombre_inmueble, renta_mensual, tipo_inmueble, ubicacion, informacion_inmueble, fecha_publicacion)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            idArrendatario,
            nombreInmueble,
            rentaMensual,
            tipoInmueble,
            ubicacion,
            descripcion,
            new Date().toISOString().split('T')[0],
          ],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.lastID);
            }
          }
        );
      });

      let imageIndex = 1;
      for (const [originalFilename, fileBuffer] of Object.entries(files)) {
        const newFilename = `${newPublicationId}_${imageIndex}.jpg`;
        const filepath = path.join(imagesPath, newFilename);
        fs.writeFileSync(filepath, fileBuffer);
        const imageUrl = `/images/${newFilename}`;

        await new Promise<void>((resolve, reject) => {
          db.run(
            `INSERT INTO Imagenes (id_publicacion, url) VALUES (?, ?)`,
            [newPublicationId, imageUrl],
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });

        imageIndex++;
}

      db.close();

      res.status(201).send({
        message: 'Publicación creada exitosamente.',
        idPublicacion: newPublicationId,
      });
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).send('Error al procesar la solicitud.');
    }
  });
}
function splitBuffer(buffer: Buffer, delimiter: Buffer): Buffer[] {
  const parts: Buffer[] = [];
  let start = 0;
  let index;

  while ((index = buffer.indexOf(delimiter, start)) !== -1) {
    parts.push(buffer.subarray(start, index)); // Usamos subarray en lugar de slice
    start = index + delimiter.length;
  }

  if (start < buffer.length) {
    parts.push(buffer.subarray(start)); // Usamos subarray para el último fragmento
  }

  return parts;
}

