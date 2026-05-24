"use server";
import { db } from "@/drizzle/db";
import { session, user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function updateOnboardingUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  const update = await db
    .update(user)
    .set({ onboardingCompleted: true })
    .where(eq(user.id, session?.user.id))
    .returning();
  return { success: true };
}
