"use client";
import { useEffect } from "react";

import useAccountStore from "@/store/useAccountStore";
import { useRouter } from "next/navigation";
import AuthHeader from "@/features/auth/components/AuthHeader";
import { token } from "@/services/profile";
import DashBoardSideBar from "./DashBoardSideBar";
import DashBoardHeader from "./DashBoardHeader";

const DashBoardLayout = ({ children }) => {
  const router = useRouter();
  // const { token } = useAccountStore.getState();
  // console.log(JSON.parse(localStorage.getItem("account-storage")))
  // console.log(token);
  // if(!token){
  //   return <p>You are not allowed to log in</p>
  // }
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);
  //need dependencies to use token directly from useAccountStore

  return (
    <main className="py-2 px-5 min-h-screen bg-gray-50 dark:bg-gray-900 ">
      <DashBoardHeader/>
      <div className="flex gap-6 items-start p-5">
        <DashBoardSideBar />
        <div className="flex-1 border py-5 px-3 dark:border-gray-700 border-gray-300 rounded-xl">{children}</div>
      </div>
    </main>
  );
};

export default DashBoardLayout;
