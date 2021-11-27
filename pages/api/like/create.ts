import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.cookies;
  const { id, authorId, author } = req.body;

  let likeAuthorId;
  try {
    if (token) {
      // Get authenticated user
      const { email } = jwt.verify(token, process.env.JWT_SECRET);
      const me = await prisma.user.findUnique({ where: { email } });

      // find all likes for this post
      const allLikes = await prisma.like.findMany({
        where: { postId: id }
      });

      // we map through it and we assign the like authorId to a variable
      allLikes.map(lk => (likeAuthorId = lk.authorId));

      if (me.id === authorId) {
        // we want to avoid that the logged user likes his own post
        return res.status(400).json({ error: 'You cannot like a post you created' });
      }

      if (likeAuthorId === me.id) {
        // we check that the logged user id is the same as the author of this post's like
        // and we avoid he likes the post twice
        return res.status(400).json({ error: 'You cannot like a post twice' });
      }

      const like = await prisma.like.create({
        data: {
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
      res.json(like);
    } else {
      res.json({ error: 'You must be logged in to like.' });
    }
  } catch (error) {
    res.json({ error: 'You must be logged in to like.' });
    return;
  }
}
