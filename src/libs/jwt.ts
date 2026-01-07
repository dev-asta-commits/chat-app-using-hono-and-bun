import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { Context } from "hono";

export const generateToken = async (userID: number, c: Context) => {
  const payload = {
    sub: userID,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };

  const secret = process.env.JWT_SECRET!;
  const token = await sign(payload, secret, "HS512");

  setCookie(c, "session_token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
    sameSite: "Strict",
  });

  return token;
};
