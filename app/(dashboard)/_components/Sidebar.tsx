"use client";
import { sidebarItems } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = ({ storeSlug }: { storeSlug: string }) => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white shadow-lg">
      <nav className="p-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            // Special handling for dashboard - point to base slug page
            const href =
              item.id === "dashboard"
                ? `/dashboard/${storeSlug}`
                : `/dashboard/${storeSlug}/${item.id}`;

            // Check if current route matches
            const isActive =
              item.id === "dashboard"
                ? pathname === `/dashboard/${storeSlug}`
                : pathname === `/dashboard/${storeSlug}/${item.id}`;

            const Icon = item.icon;

            return (
              <li key={item.id}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#06102c] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
