"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formsTable = exports.formTypeEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var pokemon_1 = require("./pokemon");
exports.formTypeEnum = (0, pg_core_1.pgEnum)("form_type", [
    "normal",
    "shiny",
    "regional",
    "mega",
    "gigantamax",
    "alternate",
]);
exports.formsTable = (0, pg_core_1.pgTable)("forms", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    pokemonId: (0, pg_core_1.integer)("pokemon_id")
        .notNull()
        .references(function () { return pokemon_1.pokemonTable.id; }, { onDelete: "cascade" }),
    name: (0, pg_core_1.text)("name").notNull(),
    formType: (0, exports.formTypeEnum)("form_type").notNull().default("normal"),
    region: (0, pg_core_1.text)("region"),
    spriteUrl: (0, pg_core_1.text)("sprite_url").notNull().default(""),
    artworkUrl: (0, pg_core_1.text)("artwork_url").notNull().default(""),
    type1: (0, pg_core_1.text)("type_1"),
    type2: (0, pg_core_1.text)("type_2"),
    statHp: (0, pg_core_1.integer)("stat_hp"),
    statAttack: (0, pg_core_1.integer)("stat_attack"),
    statDefense: (0, pg_core_1.integer)("stat_defense"),
    statSpecialAttack: (0, pg_core_1.integer)("stat_special_attack"),
    statSpecialDefense: (0, pg_core_1.integer)("stat_special_defense"),
    statSpeed: (0, pg_core_1.integer)("stat_speed"),
});
