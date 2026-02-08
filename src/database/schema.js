import { pgTable, varchar, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  
  name: varchar({ length: 100 }).notNull(),
  
  email: varchar({ length: 255 }).notNull().unique(),
  
  password: text().notNull(),
  salt: text().notNull(),

  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
});

export const urlTable = pgTable("urls", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  shortUrl: varchar({length: 300}).notNull().unique(),
  targetUrl: text(),
});
