"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Ticket, Box, ChevronRight } from "lucide-react";
import InventuraMark from "@/components/InventuraMark";

const DashBoardSideBar = ({ onNavigate }) => {
  const pathname = usePathname();

  // keep your items; only styling changes
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: "/dashboard/orders",
    },
    {
      id: "vouchers",
      label: "Vouchers",
      icon: Ticket,
      path: "/dashboard/vouchers",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Box,
      path: "/dashboard/inventory",
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <section className="w-56 h-[80vh] dark:bg-gray flex-shrink-0 px-1  bg-stone-900 dark:bg-stone-50 rounded-l-lg border-r-gray-300 dark:border-r-gray-700 border-r ">
      {/* Panel shell matches your cards */}
      <div className=" h-full flex flex-col  p-1 ">
    

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map(({ id, label, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={id}
                href={path}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={[
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  "border border-transparent",
                  active
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
                    : "hover:bg-blue-50/70 dark:hover:bg-blue-900/20 text-gray-300 dark:text-gray-700 border-gray-200/0 dark:border-gray-800/0",
                ].join(" ")}
              >
                {/* Icon chip */}
                <span
                  className={[
                    "grid place-items-center size-8 rounded-lg ring-1",
                    active
                      ? "bg-white/20 ring-white/30"
                      : "bg-white dark:bg-gray-900 ring-gray-200 dark:ring-gray-800 group-hover:ring-blue-300/60",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "size-4",
                      active
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300",
                    ].join(" ")}
                  />
                </span>

                {/* Label */}
                <span className={active ? "font-medium" : "font-medium"}>
                  {label}
                </span>

                {/* Chevron hint (subtle) */}
                <ChevronRight
                  className={[
                    "ml-auto size-4 transition-opacity",
                    active
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 text-gray-400",
                  ].join(" ")}
                />

                {/* Focus ring for a11y */}
                <span
                  className={[
                    "pointer-events-none absolute inset-0 rounded-xl ring-2 ring-transparent",
                    "focus-within:ring-blue-500/50",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        {/* Footer strip to match your divider rhythm */}
        <div className="mt-auto bg-gray-200 dark:bg-gray-800 rounded"/>
          <div className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/60 px-3 py-2 text-[11px] text-gray-600 dark:text-gray-400">
            <span>Tip: Use the search on top 🔍</span>
          </div>
        
      </div>
    </section>
  );
};

export default DashBoardSideBar;
