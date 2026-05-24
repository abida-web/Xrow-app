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
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    id: "orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    label: "Orders",
  },
  {
    id: "products",
    href: "/dashboard/products",
    icon: Package,
    label: "Products",
  },
  {
    id: "customers",
    href: "/dashboard/customers",
    icon: Users,
    label: "Customers",
  },
  {
    id: "marketing",
    href: "/dashboard/marketing",
    icon: Megaphone,
    label: "Marketing",
  },
  {
    id: "discounts",
    href: "/dashboard/discounts",
    icon: Tag,
    label: "Discounts",
  },
  {
    id: "content",
    href: "/dashboard/content",
    icon: FileText,
    label: "Content",
  },
  { id: "markets", href: "/dashboard/markets", icon: Store, label: "Markets" },
  {
    id: "analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    label: "Analytics",
  },
  {
    id: "settings",
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
  },
];
