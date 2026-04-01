"use client";
import { useState, createContext, useContext } from "react";

import { cn } from "@/lib/utils";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";


const LayoutContext = createContext({
  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => {}
});

export const useLayout = () => useContext(LayoutContext);






export function AppLayout({ sidebar, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    _jsx(LayoutContext.Provider, { value: { mobileMenuOpen, setMobileMenuOpen }, children:
      _jsxs("div", { className: cn(
          "flex h-screen w-screen overflow-hidden relative",
          "bg-[var(--discord-chat)] transition-all duration-300"
        ), children: [

        _jsx("div", { className: "theme-glass-bg fixed inset-0 -z-10 opacity-0 transition-opacity duration-1000 pointer-events-none" }),


        mobileMenuOpen &&
        _jsx("div", {
          className: "fixed inset-0 z-40 bg-black/60 md:hidden animate-in fade-in duration-200",
          onClick: () => setMobileMenuOpen(false) }
        ),






        _jsx("aside", { className: cn(
            "flex-shrink-0 z-50 transition-transform duration-300 md:translate-x-0 md:static fixed inset-y-0 left-0 w-[280px] max-w-[85vw] md:w-auto md:max-w-none",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          ), children:
          sidebar }
        ),


        _jsx("main", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children:
          children }
        )] }
      ) }
    ));

}