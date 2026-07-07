import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const typesTable = pgTable("types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
});

export const insertTypeSchema = createInsertSchema(typesTable).omit({ id: true });
export type InsertType = z.infer<typeof insertTypeSchema>;
export type PokemonTypeRow = typeof typesTable.$inferSelect;
