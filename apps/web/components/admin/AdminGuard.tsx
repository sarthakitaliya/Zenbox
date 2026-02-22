"use client";

import Loading from "@/components/Loading";
import { apiAdmin } from "@repo/api-client/apis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminAuth = async () => {
      try {
        await apiAdmin.getAdminMe();
        if (!mounted) return;
        setChecking(false);
      } catch {
        if (!mounted) return;
        router.replace("/admin/login");
      }
    };

    checkAdminAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return <Loading />;
  }

  return <>{children}</>;
}
