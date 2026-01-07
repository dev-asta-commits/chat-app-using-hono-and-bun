import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";

const protectRoutes = async (c: Context, next: Next) => {
  try {
    const tokenToVerify = getCookie(c, "session_token");
    if (!tokenToVerify) {
      return c.json({ message: "Unauthorized. No token provided" }, 401);
    }

    const decodedPayload = await verify(
      tokenToVerify!,
      process.env.JWT_SECRET || "development",
    );

    if (!decodedPayload) {
      return c.json({ message: "Unauthorized. Invalid token" }, 401);
    }

    c.set("user", decodedPayload);
    await next();
  } catch (error) {
    console.log("Error in protectRoutes middleware", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};

export default protectRoutes;
