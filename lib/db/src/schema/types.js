"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertTypeSchema = exports.typesTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
exports.typesTable = (0, pg_core_1.pgTable)("types", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull().unique(),
    color: (0, pg_core_1.text)("color").notNull(),
});
exports.insertTypeSchema = (0, drizzle_zod_1.createInsertSchema)(exports.typesTable).omit({ id: true });
