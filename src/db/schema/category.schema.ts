import { InferModel, relations, sql } from "drizzle-orm";
import { AnyMySqlColumn, boolean, datetime, mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { BlogToCategorySchema } from "./blog-category.schema";

export const CategorySchema = mysqlTable(
  "categories",
  {
    slug: varchar("slug", { length: 150 }).primaryKey(),
    title: varchar("title", { length: 150 }).notNull(),
    thumbnail: varchar("thumbnail", { length: 255 }).notNull(),
    published: boolean("published").default(true).notNull(),

    createdAt: datetime("created_at", { mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    // foreign keys
    parentSlug: varchar("parent_slug", { length: 150 }).references((): AnyMySqlColumn => CategorySchema.slug, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  },
  (categorySchema) => {
    return {
      slug_uq_idx: uniqueIndex("slug_uq_idx").on(categorySchema.slug),
    };
  }
);

// types
export type ICategory = InferModel<typeof CategorySchema, "select">;
export type ICreateCategory = InferModel<typeof CategorySchema, "insert">;

// 1 category can have M Blog to Category
export const CategoryRelation = relations(CategorySchema, ({ one, many }) => {
  return {
    blogToCategories: many(BlogToCategorySchema),
  };
});
