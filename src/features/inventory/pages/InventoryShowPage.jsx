import BreadCrumb from "@/components/BreadCrumb";
import DashBoardLayout from "@/features/dashboard/components/DashBoardLayout";
import React from "react";
import ProductDetailSection from "../components/ProductDetailSection";

const InventoryShowPage = () => {
  return (
    <DashBoardLayout>
      <ProductDetailSection />
    </DashBoardLayout>
  );
};

export default InventoryShowPage;
