"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAbilitySchema = exports.abilitiesTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
exports.abilitiesTable = (0, pg_core_1.pgTable)("abilities", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull().unique(),
    description: (0, pg_core_1.text)("description").notNull().default(""),
});
exports.insertAbilitySchema = (0, drizzle_zod_1.createInsertSchema)(exports.abilitiesTable).omit({ id: true });
