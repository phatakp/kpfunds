import { BUILDINGS } from "@/lib/constants";
import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    real,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified")
        .$defaultFn(() => !1)
        .notNull(),
    image: text("image"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
});

export const sessions = pgTable("sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const buildingEnum = pgEnum("building_enum", BUILDINGS);

export const profiles = pgTable("profiles", {
    userId: uuid("user_id")
        .primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    building: buildingEnum("building").notNull(),
    flat: integer("flat").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "set null",
    }),
});

export const transactions = pgTable("transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
        .notNull()
        .references(() => events.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    amount: real("amount").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    building: buildingEnum("building"),
    flat: integer("flat"),
    isPayment: boolean("is_payment").default(false),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

// RELATIONS
//User Relations
export const userRelations = relations(users, ({ many, one }) => ({
    accounts: many(accounts, { relationName: "userAccounts" }),
    transactions: many(transactions, { relationName: "userTransactions" }),
    events: many(events, { relationName: "userEvents" }),
    profile: one(profiles, {
        fields: [users.id],
        references: [profiles.userId],
        relationName: "userProfile",
    }),
}));

//Account Relations
export const accountRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
        relationName: "userAccounts",
    }),
}));

//Profile Relations
export const profileRelations = relations(profiles, ({ one }) => ({
    user: one(users, {
        fields: [profiles.userId],
        references: [users.id],
        relationName: "userProfile",
    }),
}));

//Event Relations
export const eventRelations = relations(events, ({ many, one }) => ({
    transactions: many(transactions, { relationName: "eventTransactions" }),
    user: one(users, {
        fields: [events.userId],
        references: [users.id],
        relationName: "userEvents",
    }),
}));

//Transaction Relations
export const transactionRelations = relations(transactions, ({ one }) => ({
    user: one(users, {
        fields: [transactions.userId],
        references: [users.id],
        relationName: "userTransactions",
    }),
    event: one(events, {
        fields: [transactions.eventId],
        references: [events.id],
        relationName: "eventTransactions",
    }),
}));

export const schema = {
    users,
    accounts,
    verifications,
    sessions,
    profiles,
    events,
    transactions,
    userRelations,
    accountRelations,
    profileRelations,
    eventRelations,
    transactionRelations,
};
