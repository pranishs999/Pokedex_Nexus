"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemonAbilitiesTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var pokemon_1 = require("./pokemon");
var abilities_1 = require("./abilities");
exports.pokemonAbilitiesTable = (0, pg_core_1.pgTable)("pokemon_abilities", {
    pokemonId: (0, pg_core_1.integer)("pokemon_id")
        .notNull()
        .references(function () { return pokemon_1.pokemonTable.id; }, { onDelete: "cascade" }),
    abilityId: (0, pg_core_1.integer)("ability_id")
        .notNull()
        .references(function () { return abilities_1.abilitiesTable.id; }, { onDelete: "cascade" }),
    isHidden: (0, pg_core_1.boolean)("is_hidden").notNull().default(false),
    slot: (0, pg_core_1.integer)("slot").notNull().default(1),
}, function (t) { return [(0, pg_core_1.primaryKey)({ columns: [t.pokemonId, t.abilityId] })]; });
