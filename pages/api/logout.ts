import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Borra la cookie `authToken`
    res.setHeader(
      'Set-Cookie',
      'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly;'
    );
    return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
}

