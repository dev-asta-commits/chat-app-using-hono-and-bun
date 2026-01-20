import { BunSQLDatabase } from "drizzle-orm/bun-sql";
import { WSContext } from "hono/ws";
import { messages } from "../schemas/message.schema";
import { userType } from "../libs/types";

export const sendMessages = async (
    db: BunSQLDatabase,
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

export const setOnlineStatus = async (
    ws: WSContext,
    user: userType,
    userOnline: Map<number, boolean>,
) => {
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

export const setOfflineStatus = async (
    user: userType,
    userOnline: Map<number, boolean>,
) => {
    try {
        const { id: senderId } = user;
        userOnline.set(senderId, false);
    } catch (error) {
        console.log("Error in setOfflineStatus", error);
    }
};
