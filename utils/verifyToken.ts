import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida');
}

export function verifyToken(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token faltante.' });
  }

  try {
    // Decodificar el token usando jwt.verify
    const decoded = jwt.verify(token, JWT_SECRET) as { id_usuario: number, nombre: string, correo: string, telefono: string, tipo_usuario: string };

    // Asignar la información decodificada al objeto de solicitud
    (req as any).user = decoded;
    next(); // Pasar al siguiente middleware o función
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

