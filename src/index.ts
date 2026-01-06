import { Hono } from "hono";

// route imports :
import auth from "./routes/auth.route";

const app = new Hono();

// routes
app.route("/api/auth", auth);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};
