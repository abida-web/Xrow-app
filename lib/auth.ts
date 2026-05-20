import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  sessions: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  plugins: [nextCookies(),admin({
    defaultRole:"owner"
  })],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
