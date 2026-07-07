import { pgTable, integer, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { pokemonTable } from "./pokemon";

export const favoritesTable = pgTable(
  "favorites",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    pokemonId: integer("pokemon_id")
      .notNull()
      .references(() => pokemonTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.pokemonId] })],
);

export type Favorite = typeof favoritesTable.$inferSelect;
