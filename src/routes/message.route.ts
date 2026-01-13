import { Hono } from "hono";
import { getMessages, sendMessages } from "../controllers/msg.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

// type imports
import { userType } from "../libs/types";

const app = new Hono<{ Variables: { user: userType } }>();

app.get("/get/:id", authMiddleware, getMessages);

app.get("/send/:id", authMiddleware, sendMessages);

export default app;
