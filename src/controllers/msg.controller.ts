import { messages } from "../schemas/message.schema";
import { db } from "../libs/db";
import { upgradeWebSocket } from "hono/bun";
import { and, eq, or } from "drizzle-orm";

export const getMessages = upgradeWebSocket((c) => {
    const receiverId = c.req.param("id");

    const user = c.get("user");

    const { id: senderId, username, email } = user;

    return {
        async onOpen(event, ws) {
            try {
                const receivedMessages = await db
                    .select()
                    .from(messages)
                    .where(
                        or(
                            and(
                                eq(messages.senderId, String(senderId)),
                                eq(messages.receiverId, receiverId),
                            ),
                            and(
                                eq(messages.senderId, receiverId),
                                eq(messages.receiverId, String(senderId)),
                            ),
                        ),
                    );

                ws.send(
                    JSON.stringify({
                        type: "HISTORY",
                        data: receivedMessages,
                    }),
                );
            } catch (error) {
                console.log("Error in getMessages controller", error);
                ws.send("");
            }
        },
    };
});

export const sendMessages = upgradeWebSocket((c) => {
    const receiverId = c.req.param("id");
    const user = c.get("user");

    const { id: senderId, username } = user;

    return {
        async onMessage(event, ws) {
            try {
                const message = event.data.toString();

                const messageData = {
                    senderId,
                    username,
                    receiverId,
                    message,
                };

                console.log(
                    "Saving message for ID:",
                    messageData.receiverId,
                    messageData,
                );

                await db.insert(messages).values(messageData);

                ws.send("Message saved");
                ws.close();
            } catch (error) {
                console.log(
                    "Error in websocket message send controller",
                    error,
                );
            }
        },
        onClose: () => {
            console.log("Connection closed");
        },
    };
});
