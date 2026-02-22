"use client";

import Loading from "@/components/Loading";
import { apiAdmin } from "@repo/api-client/apis";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminEntryPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const resolveAdminRoute = async () => {
      try {
        await apiAdmin.getAdminMe();
        if (!mounted) return;
        router.replace("/admin/dashboard");
      } catch {
        if (!mounted) return;
        router.replace("/admin/login");
      }
    };

    resolveAdminRoute();

    return () => {
      mounted = false;
    };
  }, [router]);

  return <Loading />;
}
