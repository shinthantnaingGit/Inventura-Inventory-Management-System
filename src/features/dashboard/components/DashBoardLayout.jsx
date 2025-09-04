"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAccountStore from "@/store/useAccountStore";

import DashBoardHeader from "./DashBoardHeader";
import DashBoardSideBar from "./DashBoardSideBar";
import DashBoardBottomNav from "./DashBoardBottomNav";
import { token } from "@/services/profile";

const DashBoardLayout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top header */}
      <DashBoardHeader />

      {/* Desktop layout: sidebar + content */}
      <div className="hidden md:flex p-5 gap-1">
        <DashBoardSideBar className="h-full" />
        <div className="flex-1 border py-5 px-3 dark:border-gray-700 border-gray-300 rounded bg-white/80 dark:bg-gray-900/60">
          {children}
        </div>
      </div>

      {/* Mobile layout: content only */}
      <div className="md:hidden px-5 pb-20 pt-2">
        <div className="border py-5 px-3 dark:border-gray-700 border-gray-300 rounded-xl bg-white/80 dark:bg-gray-900/60">
          {children}
        </div>
      </div>

      {/* Bottom navigation (mobile only) */}
      <DashBoardBottomNav />
    </main>
  );
};

export default DashBoardLayout;
