"use client";
import React from "react";
import PasswordChangeModal from "./PasswordChangeModal";
import ProfileMobile from "./ProfileMobile";
import ProfileDesktop from "./ProfleDesktop";
import ProfileDesktopSkeleton from "./ProfileDesktopSkeleton";
import ProfileMobileSkeleton from "./ProfileMobileSkeleton";
import ProfileErrorState from "./ProfileErrorState";
import { useProfileHook } from "../hooks/useProfileHook";

const ProfileSection = () => {
  const {
    profileData,
    isLoading,
    error,
    mutate,
    showPasswordModal,
    handleOpenPasswordModal,
    handleClosePasswordModal,
  } = useProfileHook();

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
            profileData={profileData}
            onOpenPasswordModal={handleOpenPasswordModal}
          />
        )}
      </div>

      <div className="hidden md:block">
        {isLoading ? (
          <ProfileDesktopSkeleton />
        ) : (
          <ProfileDesktop
            profileData={profileData}
            onOpenPasswordModal={handleOpenPasswordModal}
          />
        )}
      </div>

      {showPasswordModal && (
        <PasswordChangeModal onClose={handleClosePasswordModal} />
      )}
    </div>
  );
};

export default ProfileSection;
