import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";

export default async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
    const me = await prisma.user.findUnique({ where: { id } });
    res.json(me);
  } else {
    res.json({});
  }
};
