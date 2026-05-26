"use client";

import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthCallBack = () => {
  const router = useRouter();
  useEffect(() => {
    const handleAuth = async () => {
      const { data: session } = await authClient.getSession();
      if (!session?.user) {
        router.push("/auth/sign-in");
        return;
      }
      const isNewUser = session.user.createdAt === session.user.updatedAt;
      const needOnboarding = isNewUser || !session.user.onboardingCompleted;
      if (needOnboarding) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
    };
    handleAuth();
  }, [router]);
};

export default AuthCallBack;
