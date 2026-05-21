import { createAuthClient } from "better-auth/react";
import { admin } from "better-auth/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [admin(), inferAdditionalFields<typeof auth>()],
});
