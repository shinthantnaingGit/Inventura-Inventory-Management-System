"use client"
import BreadCrumb from "@/components/BreadCrumb";
import DashBoardLayout from "@/features/dashboard/components/DashBoardLayout";
import { useParams } from "next/navigation";
import React from "react";
import InventoryEditSection from "../components/InventoryEditSection";

const InventoryEditPage = () => {
  const {id} = useParams();
  return (
    <DashBoardLayout>
      <InventoryEditSection/>
    
    </DashBoardLayout>
  );
};

export default InventoryEditPage;
