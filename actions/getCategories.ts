"use server";

import { db } from "@/drizzle/db";

export async function getAllCategories() {
  return await db.query.categories.findMany();
}
