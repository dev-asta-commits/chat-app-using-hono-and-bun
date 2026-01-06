import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().unique(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  password: varchar({ length: 6 }).notNull(),
});
