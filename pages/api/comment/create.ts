import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.cookies;
  const { text } = req.body;
  const { id } = req.body;

  try {
    if (!text) {
      res.json({ error: 'You should type some comment!' });
      return;
    }
    if (token) {
      // Get authenticated user
      const { _id, email } = jwt.verify(token, process.env.JWT_SECRET);

      const comment = await prisma.comment.create({
        data: {
          text,
          author: {
            connect: {
              email
            }
          },
          post: {
            connect: {
              id
            }
          }
        }
      });
      res.json(comment);
    } else {
      res.json({ error: 'You must be logged in to comment.' });
    }
  } catch (error) {
    res.json({ error: 'You must be logged in to comment.' });
    return;
  }
}
