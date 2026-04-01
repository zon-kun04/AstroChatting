"use client";

import { useEffect } from "react";





export function ContextMenuBlocker() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return null;
}