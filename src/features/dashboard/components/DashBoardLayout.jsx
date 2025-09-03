import DashBoardBottomNav from "./DashBoardBottomNav";
import DashBoardHeader from "./DashBoardHeader";
import DashBoardSideBar from "./DashBoardSideBar";

const DashBoardLayout = ({ children }) => {
  return (
    <main className="pb-16 min-h-screen  bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <DashBoardHeader />

      {/* Sidebar + content (desktop only) */}
      <div className="hidden md:block p-5">
        <div className="w-full flex items-start border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
          <DashBoardSideBar />
          <div className="flex-1 bg-stone-100 dark:bg-gray-800 px-3">{children}</div>
        </div>
      </div>

      {/* Content only (mobile) */}
      <div className="md:hidden p-5">{children}</div>

      {/* Bottom nav (mobile only) */}
      <DashBoardBottomNav />
    </main>
  );
};

export default DashBoardLayout;
