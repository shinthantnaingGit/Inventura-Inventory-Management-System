"use client";
import { updatePassword } from "@/services/profile";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// Password Change Modal Component
const PasswordChangeModal = ({ onClose }) => {
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setMessage("");
    setIsSubmitting(true);
    if (passwords.new_password !== passwords.new_password_confirmation) {
      setMessage("New passwords don't match.");
      setIsSubmitting(false);
      return;
    }
    // Simulate an async save operation
    try {
      const res = await updatePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password,
        new_password_confirmation: passwords.new_password_confirmation,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to change password");
      }
      toast.success("Password changed successfully");

      setMessage("Password changed successfully!");
      onClose();
    } catch (e) {
    //   console.error(e);
      toast.error(e.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Change Password
        </h3>
        {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
        <div className="space-y-4">
          <input
            type="password"
            name="old_password"
            value={passwords.old_password}
            onChange={handleInputChange}
            placeholder="Old Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="new_password"
            value={passwords.new_password}
            onChange={handleInputChange}
            placeholder="New Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="new_password_confirmation"
            value={passwords.new_password_confirmation}
            onChange={handleInputChange}
            placeholder="Confirm New Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center py-3 rounded-xl font-semibold transition-colors ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "Save Password"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
