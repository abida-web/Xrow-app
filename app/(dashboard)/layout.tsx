// app/dashboard/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Megaphone,
  Tag,
  FileText,
  Store,
  BarChart3,
  Settings,
  Search,
  Bell,
} from "lucide-react";
import { sidebarItems } from "@/lib/data";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Top Bar - Full Width */}
      <div className="bg-[#06102c] rounded-b-2xl shadow-sm border-b">
        <div className="px-4 sm:px-6 md:px-8 py-3 md:py-4">
          {/* Row 1: Logo and Icons (mobile) */}
          <div className="flex justify-between items-center md:hidden mb-3">
            <h1 className="text-lg font-semibold text-white">Xrow</h1>
            <div className="flex text-white gap-5 items-center">
              <Bell size={20} />
              <span className="bg-gray-400 py-1.5 px-2 font-semibold rounded-sm text-[#06102c]">
                AB
              </span>
            </div>
          </div>

          {/* Main layout: switches between stacked (mobile) and horizontal (tablet/desktop) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Logo - hidden on mobile (shown above), visible on tablet/desktop */}
            <h1 className="hidden md:block text-lg font-semibold text-white flex-shrink-0">
              Xrow
            </h1>

            {/* Search Bar - full width on mobile, auto width on tablet/desktop */}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-white focus-within:bg-white/20 transition-all w-full md:w-auto md:min-w-[300px] lg:min-w-[400px] xl:min-w-[500px]">
              <Search className="w-4 h-4 opacity-70 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none placeholder:text-white/50 flex-1 min-w-0"
              />
            </div>

            {/* Icons - visible on tablet/desktop only */}
            <div className="hidden md:flex text-white gap-5 items-center flex-shrink-0">
              <Bell size={20} />
              <span className="bg-gray-400 py-1.5 px-2 font-semibold rounded-sm text-[#06102c]">
                AB
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64  bg-white shadow-lg">
          <nav className="p-4 ">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#06102c] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
