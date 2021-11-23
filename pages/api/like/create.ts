import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";

export default async (req, res) => {
    const { token } = req.cookies;
    const { text } = req.body;
    const { id } = req.body;

    try {
        if (token) {
            // Get authenticated user
            const { _id, username } = jwt.verify(token, process.env.JWT_SECRET);

            const like = await prisma.like.create({
                data: {
                    author: {
                        connect: {
                            username
                        }
                    },
                    post: {
                        connect: {
                            id
                        }
                    }
                },
            });
            res.json(like);
        } else {
            res.json({ error: "You must be logged in to like." });
        }
    } catch (error) {
        res.json({ error: "You must be logged in to like." });
        return;
    }
}