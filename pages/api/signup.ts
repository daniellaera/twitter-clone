import bcrypt from 'bcrypt';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateEmail } from '../../utils/validateEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds);

  const { email, password } = req.body;

  let user;

  try {

    if (password.length < 8) {
      return res.status(400).json({ error: 'Your password should have 8 characters min' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'You should provide a valid email' });
    }

    if (!email || !password) {
      res.json({ error: 'You should fill the form 🖊️' });
      return;
    }
    user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt)
      }
    });

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
  } catch (error) {
    res.json({ error: 'A user with that email already exists 😮' });
    return;
  }
  // const token = jwt.sign(
  //   { username: user.username, id: user.id, time: new Date() },
  //   process.env.JWT_SECRET,
  //   {
  //     expiresIn: "6h",
  //   }
  // );

  // res.setHeader(
  //   "Set-Cookie",
  //   cookie.serialize("token", token, {
  //     httpOnly: true,
  //     maxAge: 6 * 60 * 60,
  //     path: "/",
  //     sameSite: "lax",
  //     secure: process.env.NODE_ENV === "production",
  //   })
  // );
  // res.json(user);
  //return;
}
