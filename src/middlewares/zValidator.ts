import { userSchema } from "../libs/validator";
import { validator } from "hono/validator";

export const authValidator = validator("json", (value, c) => {
  const result = userSchema.safeParse(value);

  if (!result.success) {
    return c.json(
      { success: false, errors: result.error.flatten().fieldErrors },
      400,
    );
  }

  return result.data;
});
