import bcrypt from 'bcrypt';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ email: user.email, id: user.id, time: new Date() }, process.env.JWT_SECRET, {
      expiresIn: '6h'
    });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        maxAge: 6 * 60 * 60,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
    );
    res.json(user);
    //res.status(200).json({ user })
  } else {
    res.json({ error: 'Incorrect email or password 🙁' });
    return;
  }
}
