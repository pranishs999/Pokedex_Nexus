"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMoveSchema = exports.movesTable = exports.moveCategoryEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
exports.moveCategoryEnum = (0, pg_core_1.pgEnum)("move_category", ["Physical", "Special", "Status"]);
exports.movesTable = (0, pg_core_1.pgTable)("moves", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull().unique(),
    type: (0, pg_core_1.text)("type").notNull(),
    category: (0, exports.moveCategoryEnum)("category").notNull(),
    power: (0, pg_core_1.integer)("power"),
    accuracy: (0, pg_core_1.integer)("accuracy"),
    pp: (0, pg_core_1.integer)("pp").notNull().default(10),
    priority: (0, pg_core_1.integer)("priority").notNull().default(0),
    description: (0, pg_core_1.text)("description").notNull().default(""),
});
exports.insertMoveSchema = (0, drizzle_zod_1.createInsertSchema)(exports.movesTable).omit({ id: true });
