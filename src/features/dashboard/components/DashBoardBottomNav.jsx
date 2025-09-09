"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, SquareUserRound, Ticket, Box, User, Receipt } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const DashBoardBottomNav = () => {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    {
      id: "dashboard",
      label: t("nav.dashboard", "ダッシュボード"),
      icon: Home,
      path: "/dashboard",
    },
    // 🔄 Replaced Orders → Sales (Create Voucher)
    {
      id: "sales",
      label: t("nav.sales", "売上"),
      icon: Receipt,
      path: "/dashboard/sale",
    },
    {
      id: "vouchers",
      label: t("nav.vouchers", "バウチャー"),
      icon: Ticket,
      path: "/dashboard/vouchers",
    },
    {
      id: "inventory",
      label: t("nav.inventory", "在庫"),
      icon: Box,
      path: "/dashboard/inventory",
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="md:hidden print:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 h-18 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg">
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
                aria-label={label}
                title={label}
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
