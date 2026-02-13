"use client";
import Loading from "@/components/Loading";
import ComposePopup from "@/components/mail/ComposePopup";
import Sidebar from "@/components/mail/Sidebar";
import { useCategoryStore, useUIStore } from "@repo/store";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const JUST_SIGNED_IN_KEY = "zenbox:just-signed-in";

export default function MailLayout({ children }: { children: ReactNode }) {
  const [checkingCategories, setCheckingCategories] = useState(true);
  const router = useRouter();
  const { checkCategories } = useCategoryStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkIfUserHasCategories = async () => {
      const hasCategories = await checkCategories(false);
      if (!isMounted) return;

      if (hasCategories !== true) {
        const justSignedIn =
          typeof window !== "undefined" &&
          window.sessionStorage.getItem(JUST_SIGNED_IN_KEY) === "1";

        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(JUST_SIGNED_IN_KEY);
        }

        router.replace(
          justSignedIn
            ? "/setup-categories"
            : "/setup-categories?reason=missing-categories"
        );
        return;
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(JUST_SIGNED_IN_KEY);
      }
      setCheckingCategories(false);
    };

    checkIfUserHasCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 768px)");
    const handleResize = () => {
      if (mq.matches) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    mq.addEventListener("change", handleResize);
    return () => mq.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (checkingCategories) {
    return <Loading />;
  }
  return (
    <div className="bg-[#111112] flex h-screen w-full">
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`transition-all duration-300 md:relative fixed top-0 left-0 z-40 h-full bg-[#111112] ${
          sidebarOpen ? "w-[220px]" : "w-0"
        } overflow-hidden`}
      >
        <Sidebar />
      </div>
      <main className="bg-[#1A1A1A] flex-1 overflow-hidden rounded-l-2xl scrollbar-custom">
        {children}
      </main>
      <ComposePopup />
    </div>
  );
}
