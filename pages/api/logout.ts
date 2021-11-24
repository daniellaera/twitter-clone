import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = serialize('token', '', {
    maxAge: -1,
    path: '/'
  });

  res.setHeader('Set-Cookie', cookie);
  res.json({ loggedOut: true });
}
