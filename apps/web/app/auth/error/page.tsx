"use client";
import AuthError from "@/components/Error";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function ErrorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthError />
    </Suspense>
  );
}
