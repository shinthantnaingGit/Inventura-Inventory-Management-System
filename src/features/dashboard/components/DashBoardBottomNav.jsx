"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Ticket,
  Box,
  User,
} from "lucide-react";

const DashBoardBottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "orders", label: "Orders", icon: ShoppingCart, path: "/dashboard/orders" },
    { id: "vouchers", label: "Vouchers", icon: Ticket, path: "/dashboard/vouchers" },
    { id: "inventory", label: "Inventory", icon: Box, path: "/dashboard/inventory" },
    { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t h-15 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
      <ul className="flex justify-around items-center">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const active = isActive(path);
          return (
            <li key={id} className="flex-1">
              <Link
                href={path}
                className={`flex flex-col items-center justify-center py-2 text-xs ${
                  active
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <Icon className="size-5 mb-0.5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DashBoardBottomNav;
