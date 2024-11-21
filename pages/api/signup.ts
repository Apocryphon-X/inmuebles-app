import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/generateToken'; // Importa tu función para generar tokens
import * as cookie from 'cookie'; // Importa correctamente para manejar cookies

// Handler para el endpoint de registro
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).send(`Método ${req.method} no permitido`);
    return;
  }

  const {
    apellidoPaterno,
    apellidoMaterno,
    nombre, // Nombre propio
    correo,
    telefono,
    contrasenia,
    tipoUsuario,
  } = req.body;

  console.log(tipoUsuario);
  // Validar que todos los campos estén presentes
  if (!apellidoPaterno || !apellidoMaterno || !nombre || !correo || !telefono || !contrasenia || !tipoUsuario) {
    res.status(400).send('Todos los campos son obligatorios.');
    return;
  }

  // Concatenar apellidos y nombre para crear el campo "Nombre"
  const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;

  try {
    const userExists = await new Promise<boolean>((resolve, reject) => {
      const db = new sqlite3.Database('data/main_data.db', (err) => {
        if (err) {
          console.error(err);
          reject(err);
        }
      });

      db.get('SELECT 1 FROM Usuarios WHERE correo = ?', [correo], (err, row) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(!!row);
        }
      });

      db.close();
    });

    if (userExists) {
      res.status(409).send('El correo ya está registrado.');
      return;
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const newUserId = await new Promise<number>((resolve, reject) => {
      const db = new sqlite3.Database('data/main_data.db', (err) => {
        if (err) {
          console.error(err);
          reject(err);
        }
      });

    db.run(
      `INSERT INTO Usuarios (nombre, correo, telefono, contrasenia, tipo_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [nombreCompleto, correo, telefono, hashedPassword, tipoUsuario],
      function (err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );

      db.close();
    });

    const token = generateToken({
      id_usuario: newUserId,
      nombre: nombreCompleto,
      correo,
      telefono,
      tipo_usuario: tipoUsuario,
    });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      })
    );

    res.status(201).send('Usuario registrado exitosamente.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la solicitud de registro.');
  }
}

