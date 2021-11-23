import prisma from "../../lib/prisma";

export default async (req, res) => {
    const { id } = req.body;
    const comments = await prisma.comment.findMany({
    });
    res.json(comments);
};