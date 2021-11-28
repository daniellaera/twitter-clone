import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.cookies;

  if (token) {
    const { id }: any = jwt.verify(token, process.env.JWT_SECRET || '');
    const me = await prisma.user.findUnique({ where: { id } });
    res.json(me);
  } else {
    res.json({});
  }
}
