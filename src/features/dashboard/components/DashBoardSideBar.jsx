"use client";
import React from "react";
import { Box, Home, ShoppingCart, Ticket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashBoardSideBar = () => {
  const pathname = usePathname();
  console.log(usePathname())

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="size-5" />,
      path: "/dashboard",
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart className="size-5" />,
      path: "/dashboard/orders",
    },
    {
      id: "vouchers",
      label: "Vouchers",
      icon: <Ticket className="size-5" />,
      path: "/dashboard/vouchers",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <Box className="size-5" />,
      path: "/dashboard/inventory",
    },
  ];

  const isActive = (path) => {
    // Exact match for the root dashboard
    if (path === "/dashboard") return pathname === "/dashboard";
    // Exact or nested for the rest (e.g., /dashboard/inventory/123)
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <aside className="hidden md:block w-56 flex-shrink-0">
      <div className="sticky top-24 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              href={item.path}
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200 shadow-sm ${
                active
                  ? "bg-blue-500 dark:bg-blue-800/60"
                  : "bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.icon}
              <span className="text-md font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default DashBoardSideBar;
