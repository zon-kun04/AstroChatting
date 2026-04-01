"use client";
import { useEffect } from "react";




export function ZoomHandler() {
  useEffect(() => {
    const handleKeydown = (e) => {
      const isModifier = e.ctrlKey || e.metaKey;

      if (isModifier) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          applyZoom(0.1);
        } else if (e.key === "-") {
          e.preventDefault();
          applyZoom(-0.1);
        } else if (e.key === "0") {
          e.preventDefault();
          resetZoom();
        }
      }
    };

    const applyZoom = (delta) => {
      const style = document.body.style;
      let currentZoom = parseFloat(style.zoom || "1");
      let newZoom = currentZoom + delta;
      newZoom = Math.max(0.5, Math.min(2.5, newZoom));
      style.zoom = newZoom.toString();
    };

    const resetZoom = () => {
      document.body.style.zoom = "1";
    };

    window.addEventListener("keydown", handleKeydown);

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        applyZoom(e.deltaY > 0 ? -0.1 : 0.1);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
}