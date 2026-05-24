// lib/shopGaurd.ts
"use server";
import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { storeMembers } from "@/drizzle/schema";

// For protecting store-specific actions
export async function shopGaurd(storeId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  // If storeId is provided, check membership
  if (storeId) {
    const membership = await db.query.storeMembers.findFirst({
      where: and(
        eq(storeMembers.storeId, storeId),
        eq(storeMembers.userId, session.user.id),
      ),
    });

    if (!membership) {
      return redirect("/");
    }

    return { session, membership };
  }

  // For actions that don't require a store (like creating one)
  return { session };
}
