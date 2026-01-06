import { Hono } from "hono";
import { register, login, logout } from "../controllers/auth.controller";

const app = new Hono();

app.post("/register", register);

app.post("/login", login);

app.post("/logout", logout);

export default app;
