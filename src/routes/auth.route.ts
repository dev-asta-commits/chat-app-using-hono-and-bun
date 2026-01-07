import { Hono } from "hono";
import { register, login, logout } from "../controllers/auth.controller";
import { authValidator } from "../middlewares/zValidator";
import protectRoutes from "../middlewares/ptotectRoutes";

const app = new Hono();

app.post("/register", authValidator, register);

app.post("/login", authValidator, login);

app.post("/logout", logout);

export default app;
