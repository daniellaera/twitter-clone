import prisma from "../../lib/prisma";

export default async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          username: true, id: true
        }
      },
      likes: {
        select: {
          id: true,
          author: {
            select: {
              username: true, id: true
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
              username: true, id: true
            }
          }
        }
      }
    },
  });
  res.json(posts);
};
