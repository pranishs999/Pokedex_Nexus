import { pgTable, integer, boolean, primaryKey } from "drizzle-orm/pg-core";
import { pokemonTable } from "./pokemon";
import { abilitiesTable } from "./abilities";

export const pokemonAbilitiesTable = pgTable(
  "pokemon_abilities",
  {
    pokemonId: integer("pokemon_id")
      .notNull()
      .references(() => pokemonTable.id, { onDelete: "cascade" }),
    abilityId: integer("ability_id")
      .notNull()
      .references(() => abilitiesTable.id, { onDelete: "cascade" }),
    isHidden: boolean("is_hidden").notNull().default(false),
    slot: integer("slot").notNull().default(1),
  },
  (t) => [primaryKey({ columns: [t.pokemonId, t.abilityId] })],
);

export type PokemonAbility = typeof pokemonAbilitiesTable.$inferSelect;
