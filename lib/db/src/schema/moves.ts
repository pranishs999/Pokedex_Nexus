import { pgTable, serial, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const moveCategoryEnum = pgEnum("move_category", ["Physical", "Special", "Status"]);

export const movesTable = pgTable("moves", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type").notNull(),
  category: moveCategoryEnum("category").notNull(),
  power: integer("power"),
  accuracy: integer("accuracy"),
  pp: integer("pp").notNull().default(10),
  priority: integer("priority").notNull().default(0),
  description: text("description").notNull().default(""),
});

export const insertMoveSchema = createInsertSchema(movesTable).omit({ id: true });
export type InsertMove = z.infer<typeof insertMoveSchema>;
export type Move = typeof movesTable.$inferSelect;
