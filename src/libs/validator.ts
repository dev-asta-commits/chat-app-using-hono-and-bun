import * as z from "zod";

export const User = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be atleas 3 characters long" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});
