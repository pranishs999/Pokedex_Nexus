import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { pokemonTable } from "./pokemon";
import { typesTable } from "./types";

export const pokemonTypesTable = pgTable(
  "pokemon_types",
  {
    pokemonId: integer("pokemon_id")
      .notNull()
      .references(() => pokemonTable.id, { onDelete: "cascade" }),
    typeId: integer("type_id")
      .notNull()
      .references(() => typesTable.id, { onDelete: "cascade" }),
    slot: integer("slot").notNull().default(1),
  },
  (t) => [primaryKey({ columns: [t.pokemonId, t.typeId] })],
);

export type PokemonType = typeof pokemonTypesTable.$inferSelect;
