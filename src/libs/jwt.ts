import { sign, verify } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { Context } from "hono";

export const generateToken = async (userID: number, c: Context) => {
  const payload = {
    sub: userID,
  };

  const secret = process.env.JWT_SECRET! || "development";
  const token = await sign(payload, secret);

  setCookie(c, "session_token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60,
    path: "/",
    sameSite: "Strict",
  });

  return token;
};
