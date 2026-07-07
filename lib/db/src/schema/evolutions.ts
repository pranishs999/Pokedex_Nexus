import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { pokemonTable } from "./pokemon";

export const evolutionsTable = pgTable("evolutions", {
  id: serial("id").primaryKey(),
  fromPokemonId: integer("from_pokemon_id")
    .notNull()
    .references(() => pokemonTable.id, { onDelete: "cascade" }),
  toPokemonId: integer("to_pokemon_id")
    .notNull()
    .references(() => pokemonTable.id, { onDelete: "cascade" }),
  trigger: text("trigger").notNull().default("level-up"),
  minLevel: integer("min_level"),
  item: text("item"),
  heldItem: text("held_item"),
  timeOfDay: text("time_of_day"),
  friendship: integer("friendship"),
  specialRequirement: text("special_requirement"),
});

export type Evolution = typeof evolutionsTable.$inferSelect;
