



import { motion } from "framer-motion";
import {
  Star, Compass, Gem, History,
  ShoppingCart, Wallet, ChevronDown, Package } from
"lucide-react";
import { DC, TABS, fmt, useStore } from "./store";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

const TAB_ICONS = {
  "Destacadas": Star,
  "Explorar": Compass,
  "Exclusivo": Gem,
  "Inventario": Package,
  "Historial": History
};

export function Navbar() {
  const { state, dispatch, reloadOGRS } = useStore();
  const { user, cart, activeTab } = state;

  return (
    _jsx("header", { style: {
        position: "sticky", top: 0, zIndex: 50,
        background: DC.bg200,
        borderBottom: `1px solid ${DC.border}`
      }, children:
      _jsxs("div", { style: {
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", gap: 12,
          padding: "0 20px", height: 52
        }, children: [

        _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginRight: 4, flexShrink: 0 }, children: [
          _jsx("div", { style: {
              width: 26, height: 26, borderRadius: 6,
              background: DC.blurple,
              display: "flex", alignItems: "center", justifyContent: "center"
            }, children:
            _jsx(Gem, { size: 13, color: "white", strokeWidth: 2.5 }) }
          ),
          _jsx("span", { style: {
              color: DC.textPrimary, fontWeight: 800, fontSize: 15,
              letterSpacing: "-0.02em"
            }, children: "Tienda" })] }
        ),


        _jsx("div", { style: { width: 1, height: 20, background: DC.border, flexShrink: 0 } }),


        _jsx("nav", { style: {
            display: "flex", gap: 2, flex: 1,
            background: DC.bg300, borderRadius: 6, padding: 3,
            maxWidth: 520
          }, children:
          TABS.map((tab) => {
            const Icon = TAB_ICONS[tab] ?? Star;
            const active = activeTab === tab;
            return (
              _jsxs("button", {

                onClick: () => dispatch({ type: "SET_TAB", payload: tab }),
                style: {
                  position: "relative", flex: 1, padding: "5px 0", borderRadius: 4, border: "none",
                  background: "transparent",
                  color: active ? DC.textPrimary : DC.textMuted,
                  fontWeight: 600, fontSize: 12, cursor: "pointer",
                  transition: "color 0.15s", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  whiteSpace: "nowrap"
                },
                onMouseEnter: (e) => !active && (e.currentTarget.style.color = DC.textSecondary),
                onMouseLeave: (e) => !active && (e.currentTarget.style.color = DC.textMuted), children: [

                active &&
                _jsx(motion.div, {
                  layoutId: "tab-bg",
                  style: { position: "absolute", inset: 0, borderRadius: 4, background: DC.bg500 },
                  transition: { type: "spring", stiffness: 500, damping: 35 } }
                ),

                _jsxs("span", { style: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 4 }, children: [
                  _jsx(Icon, { size: 11, strokeWidth: active ? 2.5 : 2, color: active ? DC.textPrimary : DC.textMuted }),
                  tab] }
                )] }, tab
              ));

          }) }
        ),


        _jsx("div", { style: { display: "flex", alignItems: "center", gap: 7, marginLeft: "auto" }, children:
          user ?
          _jsxs(_Fragment, { children: [

            _jsxs("button", {
              onClick: reloadOGRS,
              style: {
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 11px", borderRadius: 4, border: `1px solid ${DC.border}`,
                background: DC.bg300, color: DC.textSecondary,
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                transition: "background 0.15s", fontFamily: "inherit"
              },
              onMouseEnter: (e) => e.currentTarget.style.background = DC.bg400,
              onMouseLeave: (e) => e.currentTarget.style.background = DC.bg300,
              title: "Recargar OGRS (simulado)", children: [

              _jsx(Wallet, { size: 12, strokeWidth: 2, color: DC.textMuted }),
              _jsxs("span", { style: { display: "flex", alignItems: "baseline", gap: 3 }, children: [
                _jsx("span", { children: fmt(user.ogrs) }),
                _jsx("span", { style: { color: DC.textMuted, fontSize: 10 }, children: "OGRS" })] }
              )] }
            ),


            _jsxs("div", { style: { position: "relative" }, children: [
              _jsx("button", { style: {
                  width: 34, height: 34, borderRadius: 4, border: "none",
                  background: DC.bg300, color: DC.textSecondary,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "background 0.15s"
                },
                onMouseEnter: (e) => e.currentTarget.style.background = DC.bg400,
                onMouseLeave: (e) => e.currentTarget.style.background = DC.bg300, children:

                _jsx(ShoppingCart, { size: 15, strokeWidth: 2 }) }
              ),
              cart.length > 0 &&
              _jsx("span", { style: {
                  position: "absolute", top: -4, right: -4,
                  width: 16, height: 16, borderRadius: "50%",
                  background: DC.red, color: "white", fontSize: 9, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `2px solid ${DC.bg200}`
                }, children: cart.length })] }

            ),


            _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }, children: [
              _jsx("img", {
                src: user.avatar || "https://cdn.discordapp.com/embed/avatars/0.png",
                alt: "avatar",
                style: { width: 28, height: 28, borderRadius: "50%", border: `2px solid ${DC.blurple}` } }
              ),
              _jsx(ChevronDown, { size: 12, color: DC.textMuted, strokeWidth: 2.5 })] }
            )] }
          ) :

          _jsx("div", { style: { width: 28, height: 28, borderRadius: "50%", background: DC.bg400 } }) }

        )] }
      ) }
    ));

}