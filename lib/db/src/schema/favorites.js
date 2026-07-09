"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var users_1 = require("./users");
exports.favoritesTable = (0, pg_core_1.pgTable)("favorites", {
    userId: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(function () { return users_1.usersTable.id; }, { onDelete: "cascade" }),
    dexNumber: (0, pg_core_1.integer)("dex_number").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow(),
}, function (t) { return [(0, pg_core_1.primaryKey)({ columns: [t.userId, t.dexNumber] })]; });
