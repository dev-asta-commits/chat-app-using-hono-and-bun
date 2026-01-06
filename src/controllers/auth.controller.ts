import { Context } from "hono";
import { userSchema } from "../libs/validator";
import { db } from "../libs/db";
import { users } from "../schemas/user.schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../libs/utils";

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

    // jwt implementation tba

    return c.json({ message: "signed up succesfully" }, 200);
  } catch (error) {
    console.log("Error in auth controller when signing up", error);
    return c.json({ message: "Error signing up. Internal server error." }, 500);
  }
};

export const login = async (c: Context) => {
  const { email, password } = await c.req.json();

  try {
    // tba
  } catch (error) {
    console.log("Error in auth controller when logging in.", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};

export const logout = async (c: Context) => {
  return c.text("hello logout");
};
