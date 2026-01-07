import { decode, sign, verify } from "hono/jwt";

export const generateToken = async (userID: number) => {
  const payload = {
    sub: userID,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5, // Token expires in 5 hours,
  };

  const secret = process.env.JWT_SECRET! || "development";
  const token = await sign(payload, secret);
  return token;
};
