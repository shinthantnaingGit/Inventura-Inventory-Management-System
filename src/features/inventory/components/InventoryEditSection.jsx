import React from "react";
import ProductEditForm from "./ProductEditForm";

const InventoryEditSection = () => {
  return (
    <section>
      <h3 className="text-gray-900 text-xl dark:text-gray-100 font-bold mb-5">
        Edit Product
      </h3>
      <ProductEditForm />
    </section>
  );
};

export default InventoryEditSection;
