import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida');
}

type UserPayload = {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  tipo_usuario: string;
};

export function generateToken(user: UserPayload, expiresIn: string | number = '1h'): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn });
}

