import { env } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";

// route imports :
import auth from "./routes/auth.route";

const app = new Hono();

// routes
app.route("/api/auth", auth);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: env.PORT,
  fetch: app.fetch,
};
