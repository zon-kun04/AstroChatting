"use client";

import { useState, useCallback, useEffect } from "react";

import { wsClient } from "@/lib/ws";

















export function useAppState() {
  const [state, setState] = useState({
    activeView: "friends",
    activeChatId: null,
    activeOverlay: null,
    profileUserId: null,
    imagePreviewUrl: null,
    callingUserId: null,
    giftTargetUserId: null,
    sidebarCollapsed: false,
    highlightMessageId: null,
    settingsGroupId: null,
    theme: "default"
  });


  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    if (path === "/me/settings") {
      setState((s) => ({ ...s, activeOverlay: "settings" }));
    } else if (path.startsWith("/me/chat/")) {
      const parts = path.split("/");
      const chatId = parts[parts.length - 1];
      if (chatId) {
        setState((s) => ({ ...s, activeView: "chat", activeChatId: chatId }));
      }
    }
  }, []);


  useEffect(() => {
    if (typeof window === "undefined") return;
    let newPath = "/me";
    if (state.activeOverlay === "settings") {
      newPath = "/me/settings";
    } else if (state.activeView === "chat" && state.activeChatId) {
      newPath = `/me/chat/${state.activeChatId}`;
    } else if (state.activeView === "friends") {
      newPath = "/me";
    }


    if (window.location.pathname !== newPath) {
      window.history.replaceState(null, "", newPath);
    }
  }, [state.activeView, state.activeChatId, state.activeOverlay]);

  const applyThemeToDOM = (theme) => {
    document.documentElement.classList.remove(
      "theme-amoled", "theme-cyberpunk", "theme-glass", "theme-sunset", "theme-ocean",
      "theme-forest", "theme-matrix", "theme-crimson", "theme-nebula", "theme-solar",
      "theme-abyss", "theme-jade", "theme-bubblegum", "theme-lavender", "theme-hacker",
      "theme-dracula", "theme-nord", "theme-monokai", "theme-tokyo", "theme-synthwave",
      "theme-gruvbox", "theme-material", "theme-rose", "theme-catppuccin", "theme-github",
      "theme-obsidian", "theme-cobalt", "theme-vampire", "theme-slime", "theme-coral",
      "theme-quartz", "theme-amber", "theme-electric", "theme-magenta", "theme-sapphire",
      "theme-emerald", "theme-royal", "theme-peach", "theme-olive", "theme-chestnut",
      "theme-light", "theme-pastel-pink", "theme-pastel-blue"
    );
    if (theme !== "default") {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  };


  const getToken = () => {
    try {
      const activeEmail = localStorage.getItem("auth_active_email");
      const accounts = JSON.parse(localStorage.getItem("auth_accounts") || "[]");
      const account = accounts.find((a) => a.email === activeEmail);
      return account?.token ?? null;
    } catch {return null;}
  };


  useEffect(() => {

    const local = localStorage.getItem("app_theme");
    if (local && local !== "default") {
      setState((s) => ({ ...s, theme: local }));
      applyThemeToDOM(local);
    }


    const fetchTheme = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001");
        const res = await fetch(`${BACKEND}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.settings?.theme) {
          const t = data.settings.theme;
          setState((s) => ({ ...s, theme: t }));
          localStorage.setItem("app_theme", t);
          applyThemeToDOM(t);
        }
      } catch {}
    };
    fetchTheme();
  }, []);


  useEffect(() => {
    const handleThemeChange = (data) => {
      if (data?.theme) {
        const t = data.theme;
        setState((s) => ({ ...s, theme: t }));
        localStorage.setItem("app_theme", t);
        applyThemeToDOM(t);
      }
    };
    wsClient.on("settings:theme_changed", handleThemeChange);
    return () => {wsClient.off("settings:theme_changed", handleThemeChange);};
  }, []);

  const setTheme = useCallback(async (theme) => {
    setState((prev) => ({ ...prev, theme }));
    localStorage.setItem("app_theme", theme);
    applyThemeToDOM(theme);


    try {
      const token = getToken();
      if (token) {
        const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001");
        await fetch(`${BACKEND}/api/settings/theme`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ theme })
        });
      }
    } catch {}
  }, []);

  const setActiveView = useCallback((view) => {
    setState((prev) => ({ ...prev, activeView: view, activeChatId: null, highlightMessageId: null }));
  }, []);

  const openChat = useCallback((chatId, messageId = null) => {
    setState((prev) => ({ ...prev, activeView: "chat", activeChatId: chatId, highlightMessageId: messageId }));
  }, []);

  const openOverlay = useCallback((overlay) => {
    setState((prev) => ({ ...prev, activeOverlay: overlay }));
  }, []);

  const closeOverlay = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeOverlay: null,
      profileUserId: null,
      imagePreviewUrl: null,
      callingUserId: null,
      giftTargetUserId: null,
      settingsGroupId: null
    }));
  }, []);

  const openUserProfile = useCallback((userId) => {
    setState((prev) => ({
      ...prev,
      activeOverlay: "user-profile",
      profileUserId: userId
    }));
  }, []);

  const openImagePreview = useCallback((url) => {
    setState((prev) => ({
      ...prev,
      activeOverlay: "image-preview",
      imagePreviewUrl: url
    }));
  }, []);

  const startCall = useCallback((userId) => {
    setState((prev) => ({
      ...prev,
      activeOverlay: "calling",
      callingUserId: userId
    }));
  }, []);

  const openGiftSub = useCallback((userId) => {
    setState((prev) => ({
      ...prev,
      activeOverlay: "gift-sub",
      giftTargetUserId: userId
    }));
  }, []);

  const openGroupSettings = useCallback((groupId) => {
    setState((prev) => ({
      ...prev,
      activeOverlay: "settings",
      settingsGroupId: groupId
    }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  return {
    ...state,
    setActiveView,
    openChat,
    openOverlay,
    closeOverlay,
    openUserProfile,
    openImagePreview,
    startCall,
    openGiftSub,
    openGroupSettings,
    toggleSidebar,
    setTheme
  };
}