"use client";
import React, { useState } from "react";
import { getProfile } from "@/services/profile";
import MobileProfileSection from "./MobileProfileSection";
import DesktopProfileSection from "./DesktopProfileSection";
import PasswordChangeModal from "./PasswordChangeModal";

const ProfileSection = () => {
  const { data: profileData, isLoading, error } = getProfile();
  const [isDark, setIsDark] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  console.log(profileData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Fail to fetch</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-4 md:py-8 transition-colors duration-300">
      <div className="md:hidden">
        <MobileProfileSection
          profileData={profileData?.data}
          onOpenPasswordModal={() => setShowPasswordModal(true)}
        />
      </div>

      <div className="hidden md:block">
        <DesktopProfileSection
          profileData={profileData?.data}
          onOpenPasswordModal={() => setShowPasswordModal(true)}
        />
      </div>

      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default ProfileSection;
