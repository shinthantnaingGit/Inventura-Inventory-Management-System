import DashBoardLayout from "@/features/dashboard/components/DashBoardLayout";
import React from "react";
import InventoryCreateSection from "../components/InventoryCreateSection";

const InventoryCreatePage = () => {
  return (
    <DashBoardLayout>
      <InventoryCreateSection />
    </DashBoardLayout>
  );
};

export default InventoryCreatePage;
