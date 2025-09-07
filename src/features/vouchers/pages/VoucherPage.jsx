import React from "react";
import VoucherListSection from "../components/VoucherListSection";
import DashBoardLayout from "@/features/dashboard/components/DashBoardLayout";

const VoucherPage = () => {
  return (
    <DashBoardLayout>
      <VoucherListSection />
    </DashBoardLayout>
  );
};

export default VoucherPage;
