import { InferModel, relations, sql } from "drizzle-orm";
import { boolean, datetime, decimal, index, int, mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { BlogToCategorySchema } from "./blog-category.schema";
import { UserSchema } from "./user.schema";

export const BlogSchema = mysqlTable(
  "blogs",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: varchar("content", { length: 2000 }).notNull(),
    thumbnail: varchar("thumbnail", { length: 255 }).notNull(),
    published: boolean("published").default(true).notNull(),
    views: int("views").default(0).notNull(),
    rating: decimal("rating", { precision: 2, scale: 1 }), // 1.2, 5.0, 4.5

    createdAt: datetime("created_at", { mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "date" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
    // foreign keys
    authorId: varchar("author_id", { length: 50 })
      .notNull()
      .references(
        () => {
          return UserSchema.id;
        },
        {
          onDelete: "cascade",
          onUpdate: "cascade",
        }
      ),
  },
  (blogSchema) => {
    return {
      slug_uq_idx: uniqueIndex("slug_uq_idx").on(blogSchema.slug),
      published_idx: index("published_idx").on(blogSchema.published),
    };
  }
);

// types
export type IBlog = InferModel<typeof BlogSchema, "select">;
export type ICreateBlog = InferModel<typeof BlogSchema, "insert">;

// 1 blog can have 1 author
// 1 blog can have M Blog to Category
export const BlogRelation = relations(BlogSchema, ({ one, many }) => {
  return {
    author: one(UserSchema, { fields: [BlogSchema.authorId], references: [UserSchema.id] }),
    blogToCategories: many(BlogToCategorySchema),
  };
});
