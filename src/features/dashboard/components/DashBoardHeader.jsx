// components/AuthHeader.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DarkThemeToggle } from "flowbite-react";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import LogOutButton from "./LogOutButton";

const DashBoardHeader = ({ onOpenSidebar, brand = "Shin Bakery" }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  // Close profile menu on outside click / Esc
  useEffect(() => {
    const onClick = (e) =>
      profileRef.current &&
      !profileRef.current.contains(e.target) &&
      setOpenProfile(false);
    const onKey = (e) => e.key === "Escape" && setOpenProfile(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky mb-5 top-0 z-40 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Left: mobile menu + brand */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="inline-flex lg:hidden items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>

            <Link
              href="/dashboard"
              className="font-bold text-lg sm:text-xl tracking-tight text-gray-900 dark:text-gray-100"
            >
              {brand}
            </Link>
          </div>

          {/* Center: search (hidden on xs) */}
          <div className="hidden md:block flex-1 max-w-xl">
            <div className="relative">
              <input
                type="search"
                placeholder="Search orders, products, vouchers…"
                aria-label="Search dashboard"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            </div>
          </div>

          {/* Right: quick actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compact search button (mobile) */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="size-5" />
              {/* dot */}
              <span className="absolute -top-0.5 -right-0.5 block size-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-gray-900" />
            </button>

            {/* Theme toggle (Flowbite) */}
            <div className="hidden sm:block">
              <DarkThemeToggle />
            </div>

            {/* Profile menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setOpenProfile((s) => !s)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-2 pr-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-haspopup="menu"
                aria-expanded={openProfile}
              >
                {/* Avatar (initials) */}
                <span className="grid place-items-center size-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-semibold">
                  SB
                </span>
                <span className="hidden sm:block text-sm text-gray-800 dark:text-gray-100">
                  Admin
                </span>
                <ChevronDown className="size-4 text-gray-500" />
              </button>

              {openProfile && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg"
                >
                  <MenuItem
                    href="/dashboard/profile"
                    icon={User}
                    label="Profile"
                  />
                  <MenuItem
                    href="/dashboard/settings"
                    icon={Settings}
                    label="Settings"
                  />
                  <div className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
                  <LogOutButton />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Optional secondary row: breadcrumbs or tabs can go here */}
        {/* <div className="h-12 flex items-center">…</div> */}
      </div>
    </header>
  );
};

export default DashBoardHeader;

/* ---------- Small helper ---------- */
function MenuItem({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <Icon className="size-4 text-gray-500" />
      <span>{label}</span>
    </Link>
  );
}
