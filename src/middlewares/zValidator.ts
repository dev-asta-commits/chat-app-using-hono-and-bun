import { userSchema, msgSchema } from "../libs/validator";
import { validator } from "hono/validator";

export const authValidator = validator("json", (value, c) => {
  const result = userSchema.safeParse(value);

  if (!result.success) {
    const error = result.error.flatten().fieldErrors;
    // console.log("Error while validating user : \n", error);
    return c.json({ success: false, errors: error }, 400);
  }

  return result.data;
});

export const msgValidator = validator("json", (value, c) => {
  const result = msgSchema.safeParse(value);

  if (!result.success) {
    const error = result.error.flatten().fieldErrors;
    // console.log("Error while validating user : \n", error);
    return c.json({ success: false, errors: error }, 400);
  }

  return result.data;
});
