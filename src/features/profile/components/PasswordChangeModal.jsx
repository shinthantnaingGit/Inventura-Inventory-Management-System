"use client";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useProfileHook } from "../hooks/useProfileHook";

// Password Change Modal Component
const PasswordChangeModal = ({ onClose }) => {
  const { t } = useI18n();
  const {
    passwords,
    passwordMessage,
    isSubmittingPassword,
    handlePasswordChange,
    handlePasswordInputChange,
  } = useProfileHook();


  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t("profile.passwordModal.title")}
        </h3>
        {passwordMessage && <p className="text-sm text-red-500 mb-4">{passwordMessage}</p>}
        <div className="space-y-4">
          <input
            type="password"
            name="old_password"
            value={passwords.old_password}
            onChange={handlePasswordInputChange}
            placeholder={t("profile.passwordModal.placeholders.oldPassword")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="new_password"
            value={passwords.new_password}
            onChange={handlePasswordInputChange}
            placeholder={t("profile.passwordModal.placeholders.newPassword")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="new_password_confirmation"
            value={passwords.new_password_confirmation}
            onChange={handlePasswordInputChange}
            placeholder={t(
              "profile.passwordModal.placeholders.confirmPassword"
            )}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={handlePasswordChange}
            disabled={isSubmittingPassword}
            className={`flex-1 flex items-center justify-center py-3 rounded-xl font-semibold transition-colors ${
              isSubmittingPassword
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmittingPassword ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              t("profile.passwordModal.actions.save")
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmittingPassword}
            className="flex-1 flex items-center justify-center py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {t("profile.passwordModal.actions.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
