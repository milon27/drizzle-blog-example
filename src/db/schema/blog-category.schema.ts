import { mysqlTable, int, varchar, primaryKey } from "drizzle-orm/mysql-core";
import { BlogSchema } from "./blog.schema";
import { CategorySchema } from "./category.schema";
import { InferModel, relations } from "drizzle-orm";

export const BlogToCategorySchema = mysqlTable(
  "blog_to_category",
  {
    blogId: int("blog_id")
      .notNull()
      .references(() => BlogSchema.id, { onDelete: "cascade", onUpdate: "cascade" }),
    categorySlug: varchar("category_slug", { length: 150 })
      .notNull()
      .references(() => CategorySchema.slug, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (b2cSchema) => {
    return {
      cpk: primaryKey(b2cSchema.blogId, b2cSchema.categorySlug),
    };
  }
);

// types
export type IBlogToCategory = InferModel<typeof BlogToCategorySchema, "select">;
export type ICreateBlogToCategory = InferModel<typeof BlogToCategorySchema, "insert">;

// 1 b2c has 1 blog
// 1 b2c has 1 category
export const BlogToCategoryRelations = relations(BlogToCategorySchema, ({ one }) => ({
  blog: one(BlogSchema, {
    fields: [BlogToCategorySchema.blogId],
    references: [BlogSchema.id],
  }),
  category: one(CategorySchema, {
    fields: [BlogToCategorySchema.categorySlug],
    references: [CategorySchema.slug],
  }),
}));
