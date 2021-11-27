import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          email: true,
          id: true
        }
      },
      likes: {
        select: {
          id: true,
          author: {
            select: {
              email: true,
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
              email: true,
              id: true
            }
          }
        }
      }
    }
  });
  res.json(posts);
}
