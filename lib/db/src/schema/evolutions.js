"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evolutionsTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var pokemon_1 = require("./pokemon");
exports.evolutionsTable = (0, pg_core_1.pgTable)("evolutions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    fromPokemonId: (0, pg_core_1.integer)("from_pokemon_id")
        .notNull()
        .references(function () { return pokemon_1.pokemonTable.id; }, { onDelete: "cascade" }),
    toPokemonId: (0, pg_core_1.integer)("to_pokemon_id")
        .notNull()
        .references(function () { return pokemon_1.pokemonTable.id; }, { onDelete: "cascade" }),
    trigger: (0, pg_core_1.text)("trigger").notNull().default("level-up"),
    minLevel: (0, pg_core_1.integer)("min_level"),
    item: (0, pg_core_1.text)("item"),
    heldItem: (0, pg_core_1.text)("held_item"),
    timeOfDay: (0, pg_core_1.text)("time_of_day"),
    friendship: (0, pg_core_1.integer)("friendship"),
    specialRequirement: (0, pg_core_1.text)("special_requirement"),
});
