"use client";
import { sidebarItems } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const Sidebar = ({ storeSlug }: { storeSlug: string }) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );
  const pathname = usePathname();

  const toggleSubMenu = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Check if any submenu item is active
  const isSubMenuActive = (item: any) => {
    if (!item.subMenus?.length) return false;
    return item.subMenus.some((subItem: any) => {
      const subHref = `/dashboard/${storeSlug}/${subItem.id}`;
      return pathname === subHref;
    });
  };

  // Get the parent href
  const getParentHref = (item: any) => {
    if (item.id === "dashboard") {
      return `/dashboard/${storeSlug}`;
    }
    return `/dashboard/${storeSlug}/${item.id}`;
  };

  // Auto-expand if a submenu item is active
  useEffect(() => {
    sidebarItems.forEach((item) => {
      if (isSubMenuActive(item) && !expandedMenus[item.id]) {
        setExpandedMenus((prev) => ({ ...prev, [item.id]: true }));
      }
    });
  }, [pathname]);

  return (
    <aside className="w-64 h-full bg-white shadow-lg">
      <nav className="p-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const hasSubMenus = item.subMenus?.length > 0;
            const isExpanded = expandedMenus[item.id];
            const parentHref = getParentHref(item);
            const isParentActive =
              pathname === parentHref || isSubMenuActive(item);

            const Icon = item.icon;

            return (
              <li key={item.id} className="mb-1">
                {/* Parent Menu Item */}
                <div
                  className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                    isParentActive
                      ? "bg-[#06102c] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Link
                    href={parentHref}
                    className="flex items-center gap-3 flex-1"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>

                  {hasSubMenus && (
                    <button
                      onClick={(e) => toggleSubMenu(item.id, e)}
                      className="p-1 focus:outline-none"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Sub-menu Items */}
                {hasSubMenus && isExpanded && (
                  <ul className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3">
                    {item.subMenus.map((subItem: any) => {
                      const subHref = `/dashboard/${storeSlug}/${subItem.id}`;
                      const isSubActive = pathname === subHref;
                      const SubIcon = subItem.icon;

                      return (
                        <li key={subItem.id}>
                          <Link
                            href={subHref}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                              isSubActive
                                ? "bg-gray-200 text-[#06102c]"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {SubIcon && <SubIcon className="w-3.5 h-3.5" />}
                            <span>{subItem.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
