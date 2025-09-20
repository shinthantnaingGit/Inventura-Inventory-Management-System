"use client";
import React, { useState } from "react";
import { fetchProfile, profileApiUrl } from "@/services/profile";
import PasswordChangeModal from "./PasswordChangeModal";
import ProfileMobile from "./ProfileMobile";
import ProfileDesktop from "./ProfleDesktop";
import ProfileDesktopSkeleton from "./ProfileDesktopSkeleton";
import ProfileMobileSkeleton from "./ProfileMobileSkeleton";
import useSWR from "swr";
import { AlertTriangle, RefreshCw, Home, User } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

const ProfileSection = () => {
  const {
    data: profileData,
    isLoading,
    error,
    mutate,
  } = useSWR(`${profileApiUrl}/profile`, fetchProfile);
  const [isDark, setIsDark] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  console.log(profileData);

  if (error) {
    return <ProfileErrorState onRetry={() => mutate()} />;
  }
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-4 md:py-8 transition-colors duration-300">
      <div className="md:hidden">
        {isLoading ? (
          <ProfileMobileSkeleton />
        ) : (
          <ProfileMobile
            profileData={profileData?.data}
            onOpenPasswordModal={() => setShowPasswordModal(true)}
          />
        )}
      </div>

      <div className="hidden md:block">
        {isLoading ? (
          <ProfileDesktopSkeleton />
        ) : (
          <ProfileDesktop
            profileData={profileData?.data}
            onOpenPasswordModal={() => setShowPasswordModal(true)}
          />
        )}
      </div>

      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

// Error State Component
function ProfileErrorState({ onRetry }) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-4 md:py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Error Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
                    {t("profile.errors.title", "Failed to Load Profile")}
                  </h2>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {t(
                      "profile.errors.subtitle",
                      "We couldn't fetch your profile information"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t("profile.errors.heading", "Profile Unavailable")}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {t(
                    "profile.errors.description",
                    "There was an error loading your profile information. This could be due to a network issue or server problem."
                  )}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t("profile.errors.tryAgain", "Try Again")}
                  </button>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <Home className="h-4 w-4" />
                    {t("profile.errors.goToDashboard", "Go to Dashboard")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(
                    "profile.errors.supportMessage",
                    "If this problem persists, please contact support"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              {t(
                "profile.errors.troubleshootingTitle",
                "Troubleshooting Tips:"
              )}
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              {t("profile.errors.tips", [
                "Check your internet connection",
                "Try refreshing the page",
                "Clear your browser cache",
                "Make sure you're logged in properly",
              ]).map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
