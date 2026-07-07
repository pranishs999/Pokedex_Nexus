import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const growthRateEnum = pgEnum("growth_rate", [
  "slow",
  "medium-slow",
  "medium",
  "medium-fast",
  "fast",
  "erratic",
  "fluctuating",
]);

export const pokemonTable = pgTable("pokemon", {
  id: serial("id").primaryKey(),
  nationalDexNumber: integer("national_dex_number").notNull().unique(),
  name: text("name").notNull().unique(),
  category: text("category").notNull().default(""),
  description: text("description").notNull().default(""),
  generation: integer("generation").notNull().default(1),
  height: real("height").notNull().default(0),
  weight: real("weight").notNull().default(0),
  color: text("color").notNull().default(""),
  shape: text("shape").notNull().default(""),
  habitat: text("habitat"),
  genderRatio: real("gender_ratio"),
  captureRate: integer("capture_rate").notNull().default(45),
  baseFriendship: integer("base_friendship").notNull().default(70),
  growthRate: growthRateEnum("growth_rate").notNull().default("medium"),
  isLegendary: boolean("is_legendary").notNull().default(false),
  isMythical: boolean("is_mythical").notNull().default(false),
  isParadox: boolean("is_paradox").notNull().default(false),
  isUltraBeast: boolean("is_ultra_beast").notNull().default(false),
  // Stats
  statHp: integer("stat_hp").notNull().default(0),
  statAttack: integer("stat_attack").notNull().default(0),
  statDefense: integer("stat_defense").notNull().default(0),
  statSpecialAttack: integer("stat_special_attack").notNull().default(0),
  statSpecialDefense: integer("stat_special_defense").notNull().default(0),
  statSpeed: integer("stat_speed").notNull().default(0),
  // Egg
  eggGroup1: text("egg_group_1"),
  eggGroup2: text("egg_group_2"),
  // Sprites
  spriteUrl: text("sprite_url").notNull().default(""),
  artworkUrl: text("artwork_url").notNull().default(""),
  shinySpriteUrl: text("shiny_sprite_url"),
  shinyArtworkUrl: text("shiny_artwork_url"),
});

export const insertPokemonSchema = createInsertSchema(pokemonTable).omit({ id: true });
export type InsertPokemon = z.infer<typeof insertPokemonSchema>;
export type Pokemon = typeof pokemonTable.$inferSelect;
