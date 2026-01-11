import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const messages = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().unique(),
  username: text("username").notNull(),
  senderId: text("senderId").notNull(),
  receiverId: text("receiverId").notNull(),
  message: text("message").notNull(),
});
