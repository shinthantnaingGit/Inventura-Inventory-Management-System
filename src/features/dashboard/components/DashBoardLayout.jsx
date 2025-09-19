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
      {/* Fixed header */}
      <DashBoardHeader />

      {/* Desktop layout: sidebar and content in one frame */}
      <div className="hidden md:block p-5 pt-20">
        <div className="h-[calc(100vh-104px)] border dark:border-gray-700 border-gray-300 rounded-lg bg-white/90 dark:bg-gray-900/70 shadow-sm overflow-hidden">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-60 flex-shrink-0 border-r dark:border-gray-700 border-gray-300">
              <div className="h-full py-6 px-4">
                <DashBoardSideBar />
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto">
              <div className="py-2.5 h-full">{children}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout: content only */}
      <div className="md:hidden px-5 pb-20 pt-20">
        <div className="border print:border-0 mb-30 py-5 px-3 dark:border-gray-700 border-gray-300 rounded-xl bg-white/80 dark:bg-gray-900/60">
          {children}
        </div>
      </div>

      {/* Bottom navigation (mobile only) */}
      <DashBoardBottomNav />
    </main>
  );
};

export default DashBoardLayout;
