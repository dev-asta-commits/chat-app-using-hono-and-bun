import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { users } from "../schemas/user.schema";
import { db } from "../libs/db";
import { eq } from "drizzle-orm";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const token = getCookie(c, "session_token");

    if (!token) {
      console.log("Unauthorized user. token not found.");
      return c.json({ message: "Unauthorized. token not found." }, 401);
    }

    const secret = process.env.JWT_SECRET!;
    const decodedToken = await verify(token!, secret, "HS512");

    if (!decodedToken) {
      console.log("Unauthorized user. Invalid token");
      return c.json({ mesage: "Unauthorized. Invalid token" }, 401);
    }

    const [user] = await db
      .select({ id: users.id, username: users.username, email: users.email })
      .from(users)
      .where(eq(users.id, decodedToken.sub as number));

    c.set("user", user);

    await next();
  } catch (error) {
    console.log("Error in authMiddleware", error);
    return c.json({ message: "Internal server Error" }, 500);
  }
};
