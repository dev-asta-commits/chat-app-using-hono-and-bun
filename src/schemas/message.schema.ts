import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const messages = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity().unique(),
    username: text("username").notNull(),
    senderId: text("sender_id").notNull(),
    receiverId: text("receiver_id").notNull(),
    message: text("message_content").notNull(),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
});
