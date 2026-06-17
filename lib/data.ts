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
} from "lucide-react";

export const sidebarItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  { id: "orders", icon: ShoppingCart, label: "Orders" },
  {
    id: "products",
    icon: Package,
    label: "Products",
    subMenus: [
      {
        id: "collections",
        label: "Collections",
        path: "/products/collections",
      },
      { id: "inventory", label: "Inventory", path: "/products/inventory" },

      { id: "gift-cards", label: "Gift cards", path: "/products/gift-cards" },
    ],
  },
  { id: "customers", icon: Users, label: "Customers" },
  { id: "marketing", icon: Megaphone, label: "Marketing" },
  { id: "discounts", icon: Tag, label: "Discounts" },
  { id: "content", icon: FileText, label: "Content" },
  { id: "markets", icon: Store, label: "Markets" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
];
