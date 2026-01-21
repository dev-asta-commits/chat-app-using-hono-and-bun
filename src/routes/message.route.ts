import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { authMiddleware } from "../middlewares/authMiddleware";
import { userType } from "../libs/types";
import {
    sendMessages,
    setOnlineStatus,
    setOfflineStatus,
    getUsers,
    getMessages,
} from "../controllers/msg.controller";

const app = new Hono();

app.get("/get-users", authMiddleware, getUsers);

app.get("/chat-history/:id", authMiddleware, getMessages);

app.get(
    "/ws/:id",
    authMiddleware,
    upgradeWebSocket((c) => {
        const receiverId = c.req.param("id");

        const user: userType = c.get("user");

        return {
            // when the Connection is established...
            onOpen: (event, ws) => {
                setOnlineStatus(ws, user);
            },

            // when the user sends a message...
            onMessage(event, ws) {
                sendMessages(ws, event, user, Number(receiverId));
            },

            // when the Connection is closed...
            onClose: () => {
                setOfflineStatus(user);
            },
        };
    }),
);

export default app;
