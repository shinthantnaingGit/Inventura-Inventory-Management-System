"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, SquareUserRound, User, Ticket, Box, ChevronRight, Receipt } from "lucide-react";
import InventuraMark from "@/components/InventuraMark";
import { useI18n } from "@/i18n/I18nProvider";

const DashBoardSideBar = ({ onNavigate }) => {
  const pathname = usePathname();
  const { t } = useI18n();

  const menuItems = [
    { id: "dashboard", label: t("nav.dashboard", "ダッシュボード"), icon: Home, path: "/dashboard" },
    // 🔄 Replaced Orders → Sales (Create Voucher)
    { id: "sales", label: t("nav.sales", "売上"), icon: Receipt, path: "/dashboard/sale" },
    { id: "vouchers", label: t("nav.vouchers", "バウチャー"), icon: Ticket, path: "/dashboard/vouchers" },
    { id: "inventory", label: t("nav.inventory", "在庫"), icon: Box, path: "/dashboard/inventory" },

  ];

  const isActive = (path) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="h-full flex flex-col rounded border dark:border-gray-700 border-gray-300 bg-white/90 dark:bg-gray-900/70 shadow-sm p-3">
        
        {/* Brand */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800 px-3 py-2 border border-gray-200 dark:border-gray-700">
          <InventuraMark className="size-6" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t("sidebar.manageInventory", "在庫管理")}
          </span>
        </div>

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
                aria-label={label}
                title={label}
                className={[
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
                    : "hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                ].join(" ")}
              >
                {/* Icon chip */}
                <span
                  className={[
                    "grid place-items-center size-8 rounded-lg ring-1",
                    active
                      ? "bg-white/20 ring-white/30"
                      : "bg-white dark:bg-gray-900 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-300/60",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "size-4",
                      active ? "text-white" : "text-gray-600 dark:text-gray-300",
                    ].join(" ")}
                  />
                </span>

                {/* Label */}
                <span className="font-medium">{label}</span>

                {/* Chevron */}
                <ChevronRight
                  className={[
                    "ml-auto size-4 transition-opacity",
                    active
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 text-gray-400",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        {/* Footer tip */}
        <div className="mt-auto">
          <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-[11px] text-gray-600 dark:text-gray-400">
            {t("sidebar.tipSearch", "💡 ヒント：上部の検索バーを活用しましょう")}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashBoardSideBar;
