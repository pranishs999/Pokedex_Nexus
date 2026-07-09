"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemonTypesTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var pokemon_1 = require("./pokemon");
var types_1 = require("./types");
exports.pokemonTypesTable = (0, pg_core_1.pgTable)("pokemon_types", {
    pokemonId: (0, pg_core_1.integer)("pokemon_id")
        .notNull()
        .references(function () { return pokemon_1.pokemonTable.id; }, { onDelete: "cascade" }),
    typeId: (0, pg_core_1.integer)("type_id")
        .notNull()
        .references(function () { return types_1.typesTable.id; }, { onDelete: "cascade" }),
    slot: (0, pg_core_1.integer)("slot").notNull().default(1),
}, function (t) { return [(0, pg_core_1.primaryKey)({ columns: [t.pokemonId, t.typeId] })]; });
