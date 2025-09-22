"use client";

import { MailDetail } from "@/components/mail/MailDetail";
import { MailList } from "@/components/mail/MailList";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUIStore } from "@repo/store";
import { useEmailPolling } from "@/hooks/usePolling";

export default function MailPage() {
  const params = useParams();
  const folder = params.folder;

  const { isSmallScreen, setShowMailList, setIsSmallScreen, showMailList } =
    useUIStore();
  const { startPolling, stopPolling } = useEmailPolling();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateScreenSize = () => {
      const small = mediaQuery.matches;
      setIsSmallScreen(small);
      setShowMailList(small); // On small screen, start with mail list
    };

    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);
    return () => mediaQuery.removeEventListener("change", updateScreenSize);
  }, []);

  const handleEmailSelect = () => {
    if (isSmallScreen) {
      setShowMailList(false);
    }
  };

  const handleBackToList = () => {
    if (isSmallScreen) {
      setShowMailList(true);
    }
  };
  // useEffect(() => {
  //   startPolling();
  //   return () => stopPolling();
  // }, []);
  return (
    <div className="h-full w-full flex">
      {/* Show MailList */}
      {(showMailList || !isSmallScreen) && (
        <div className="min-w-[40%] w-full md:w-[40%] rounded-2xl border border-[#3f3f3f7a] m-0.5 overflow-y-auto scrollbar-custom">
          <MailList />
        </div>
      )}

      {/* Show MailDetail */}
      {(!showMailList || !isSmallScreen) && (
        <div className="flex-1 overflow-y-auto border border-[#3f3f3f7a] m-0.5 rounded-2xl scrollbar-custom relative">
          <MailDetail />
        </div>
      )}
    </div>
  );
}
