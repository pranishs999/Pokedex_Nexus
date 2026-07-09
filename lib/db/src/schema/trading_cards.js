"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradingCardsTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var pokemon_1 = require("./pokemon");
exports.tradingCardsTable = (0, pg_core_1.pgTable)("trading_cards", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    pokemonId: (0, pg_core_1.integer)("pokemon_id")
        .references(function () { return pokemon_1.pokemonTable.id; }, { onDelete: "set null" }),
    name: (0, pg_core_1.text)("name").notNull(),
    set: (0, pg_core_1.text)("set").notNull(),
    cardNumber: (0, pg_core_1.text)("card_number").notNull(),
    hp: (0, pg_core_1.integer)("hp"),
    rarity: (0, pg_core_1.text)("rarity").notNull().default("Common"),
    illustrator: (0, pg_core_1.text)("illustrator"),
    imageUrl: (0, pg_core_1.text)("image_url").notNull().default(""),
});
