import { Hono } from "hono";
import { getMessages, sendMessages } from "../controllers/msg.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

// type imports
import { userType } from "../libs/types";

const app = new Hono<{ Variables: { user: userType } }>();

app.get("/get", authMiddleware, (c) => {
  // proper implementation tba
  const user = c.get("user");
  if (!user) {
    c.json({ messge: "Unauthorized. user not found the token or what" }, 404);
  }
  return c.json(user, 200);
});

app.get("/send/:id", authMiddleware, sendMessages);

export default app;
