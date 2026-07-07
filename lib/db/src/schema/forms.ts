import { pgTable, serial, integer, text, pgEnum } from "drizzle-orm/pg-core";
import { pokemonTable } from "./pokemon";

export const formTypeEnum = pgEnum("form_type", [
  "normal",
  "shiny",
  "regional",
  "mega",
  "gigantamax",
  "alternate",
]);

export const formsTable = pgTable("forms", {
  id: serial("id").primaryKey(),
  pokemonId: integer("pokemon_id")
    .notNull()
    .references(() => pokemonTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  formType: formTypeEnum("form_type").notNull().default("normal"),
  region: text("region"),
  spriteUrl: text("sprite_url").notNull().default(""),
  artworkUrl: text("artwork_url").notNull().default(""),
  type1: text("type_1"),
  type2: text("type_2"),
  statHp: integer("stat_hp"),
  statAttack: integer("stat_attack"),
  statDefense: integer("stat_defense"),
  statSpecialAttack: integer("stat_special_attack"),
  statSpecialDefense: integer("stat_special_defense"),
  statSpeed: integer("stat_speed"),
});

export type Form = typeof formsTable.$inferSelect;
