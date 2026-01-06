import { Context } from "hono";

export const register = (c: Context) => {
  return c.text("hello register");
};

export const login = (c: Context) => {
  return c.text("hello login");
};

export const logout = (c: Context) => {
  return c.text("hello logout");
};
