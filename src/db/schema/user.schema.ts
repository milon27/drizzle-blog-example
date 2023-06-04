import { InferModel, relations, sql } from "drizzle-orm";
import { datetime, int, mysqlEnum, mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { RoleSchema } from "./role.schema";
import { BlogSchema } from "./blog.schema";

export const UserSchema = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    age: int("age"),
    gender: mysqlEnum("gender", ["male", "female", "other"]).notNull(),
    roleSlug: varchar("role_slug", { length: 50 })
      .notNull()
      .references(() => RoleSchema.slug),
    createdAt: datetime("created_at", { mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (userSchema) => {
    return {
      email_uq_idx: uniqueIndex("email_uq_idx").on(userSchema.email),
    };
  }
);

// types
export type IUser = InferModel<typeof UserSchema, "select">;
export type ICreateUser = InferModel<typeof UserSchema, "insert">;

// 1 user will have 1 role
// 1 user will have M blog
export const UserRelation = relations(UserSchema, ({ one, many }) => {
  return {
    role: one(RoleSchema, {
      fields: [UserSchema.roleSlug],
      references: [RoleSchema.slug],
    }),
    blogs: many(BlogSchema),
  };
});
