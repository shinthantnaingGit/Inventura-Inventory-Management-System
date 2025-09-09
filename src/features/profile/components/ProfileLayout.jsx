"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { token } from "@/services/profile";

const ProfileLayout  = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
     {children}
    </main>
  );
};

export default ProfileLayout;
