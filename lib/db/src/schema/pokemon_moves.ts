import { pgTable, serial, integer, text, pgEnum } from "drizzle-orm/pg-core";
import { pokemonTable } from "./pokemon";
import { movesTable } from "./moves";

export const learnMethodEnum = pgEnum("learn_method", ["level-up", "tm", "egg", "tutor"]);

export const pokemonMovesTable = pgTable("pokemon_moves", {
  id: serial("id").primaryKey(),
  pokemonId: integer("pokemon_id")
    .notNull()
    .references(() => pokemonTable.id, { onDelete: "cascade" }),
  moveId: integer("move_id")
    .notNull()
    .references(() => movesTable.id, { onDelete: "cascade" }),
  learnMethod: learnMethodEnum("learn_method").notNull().default("level-up"),
  levelLearnedAt: integer("level_learned_at"),
});

export type PokemonMove = typeof pokemonMovesTable.$inferSelect;
