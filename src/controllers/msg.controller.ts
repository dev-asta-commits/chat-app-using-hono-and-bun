import { Context } from "hono";
import { messages } from "../schemas/message.schema";
import { db } from "../libs/db";
import { upgradeWebSocket } from "hono/bun";

export const getMessages = async (c: Context) => {
  const { username, senderId, receiverId, message } = await c.req.json();

  if (username && senderId && message && receiverId) {
    return c.json({ username, senderId, receiverId, message });
  }
};

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
      } catch (error) {
        console.log("Error in websocket message send controller", error);
      }
    },
    onClose: () => {
      console.log("Connection closed");
    },
  };
});
