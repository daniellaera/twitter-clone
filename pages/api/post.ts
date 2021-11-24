import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          username: true,
          id: true
        }
      },
      likes: {
        select: {
          id: true,
          author: {
            select: {
              username: true,
              id: true
            }
          }
        }
      },
      comments: {
        select: {
          text: true,
          id: true,
          author: {
            select: {
              username: true,
              id: true
            }
          }
        }
      }
    }
  });
  res.json(posts);
}
