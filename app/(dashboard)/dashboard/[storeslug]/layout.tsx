"use server";

import { db } from "@/drizzle/db";
import { store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../../_components/Sidebar";
import Topbar from "../../_components/Topbar";

const StoreLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeslug: string }>;
}) => {
  const { storeslug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  // CHECK 1: User must be authenticated
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  // CHECK 2: Verify the user owns this store
  const isStore = await db.query.store.findFirst({
    where: and(
      eq(store.slug, storeslug), // REMOVED the ? after store
      eq(store.ownerId, session.user.id), // REMOVED the ? after session
    ),
  });

  // CHECK 3: If no store found, redirect
  if (!isStore) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Top Bar - Full Width */}
      <Topbar />

      {/* Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile sidebar - overlay mode */}

        {/* Desktop sidebar - always visible */}
        <div className="hidden md:block">
          <Sidebar storeSlug={storeslug} />
        </div>

        {/* Main content - always takes remaining space */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default StoreLayout;
