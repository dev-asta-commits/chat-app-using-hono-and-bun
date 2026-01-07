import { Context } from "hono";
import { db } from "../libs/db";
import { users } from "../schemas/user.schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../libs/utils";
import { generateToken } from "../libs/jwt";
import * as bcrypt from "bcrypt";
import { deleteCookie } from "hono/cookie";

export const register = async (c: Context) => {
  const { username, email, password } = await c.req.json();

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (user) {
      return c.json({ message: "User already exists" }, 409);
    }

    const hashedPassword = await hashPassword(password);

    const [userID] = await db
      .insert(users)
      .values({ username, email, password: hashedPassword })
      .returning({ insertedId: users.id });

    console.log("User created with userID : ", userID);

    const token = await generateToken(userID.insertedId, c);

    return c.json({ message: "signed up succesfully" }, 200);
  } catch (error) {
    console.log("Error in auth controller when signing up", error);
    return c.json({ message: "Error signing up. Internal server error." }, 500);
  }
};

export const login = async (c: Context) => {
  const { email, password } = await c.req.json();

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return c.json({ message: "Invalid email or password" }, 404);
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    generateToken(user.id, c);

    return c.json({ message: "Logged in succesfully" }, 200);
  } catch (error) {
    console.log("Error in auth controller when logging in.", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};

export const logout = async (c: Context) => {
  try {
    deleteCookie(c, "session_token");
    console.log("Error while loggin out");
    c.json({ message: "Logged out successfully" }, 200);
  } catch (error) {
    console.log("Error in auth controller while logging out.", error);
    c.json({ message: "Internal server error." }, 500);
  }
};
