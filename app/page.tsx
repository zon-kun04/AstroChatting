"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/utils/auth";
import { LoadingScreen } from "@/components/app/LoadingScreen";import { jsx as _jsx } from "react/jsx-runtime";





export default function RootPage() {
  const router = useRouter();
  const checking = useRequireAuth("/auth", false);

  useEffect(() => {
    if (!checking) {
      router.replace("/me");
    }
  }, [checking, router]);

  return _jsx(LoadingScreen, {});
}