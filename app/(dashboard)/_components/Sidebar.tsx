"use client";
import { sidebarItems } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const Sidebar = ({ storeSlug }: { storeSlug: string }) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );
  const pathname = usePathname();

  const toggleSubMenu = (itemId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Check if any submenu item is active
  const isSubMenuActive = (item: any) => {
    if (!item.subMenus || item.subMenus.length === 0) return false;

    return item.subMenus.some((subItem: any) => {
      const subHref = `/dashboard/${storeSlug}/products/${subItem.id}`;
      return pathname === subHref;
    });
  };

  // Auto-expand if a submenu item is active
  React.useEffect(() => {
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
            const hasSubMenus = item.subMenus && item.subMenus.length > 0;
            const isExpanded = expandedMenus[item.id];
            const isParentActive = isActive || isSubMenuActive(item);

            return (
              <li key={item.id} className="mb-1">
                {/* Parent Menu Item */}
                <div
                  onClick={() => {
                    if (hasSubMenus) {
                      toggleSubMenu(item.id);
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    isParentActive && !hasSubMenus
                      ? "bg-[#06102c] text-white"
                      : isParentActive && hasSubMenus
                        ? "bg-[#06102c] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Link
                    href={href}
                    className="flex items-center gap-3 flex-1"
                    onClick={(e) => {
                      if (hasSubMenus) {
                        e.preventDefault();
                        toggleSubMenu(item.id);
                      }
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>

                  {hasSubMenus && (
                    <button
                      onClick={() => toggleSubMenu(item.id)}
                      className="p-1"
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
