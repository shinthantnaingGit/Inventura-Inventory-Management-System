"use client";

import useAccountStore from "@/store/useAccountStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const LogOutButton = () => {
  const { logOut } = useAccountStore();
  const router = useRouter();

  const handleLogOut = () => {
    logOut();
    router.push("/");
  };
  return (
     <button
      onClick={handleLogOut}
      className="flex items-center w-full cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
};

export default LogOutButton;
