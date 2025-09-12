"use client";
import React, { useState } from "react";
import { fetchProfile, profileApiUrl } from "@/services/profile";
import PasswordChangeModal from "./PasswordChangeModal";
import ProfileMobile from "./ProfileMobile";
import ProfileDesktop from "./ProfleDesktop";
import ProfileDesktopSkeleton from "./ProfileDesktopSkeleton";
import ProfileMobileSkeleton from "./ProfileMobileSkeleton";
import useSWR from "swr";

const ProfileSection = () => {
  const {
    data: profileData,
    isLoading,
    error,
  } = useSWR(`${profileApiUrl}/profile`, fetchProfile);
  const [isDark, setIsDark] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  console.log(profileData);

  if (error) {
    return <div>Fail to fetch</div>;
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

export default ProfileSection;
