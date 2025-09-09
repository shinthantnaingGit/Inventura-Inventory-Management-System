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

const DesktopProfileSection = ({ profileData, onOpenPasswordModal }) => {
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
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
      {/* Desktop Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-12 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
            <p className="text-blue-100">
              Manage your account information and preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <DarkThemeToggle className="border" />
          </div>
        </div>
      </div>
      <div className="p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Profile Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden shadow-2xl">
                  {profileData.profile_image ? (
                    <img
                      src={profileData.profile_image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-white" />
                  )}
                </div>
                <label
                  htmlFor="desktop-profile-image"
                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer transition-colors shadow-lg"
                >
                  <Camera size={18} />
                  <input
                    id="desktop-profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="mb-6 flex flex-col justify-center items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  User ID: #{profileData.id}
                </p>
                {!isEditing ? (
                  <div className="flex w-80 items-center justify-center gap-2">
                    <h2 className="text-3xl  font-bold text-gray-800 dark:text-white mb-2">
                      {profileData.name}
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 -mb-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className=" w-full  text-3xl font-bold text-gray-800 dark:text-white text-center bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl px-3 py-1 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                      placeholder="Enter name"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className={`flex shadow-sm items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                          isUpdating
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="flex shadow:sm items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 dark:border dark:border-green-600/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active Profile
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Email Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Mail size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Email Address
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {profileData.email}
                  </p>
                </div>
              </div>
            </div>
            {/* Account Timeline */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Calendar size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Member Since
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {formatDate(profileData.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Calendar size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Last Updated
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {formatDate(profileData.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Change Password Button */}
            <button
              onClick={onOpenPasswordModal}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopProfileSection;
