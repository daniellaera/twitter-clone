import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  const post = await prisma.post.delete({
    where: { id }
  });

  res.json(post);
  return;
}
