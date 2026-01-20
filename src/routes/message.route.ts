import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { authMiddleware } from "../middlewares/authMiddleware";
import { db } from "../libs/db";
import { userType } from "../libs/types";
import {
    sendMessages,
    setOnlineStatus,
    setOfflineStatus,
} from "../controllers/msg.controller";

const app = new Hono();
const userOnline = new Map<number, boolean>();

app.get(
    "/get-users",
    authMiddleware,
    // todo...
);

app.get(
    "/ws",
    authMiddleware,
    upgradeWebSocket((c) => {
        const receiverId = c.req.param("id");

        const user: userType = c.get("user");

        return {
            // when the Connection is established...
            onOpen: (event, ws) => {
                setOnlineStatus(ws, user, userOnline);
            },

            // when the user sends a message...
            onMessage(event, ws) {
                sendMessages(db, ws, event, user, Number(receiverId));

                // when the Connection is closed...
            },
            onClose: () => {
                setOfflineStatus(user, userOnline);
            },
        };
    }),
);

export default app;
