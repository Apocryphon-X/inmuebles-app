import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/generateToken'; // Importa la función de generación de token
import * as cookie from 'cookie'; // Asegúrate de importar correctamente

// Definición del tipo de usuario
type Usuario = {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  contrasenia: string;
  tipo_usuario: string;
};

// Función para buscar usuario en la base de datos
async function findUserByEmail(email: string): Promise<Usuario | null> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('data/main_data.db', (err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
    });

    db.get(
      'SELECT id_usuario, nombre, correo, telefono, contrasenia, tipo_usuario FROM Usuarios WHERE correo = ?',
      [email],
      (err, row) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(row ? (row as Usuario) : null);
        }
      }
    );

    db.close();
  });
}

// Handler para el endpoint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { correo, contrasenia }: { correo: string; contrasenia: string } = req.body;

    // Validar que ambos campos estén presentes
    if (!correo || !contrasenia) {
      res.status(400).send('El correo y la contraseña son obligatorios.');
      return; // Breaks out of the function without using "return res"
    }

    try {
      // Buscar usuario por correo
      const usuario = await findUserByEmail(correo);

      if (!usuario) {
        res.status(401).send('Correo o contraseña incorrectos.');
        return; // Breaks out of the function without using "return res"
      }

      // Validar contrasenia usando bcrypt
      const isMatch = await bcrypt.compare(contrasenia, usuario.contrasenia);
      if (!isMatch) {
        res.status(401).send('Correo o contraseña incorrectos.');
        return; // Breaks out of the function without using "return res"
      }

      // Generar token JWT al inicio de sesión exitoso con todos los datos del usuario (excepto la contraseña)
      const { id_usuario, nombre, correo: email, telefono, tipo_usuario } = usuario;
      const token = generateToken({ id_usuario, nombre, correo: email, telefono, tipo_usuario });

      // Establecer el token en una cookie con flags de seguridad
      res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // solo se envía a través de HTTPS en producción
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 día en segundos
        path: '/',
      }));

      // Responder con un código de estado 200 (éxito)
      res.status(200).end(); // Does not explicitly use "return res"
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al procesar la solicitud de login');
    }
  } else {
    // Manejar otros métodos HTTP
    res.setHeader('Allow', ['POST']);
    res.status(405).send(`Método ${req.method} no permitido`);
  }
}

