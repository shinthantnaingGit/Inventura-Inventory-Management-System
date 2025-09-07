"use client";
import React from "react";
import DashBoardLayout from "@/features/dashboard/components/DashBoardLayout";
import InventoryListSection from "../components/InventoryListSection";

const InventoryPage = () => {
  return (
    <DashBoardLayout>
      <InventoryListSection />
    </DashBoardLayout>
  );
};

export default InventoryPage;
