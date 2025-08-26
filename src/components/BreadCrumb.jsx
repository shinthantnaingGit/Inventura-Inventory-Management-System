import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import React from "react";

const BreadCrumb = ({ currentPageName = "New Page", links = [] }) => {
  const lastLink = links?.length ? links[links.length - 1] : null;

  return (
    <div className="mb-5 pb-5 border-b border-gray-300 dark:border-gray-700">
      {/* Desktop / Tablet: full breadcrumb */}
      <nav
        className="hidden sm:flex text-gray-700"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              <Home className="size-4" />
              Home
            </Link>
          </li>

          {links.map((link, i) => (
            <li key={i + "link"}>
              <div className="flex items-center">
                <ChevronRight className="size-4" />
                <Link
                  href={link.path}
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {link.title}
                </Link>
              </div>
            </li>
          ))}

          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="size-4" />
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                {currentPageName}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Mobile: condensed breadcrumb (Home → last link → current) */}
      <nav
        className="sm:hidden text-gray-700 overflow-x-auto no-scrollbar"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-1 rtl:space-x-reverse min-w-0">
          {/* Home */}
          <li className="flex items-center min-w-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white whitespace-nowrap"
            >
              <Home className="size-4 shrink-0" />
              <span className="truncate">Home</span>
            </Link>
          </li>

          {/* Optional: last link only */}
          {lastLink && (
            <li className="flex items-center min-w-0">
              <ChevronRight className="size-4 shrink-0" />
              <Link
                href={lastLink.path}
                className="ms-1 text-[13px] font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white whitespace-nowrap truncate"
                title={lastLink.title}
              >
                {lastLink.title}
              </Link>
            </li>
          )}

          {/* Current page */}
          <li className="flex items-center min-w-0" aria-current="page">
            <ChevronRight className="size-4 shrink-0" />
            <span
              className="ms-1 text-[13px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap truncate"
              title={currentPageName}
            >
              {currentPageName}
            </span>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default BreadCrumb;
