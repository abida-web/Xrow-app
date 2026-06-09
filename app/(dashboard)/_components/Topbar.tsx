"use client";

import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { sidebarItems } from "@/lib/data";

interface SubMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subMenus?: SubMenuItem[];
}

const UnifiedTopbar = ({ storeSlug }: { storeSlug: string }) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleSubMenu = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const isSubMenuActive = (item: MenuItem) => {
    if (!item.subMenus?.length) return false;
    return item.subMenus.some((subItem) => {
      const subHref = `/dashboard/${storeSlug}/${subItem.id}`;
      return pathname === subHref;
    });
  };

  const getParentHref = (item: MenuItem) => {
    if (item.id === "dashboard") {
      return `/dashboard/${storeSlug}`;
    }
    return `/dashboard/${storeSlug}/${item.id}`;
  };

  // Auto-expand if a submenu item is active
  useEffect(() => {
    sidebarItems.forEach((item: MenuItem) => {
      if (isSubMenuActive(item) && !expandedMenus[item.id]) {
        setExpandedMenus((prev) => ({ ...prev, [item.id]: true }));
      }
    });
  }, [pathname]);

  return (
    <>
      {/* Main Top Bar - contains everything */}
      <div className="bg-[#06102c] sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 md:px-8 py-3">
          {/* Row 1: Logo, Search, User Menu (always visible) */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <h1 className="text-lg font-semibold text-white flex-shrink-0">
              Xrow
            </h1>

            {/* Search Bar - full width on mobile, auto on desktop */}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-white focus-within:bg-white/20 transition-all flex-1 max-w-md">
              <Search className="w-4 h-4 opacity-70 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none placeholder:text-white/50 flex-1 min-w-0"
              />
            </div>

            {/* User Menu */}
            <div className="flex text-white gap-5 items-center flex-shrink-0">
              <Bell size={20} />
              <span className="bg-gray-400 py-1.5 px-2 font-semibold rounded-sm text-[#06102c]">
                AB
              </span>
            </div>
          </div>

          {/* Row 2: Navigation Links (hidden on mobile, visible on desktop) */}
          <div className="hidden md:block mt-4 pt-2 border-t border-white/10">
            <nav className="flex flex-wrap items-center gap-1">
              {sidebarItems.map((item: MenuItem) => {
                const hasSubMenus = item.subMenus && item.subMenus.length > 0;
                const isExpanded = expandedMenus[item.id];
                const parentHref = getParentHref(item);
                const isParentActive =
                  pathname === parentHref || isSubMenuActive(item);
                const Icon = item.icon;

                return (
                  <div key={item.id} className="relative group">
                    {/* Parent Menu Item */}
                    <div
                      className={`flex items-center rounded-lg transition-colors ${
                        isParentActive
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Link
                        href={parentHref}
                        className="flex items-center gap-2 px-3 py-2 text-sm"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>

                      {hasSubMenus && (
                        <button
                          onClick={(e) => toggleSubMenu(item.id, e)}
                          className="p-1 pr-2 focus:outline-none"
                        >
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Dropdown Sub-menu */}
                    {hasSubMenus && isExpanded && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg min-w-[200px] z-50">
                        {item.subMenus?.map((subItem) => {
                          const subHref = `/dashboard/${storeSlug}/${subItem.id}`;
                          const isSubActive = pathname === subHref;
                          const SubIcon = subItem.icon;

                          return (
                            <Link
                              key={subItem.id}
                              href={subHref}
                              className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                                isSubActive
                                  ? "bg-gray-100 text-[#06102c]"
                                  : "text-gray-700 hover:bg-gray-50"
                              } first:rounded-t-lg last:rounded-b-lg`}
                            >
                              {SubIcon && <SubIcon className="w-3.5 h-3.5" />}
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Mobile Menu Button - shows/hides navigation on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white text-sm mt-3 w-full flex  gap-1 py-1 border-t border-white/10 pt-3"
          >
            <Menu className={`w-4 h-4 `} />
          </button>

          {/* Mobile Navigation Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-2 pt-2 border-t border-white/10">
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item: MenuItem) => {
                  const hasSubMenus = item.subMenus && item.subMenus.length > 0;
                  const isExpanded = expandedMenus[item.id];
                  const parentHref = getParentHref(item);
                  const isParentActive =
                    pathname === parentHref || isSubMenuActive(item);
                  const Icon = item.icon;

                  return (
                    <div key={item.id}>
                      {/* Parent Item */}
                      <div
                        className={`flex items-center justify-between rounded-lg transition-colors ${
                          isParentActive
                            ? "bg-white/20 text-white"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Link
                          href={parentHref}
                          className="flex items-center gap-3 px-3 py-2 text-sm flex-1"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>

                        {hasSubMenus && (
                          <button
                            onClick={(e) => toggleSubMenu(item.id, e)}
                            className="p-2 pr-3"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Sub-menu Items */}
                      {hasSubMenus && isExpanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.subMenus?.map((subItem) => {
                            const subHref = `/dashboard/${storeSlug}/${subItem.id}`;
                            const isSubActive = pathname === subHref;
                            const SubIcon = subItem.icon;

                            return (
                              <Link
                                key={subItem.id}
                                href={subHref}
                                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                                  isSubActive
                                    ? "bg-white/20 text-white"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                {SubIcon && <SubIcon className="w-3.5 h-3.5" />}
                                <span>{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UnifiedTopbar;
