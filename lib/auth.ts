import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  sessions: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Make sure to actually send the email
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `<a href="${url}">Click here to verify your email</a>`,
        text: `Click the link to verify your email: ${url}`,
      });
    },
    sendOnSignIn: true, // Re-send if user tries to sign in without verifying
    autoSignInAfterVerification: true, // Auto sign-in after verification
  },

  user: {
    additionalFields: {
      onboardingCompleted: {
        type: "boolean",
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin({
      defaultRole: "owner",
    }),
    nextCookies(), // Move this to the end
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
