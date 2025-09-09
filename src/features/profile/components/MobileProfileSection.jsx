"use client";
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Loader2,
  Menu,
} from "lucide-react";
import { DarkThemeToggle } from "flowbite-react";
import { useState } from "react";
import {
  storeProfileImage,
  updateProfileName,
  profileApiUrl,
} from "@/services/profile";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
// Mobile ProfileSection Component
const MobileProfileSection = ({ profileData, onOpenPasswordModal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: profileData.name });
  const [isUpdating, setIsUpdating] = useState(false);
  const { mutate } = useSWRConfig();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tokyo",
    });

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      const res = await updateProfileName({ name: editForm.name }); // <-- send object
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update name");
      }
      toast.success("Name changed successfully");
      // Refresh profile data so UI shows the new name
      await mutate(`${profileApiUrl}/profile`);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      toast.error(`${e.message}`);
      // optional: show toast here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ name: profileData.name });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUpdating(true);
      const res = await storeProfileImage(file); // <-- FormData handled in service
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to upload image");
      }
      toast.success("Profile Photo added successfully");
      // Refresh to get the new image URL/path
      await mutate(`${profileApiUrl}/profile`);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to upload image");
      // optional: toast
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white">User Profile</h1>
          <div className="flex items-center gap-2">
            <DarkThemeToggle />
          </div>
        </div>

        {/* Profile Image - Mobile */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center overflow-hidden">
              {profileData.profile_image ? (
                <img
                  src={profileData.profile_image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <label
              htmlFor="mobile-profile-image"
              className="absolute -bottom-1 -right-1 bg-white text-blue-600 p-2 rounded-full shadow-lg"
            >
              <Camera size={14} />
              <input
                id="mobile-profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {!isEditing ? (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold text-white text-center">
                {profileData.name}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 -mb-1 text-white/80 hover:text-white transition-colors"
              >
                <Edit3 size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-xl font-semibold text-gray-800 dark:text-white text-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-colors ${
                    isUpdating
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isUpdating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}
          <p className="text-blue-100 text-sm mt-1">ID: #{profileData.id}</p>
        </div>
      </div>
      {/* Mobile Content */}
      <div className="px-4 py-6 space-y-4">
        {/* Email Section - Mobile */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Mail size={16} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Email
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 ml-11">
            {profileData.email}
          </p>
        </div>
        {/* Dates Section - Mobile */}
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Calendar size={16} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white text-sm">
                  Member Since
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {formatDate(profileData.created_at)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar size={16} className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white text-sm">
                  Last Updated
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {formatDate(profileData.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Change Password Button */}
        <button
          onClick={onOpenPasswordModal}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Change Password
        </button>
        {/* Status Badge - Mobile */}
        <div className="flex justify-center pt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 dark:border dark:border-green-600/30">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileProfileSection;
