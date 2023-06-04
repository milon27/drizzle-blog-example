import { sql } from "drizzle-orm";
import { AnyMySqlColumn, boolean, datetime, decimal, index, int, mysqlEnum, mysqlTable, primaryKey, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const UserSchema = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    age: int("age"),
    gender: mysqlEnum("gender", ["male", "female", "other"]).notNull(),
    isAdmin: boolean("is_admin").default(false).notNull(),
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

export const BlogSchema = mysqlTable(
  "blogs",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: varchar("content", { length: 2000 }).notNull(),
    thumbnail: varchar("thumbnail", { length: 255 }).notNull(),
    published: boolean("published").default(true).notNull(),
    views: int("views"),
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

export const BlogToCategorySchema = mysqlTable(
  "blog_to_category",
  {
    blogId: int("blog_id"),
    categorySlug: varchar("category_slug", { length: 150 }),
  },
  (b2cSchema) => {
    return {
      cpk: primaryKey(b2cSchema.blogId, b2cSchema.categorySlug),
    };
  }
);
