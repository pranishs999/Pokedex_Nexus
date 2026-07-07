import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const abilitiesTable = pgTable("abilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull().default(""),
});

export const insertAbilitySchema = createInsertSchema(abilitiesTable).omit({ id: true });
export type InsertAbility = z.infer<typeof insertAbilitySchema>;
export type Ability = typeof abilitiesTable.$inferSelect;
