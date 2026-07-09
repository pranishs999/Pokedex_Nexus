"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertPokemonSchema = exports.pokemonTable = exports.growthRateEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
exports.growthRateEnum = (0, pg_core_1.pgEnum)("growth_rate", [
    "slow",
    "medium-slow",
    "medium",
    "medium-fast",
    "fast",
    "erratic",
    "fluctuating",
]);
exports.pokemonTable = (0, pg_core_1.pgTable)("pokemon", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    nationalDexNumber: (0, pg_core_1.integer)("national_dex_number").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull().unique(),
    category: (0, pg_core_1.text)("category").notNull().default(""),
    description: (0, pg_core_1.text)("description").notNull().default(""),
    generation: (0, pg_core_1.integer)("generation").notNull().default(1),
    height: (0, pg_core_1.real)("height").notNull().default(0),
    weight: (0, pg_core_1.real)("weight").notNull().default(0),
    color: (0, pg_core_1.text)("color").notNull().default(""),
    shape: (0, pg_core_1.text)("shape").notNull().default(""),
    habitat: (0, pg_core_1.text)("habitat"),
    genderRatio: (0, pg_core_1.real)("gender_ratio"),
    captureRate: (0, pg_core_1.integer)("capture_rate").notNull().default(45),
    baseFriendship: (0, pg_core_1.integer)("base_friendship").notNull().default(70),
    growthRate: (0, exports.growthRateEnum)("growth_rate").notNull().default("medium"),
    isLegendary: (0, pg_core_1.boolean)("is_legendary").notNull().default(false),
    isMythical: (0, pg_core_1.boolean)("is_mythical").notNull().default(false),
    isParadox: (0, pg_core_1.boolean)("is_paradox").notNull().default(false),
    isUltraBeast: (0, pg_core_1.boolean)("is_ultra_beast").notNull().default(false),
    // Stats
    statHp: (0, pg_core_1.integer)("stat_hp").notNull().default(0),
    statAttack: (0, pg_core_1.integer)("stat_attack").notNull().default(0),
    statDefense: (0, pg_core_1.integer)("stat_defense").notNull().default(0),
    statSpecialAttack: (0, pg_core_1.integer)("stat_special_attack").notNull().default(0),
    statSpecialDefense: (0, pg_core_1.integer)("stat_special_defense").notNull().default(0),
    statSpeed: (0, pg_core_1.integer)("stat_speed").notNull().default(0),
    // Egg
    eggGroup1: (0, pg_core_1.text)("egg_group_1"),
    eggGroup2: (0, pg_core_1.text)("egg_group_2"),
    // Sprites
    spriteUrl: (0, pg_core_1.text)("sprite_url").notNull().default(""),
    artworkUrl: (0, pg_core_1.text)("artwork_url").notNull().default(""),
    shinySpriteUrl: (0, pg_core_1.text)("shiny_sprite_url"),
    shinyArtworkUrl: (0, pg_core_1.text)("shiny_artwork_url"),
});
exports.insertPokemonSchema = (0, drizzle_zod_1.createInsertSchema)(exports.pokemonTable).omit({ id: true });
