import { InferModel, relations, sql } from "drizzle-orm";
import { datetime, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { UserSchema } from "./user.schema";

export const RoleSchema = mysqlTable("roles", {
  slug: varchar("slug", { length: 50 }).primaryKey(),
  title: varchar("title", { length: 50 }).notNull(),
  createdAt: datetime("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// types
export type IRole = InferModel<typeof RoleSchema, "select">;
export type ICreateRole = InferModel<typeof RoleSchema, "insert">;

// 1 role can have many users
export const RoleRelation = relations(RoleSchema, ({ one, many }) => {
  return {
    users: many(UserSchema),
  };
});
