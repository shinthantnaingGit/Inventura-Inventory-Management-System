"use client";
import React from "react";
import { Box, Home, LogOut, ShoppingCart, Ticket } from "lucide-react";
import useActiveMenu from "../hooks/useActiveMenu";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const DashBoardSideBar = () => {
  const { active, setActive } = useActiveMenu();

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

  return (
    <aside className="hidden md:block w-56 flex-shrink-0">
      <div className="sticky top-24 space-y-2">
        {menuItems.map((item) => (
          <Link
            href={item.path}
            key={item.id}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200 shadow-sm ${
              active === item.id
                ? "bg-blue-200 dark:bg-blue-800/60"
                : "bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60"
            }`}
            onClick={() => setActive(item.id)}
          >
            {item.icon}
            <span className="text-md font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
      <LogOutButton />
    </aside>
  );
};

export default DashBoardSideBar;
