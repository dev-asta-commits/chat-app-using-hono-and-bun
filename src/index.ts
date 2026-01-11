import { Hono } from "hono";
import { upgradeWebSocket, websocket } from "hono/bun";

// route imports :
import auth from "./routes/auth.route";
import msg from "./routes/message.route";

const app = new Hono();

// routes
app.route("/api/auth", auth);
app.route("/api/msg", msg);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: process.env.PORT,
  fetch: app.fetch,
  websocket,
};
