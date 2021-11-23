import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../../lib/prisma";

export default async (req, res) => {
  const salt = bcryptjs.genSaltSync();
  const { username, password } = req.body;
  let user;

  try {
    if (!username || !password) {
      res.json({ error: "You should fill the form 🖊️" });
      return;
    }
    user = await prisma.user.create({
      data: {
        username,
        password: bcryptjs.hashSync(password, salt),
      },
    });

    const token = jwt.sign(
      { username: user.username, id: user.id, time: new Date() },
      process.env.JWT_SECRET,
      {
        expiresIn: "6h",
      }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 6 * 60 * 60,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );
    res.json(user);
  } catch (error) {
    res.json({ error: "A user with that username already exists 😮" });
    return;
  }
  // const token = jwt.sign(
  //   { username: user.username, id: user.id, time: new Date() },
  //   process.env.JWT_SECRET,
  //   {
  //     expiresIn: "6h",
  //   }
  // );

  // res.setHeader(
  //   "Set-Cookie",
  //   cookie.serialize("token", token, {
  //     httpOnly: true,
  //     maxAge: 6 * 60 * 60,
  //     path: "/",
  //     sameSite: "lax",
  //     secure: process.env.NODE_ENV === "production",
  //   })
  // );
  // res.json(user);
  //return;
};
