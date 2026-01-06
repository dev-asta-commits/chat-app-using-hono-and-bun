import { Context } from "hono";
import { User } from "../libs/validator";
import { db } from "../libs/db";
import { users } from "../schemas/user.schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../libs/utils";

export const register = async (c: Context) => {
  const { username, email, password } = await c.req.json();

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (user) {
      c.status(409);
      return c.json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const [userID] = await db
      .insert(users)
      .values({ username, email, password: hashedPassword })
      .returning({ insertedId: users.id });

    console.log("User created with userID : ", userID);

    c.status(200);
    return c.json({ message: "signed up succesfully" });
  } catch (error) {
    console.log("Error in auth controller when signing up", error);
    c.status(500);
    return c.json({ message: "Error signing up. Internal server error." });
  }
};

export const login = async (c: Context) => {
  return c.text("hello login");
};

export const logout = async (c: Context) => {
  return c.text("hello logout");
};
