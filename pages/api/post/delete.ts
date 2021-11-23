import prisma from "../../../lib/prisma";

export default async (req, res) => {
  const { id } = req.body;

  const post = await prisma.post.delete({
    where: { id },
  });

  res.json(post);
  return;
};
