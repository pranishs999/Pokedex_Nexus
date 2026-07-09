"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemonMovesTable = exports.learnMethodEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var pokemon_1 = require("./pokemon");
var moves_1 = require("./moves");
exports.learnMethodEnum = (0, pg_core_1.pgEnum)("learn_method", ["level-up", "tm", "egg", "tutor"]);
exports.pokemonMovesTable = (0, pg_core_1.pgTable)("pokemon_moves", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    pokemonId: (0, pg_core_1.integer)("pokemon_id")
        .notNull()
        .references(function () { return pokemon_1.pokemonTable.id; }, { onDelete: "cascade" }),
    moveId: (0, pg_core_1.integer)("move_id")
        .notNull()
        .references(function () { return moves_1.movesTable.id; }, { onDelete: "cascade" }),
    learnMethod: (0, exports.learnMethodEnum)("learn_method").notNull().default("level-up"),
    levelLearnedAt: (0, pg_core_1.integer)("level_learned_at"),
});
