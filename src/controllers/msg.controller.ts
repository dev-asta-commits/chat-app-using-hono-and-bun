import { db } from "../libs/db";
import { WSContext } from "hono/ws";
import { messages } from "../schemas/message.schema";
import { userType } from "../libs/types";
import { Context } from "hono";
import { users } from "../schemas/user.schema";
import { eq, not, or } from "drizzle-orm";
import { userOnline } from "../libs/store";

export const sendMessages = async (
    ws: WSContext,
    event: MessageEvent,
    user: userType,
    receiverId: number,
) => {
    try {
        const message: string = event.data.toString().trim();

        if (message.length < 1) {
            ws.send("Cannot send an empty message.");
        }

        if (!message) {
            ws.send("Please enter a valid message.");
        }

        const { id: senderId, username, email } = user;

        const messageData = {
            senderId,
            username,
            receiverId,
            message,
        };

        const [savedMessage] = await db
            .insert(messages)
            .values(messageData)
            .returning();

        ws.send(
            JSON.stringify({
                status: "sent",
                data: savedMessage,
            }),
        );
    } catch (error) {
        console.log("Error in websocket message send controller", error);
    }
};

export const getMessages = async (c: Context) => {
    try {
        const user: userType = c.get("user");

        const receiverId = c.req.param("id");

        if (!user || !receiverId) {
            return c.json({ message: "Invalid prameters" }, 404);
        }

        const messageList = await db
            .select()
            .from(messages)
            .where(
                or(
                    eq(messages.senderId, user.id),
                    eq(messages.receiverId, user.id),
                ),
            );

        return c.json({ messages: messageList }, 200);
    } catch (error) {
        console.log("Error in getMessages controller");
        return c.json({ message: "Internal server error" }, 500);
    }
};

export const setOnlineStatus = async (ws: WSContext, user: userType) => {
    try {
        const { id: senderId } = user;

        userOnline.set(senderId, true);

        ws.send(
            JSON.stringify({
                status: "success",
                message: "User status set to online.",
            }),
        );
    } catch (error) {
        console.log("Error in setOnlineStatus", error);
        ws.send(
            JSON.stringify({
                status: "failed",
                message:
                    "Error while setting online status. Internal server error.",
            }),
        );
    }
};

export const setOfflineStatus = async (user: userType) => {
    try {
        const { id: senderId } = user;
        userOnline.set(senderId, false);
    } catch (error) {
        console.log("Error in setOfflineStatus", error);
    }
};

export const getUsers = async (c: Context) => {
    try {
        const user: userType = c.get("user");

        if (!user) {
            return c.json({ message: "The user isn't authenticated yet" }, 401);
        }

        const userList = await db
            .select({ id: users.id, usernme: users.id })
            .from(users)
            .where(not(eq(users.id, user.id)));

        return c.json({ userList });
    } catch (error) {
        console.log("Error in getUsers controller", error);
        return c.json({ message: "Internal server error" }, 500);
    }
};
