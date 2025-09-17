"use client";
import { useState } from "react";

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    confirmText: "削除する",
    cancelText: "キャンセル",
    onConfirm: () => {},
  });

  const showDialog = (config) => {
    setDialogConfig({
      title: config.title || "削除の確認",
      description: config.description || "この操作は取り消せません。",
      confirmText: config.confirmText || "削除する",
      cancelText: config.cancelText || "キャンセル",
      onConfirm: config.onConfirm || (() => {}),
    });
    setIsOpen(true);
  };

  const hideDialog = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    dialogConfig.onConfirm();
    hideDialog();
  };

  return {
    isOpen,
    dialogConfig,
    showDialog,
    hideDialog,
    handleConfirm,
  };
}
