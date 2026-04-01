
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getActiveAccount } from "../lib/auth";





function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.exp) return false;

    return payload.exp * 1000 < Date.now();
  } catch {
    return false;
  }
}





export function getValidActiveAccount() {
  const active = getActiveAccount();
  if (!active) return null;

  if (isTokenExpired(active.token)) {


    try {
      localStorage.removeItem("auth_active_email");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch {}
    return null;
  }

  return active;
}








export function useRequireAuth(
redirectPath = "/auth",
allowAuthAccess = false)
{
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const active = getValidActiveAccount();

    if (!active) {

      if (pathname !== redirectPath) router.replace(redirectPath);
    } else if (!allowAuthAccess && pathname.startsWith("/auth")) {

      router.replace("/me");
    }

    setChecking(false);
  }, [router, pathname, redirectPath, allowAuthAccess]);

  return checking;
}