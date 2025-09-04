import React from "react";
import DashBoardLayout from "../components/DashBoardLayout";
import DashBoardSection from "../components/DashBoardSection";
import DashBoardSectionMobile from "../components/DashBoardSectionMobile";

const DashBoardPage = () => {
  return (
    <DashBoardLayout>
      {/* Desktop / Tablet (>= md): keep your current dashboard */}
      <div className="hidden md:block">
        <DashBoardSection />
      </div>

      {/* Mobile (< md): dedicated mobile dashboard */}
      <div className="md:hidden">
        <DashBoardSectionMobile />
      </div>
    </DashBoardLayout>
  );
};

export default DashBoardPage;
