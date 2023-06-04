import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as users from "./schema/user.schema";
import * as blogs from "./schema/blog.schema";
import * as categories from "./schema/category.schema";
import * as blogCategories from "./schema/blog-category.schema";

const pool = mysql.createPool({
  uri: "mysql://root:myPassWord@localhost:3308/test",
});

export const db = drizzle(pool, {
  logger: false,
  schema: { ...users, ...blogs, ...categories, ...blogCategories },
});
