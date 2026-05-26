"use server";
import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function updateOnboardingUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const update = await db
    .update(user)
    .set({ onboardingCompleted: true })
    .where(eq(user.id, session.user.id))
    .returning();

  if (!update || update.length === 0) {
    throw new Error("User not found");
  }

  return { success: true };
}
