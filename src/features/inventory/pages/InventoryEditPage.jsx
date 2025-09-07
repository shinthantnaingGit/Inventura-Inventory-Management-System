"use client"
import DashBoardLayout from "@/features/dashboard/components/DashBoardLayout";
import React from "react";
import InventoryEditSection from "../components/InventoryEditSection";

const InventoryEditPage = () => {
  return (
    <DashBoardLayout>
      <InventoryEditSection/>
    
    </DashBoardLayout>
  );
};

export default InventoryEditPage;
