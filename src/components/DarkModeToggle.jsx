"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();
  // const [mounted, setMounted] = useState(false);

  // // useEffect only runs on the client, so now we can safely show the UI
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   return (
  //     <button
  //       className={`inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}
  //       disabled
  //     >
  //       <Sun className="h-4 w-4" />
  //     </button>
  //   );
  // }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`inline-flex items-center px-3 py-1.5 justify-center ${className}`}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}