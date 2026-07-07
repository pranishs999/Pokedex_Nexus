import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { pokemonTable } from "./pokemon";

export const tradingCardsTable = pgTable("trading_cards", {
  id: serial("id").primaryKey(),
  pokemonId: integer("pokemon_id")
    .references(() => pokemonTable.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  set: text("set").notNull(),
  cardNumber: text("card_number").notNull(),
  hp: integer("hp"),
  rarity: text("rarity").notNull().default("Common"),
  illustrator: text("illustrator"),
  imageUrl: text("image_url").notNull().default(""),
});

export type TradingCard = typeof tradingCardsTable.$inferSelect;
