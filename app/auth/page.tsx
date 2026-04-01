"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccounts, getActiveAccount, setActiveAccount } from "../../lib/auth";
import { Bubbles } from "../../components/auth/Bubbles";
import { AccountsView } from "../../components/auth/AccountsView";
import { LoginView } from "../../components/auth/LoginView";
import { RegisterView } from "../../components/auth/RegisterView";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";





export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState("init");

  useEffect(() => {
    const active = getActiveAccount();
    if (active) {
      router.push("/me");
      return;
    }
    const accounts = getAccounts();
    setView(accounts.length > 0 ? "accounts" : "login");
  }, [router]);

  const handleLogin = () => router.push("/me");

  const handleSelectAccount = (acc) => {
    setActiveAccount(acc.email);
    router.push("/me");
  };

  if (view === "init") return null;

  return (
    _jsxs("div", { style: {
        minHeight: "100vh",
        background: "#313338",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        position: "relative"
      }, children: [
      _jsx(Bubbles, {}),

      _jsxs("div", { style: {
          background: "#2b2d31",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          width: "100%",
          maxWidth: 480,
          display: "flex",
          overflow: "hidden",
          position: "relative",
          zIndex: 1
        }, children: [

        _jsx("div", { style: { width: 6, background: "#5865f2", flexShrink: 0 } }),

        _jsxs("div", { style: { flex: 1, padding: "32px 36px" }, children: [
          view === "accounts" &&
          _jsx(AccountsView, {
            onSelect: handleSelectAccount,
            onAdd: () => setView("login") }
          ),

          view === "login" &&
          _jsx(LoginView, {
            onLogin: handleLogin,
            onRegister: () => setView("register"),
            onBack: getAccounts().length > 0 ? () => setView("accounts") : undefined }
          ),

          view === "register" &&
          _jsx(RegisterView, {
            onDone: handleLogin,
            onLogin: () => setView("login") }
          )] }

        )] }
      )] }
    ));

}