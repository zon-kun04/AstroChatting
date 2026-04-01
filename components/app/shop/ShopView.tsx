"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DC, useStore, StoreProvider, resolveUrl, fmt } from "./store";
import { Toast, ProductCard, ProductSkeleton } from "./components";
import { InventoryTab } from "./InventoryTab";
import { HistoryTab } from "./HistoryTab";
import {
  ShoppingBag, Sparkles, Gem, Clock, LayoutGrid, Tag,
  Package, History, Search, Menu } from
"lucide-react";
import { useLayout } from "../layout/AppLayout";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

function ShopContent() {
  const { setMobileMenuOpen } = useLayout();
  const { state, dispatch, purchase } = useStore();
  const { products, loading, activeTab, fullUser } = state;
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const typeMatch = p.type.toLowerCase().includes(search.toLowerCase());

    if (!nameMatch && !typeMatch) return false;

    if (activeTab === "Destacados") return p.featured;
    if (activeTab === "Avatar Decorations") return p.type === "avatar_decoration";
    if (activeTab === "Efectos") return p.type === "entry_effect" || p.type === "profile_effect";
    if (activeTab === "Placas") return p.type === "nameplate";
    return true;
  });


  const shopTabs = [
  { name: "Ver Todo", icon: LayoutGrid },
  { name: "Destacados", icon: Sparkles },
  { name: "Avatar Decorations", icon: Tag },
  { name: "Efectos", icon: Gem },
  { name: "Placas", icon: Clock }];


  const userTabs = [
  { name: "Mi Inventario", icon: Package },
  { name: "Historial", icon: History }];


  const isInventory = ["Mi Inventario", "Historial"].includes(activeTab);

  return (
    _jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: DC.bgBase,
        color: DC.textPrimary,
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
        overflow: "hidden"
      }, children: [
      _jsx(Toast, {}),


      _jsxs("header", { style: {
          height: 64,
          background: DC.bgSidebar,
          borderBottom: `1px solid ${DC.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          zIndex: 100,
          flexShrink: 0
        }, children: [

        _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [

          _jsx("button", {
            onClick: () => setMobileMenuOpen(true),
            className: "md:hidden flex items-center mr-1",
            style: { background: "transparent", border: "none", color: DC.textSecondary, cursor: "pointer" }, children:

            _jsx(Menu, { size: 20 }) }
          ),

          _jsx("div", { style: { background: DC.blurple, padding: 6, borderRadius: 8 }, children:
            _jsx(ShoppingBag, { size: 18, color: "white" }) }
          ),
          _jsx("h1", { style: { fontSize: 13, fontWeight: 900, margin: 0, letterSpacing: "0.05em", color: "white" }, children: "TIENDA VIPER" })] }
        ),


        _jsxs("nav", { style: {
            display: "flex",
            alignItems: "center",
            gap: 20
          }, children: [

          _jsx("div", { style: { display: "flex", background: "rgba(0,0,0,0.15)", padding: 3, borderRadius: 8, gap: 2 }, children:
            shopTabs.map((tab) =>
            _jsxs("button", {

              onClick: () => dispatch({ type: "SET_TAB", payload: tab.name }),
              title: tab.name,
              style: {
                display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 6, border: "none",
                background: activeTab === tab.name ? DC.blurple : "transparent",
                color: activeTab === tab.name ? "white" : DC.textSecondary,
                fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.1s"
              }, children: [

              _jsx(tab.icon, { size: 14 }),
              _jsx("span", { style: { display: "inline" }, children: tab.name })] }, tab.name
            )
            ) }
          ),

          _jsx("div", { style: { width: 1, height: 20, background: DC.border } }),


          _jsx("div", { style: { display: "flex", background: "rgba(0,0,0,0.15)", padding: 3, borderRadius: 8, gap: 2 }, children:
            userTabs.map((tab) =>
            _jsxs("button", {

              onClick: () => dispatch({ type: "SET_TAB", payload: tab.name }),
              style: {
                display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 6, border: "none",
                background: activeTab === tab.name ? DC.blurple : "transparent",
                color: activeTab === tab.name ? "white" : DC.textSecondary,
                fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.1s"
              }, children: [

              _jsx(tab.icon, { size: 14 }),
              _jsx("span", { children: tab.name })] }, tab.name
            )
            ) }
          )] }
        ),


        _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
          _jsxs("div", { style: { textAlign: "right", paddingRight: 10, borderRight: `1px solid ${DC.border}` }, children: [
            _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }, children: [
              _jsx("span", { style: { fontSize: 13, fontWeight: 900, color: DC.yellow }, children: fullUser?.ogrs ? fmt(fullUser.ogrs) : 0 }),
              _jsx(Gem, { size: 14, color: DC.yellow })] }
            ),
            _jsx("p", { style: { fontSize: 9, color: DC.textMuted, margin: 0, fontWeight: 700, textTransform: "uppercase" }, children: "Balance" })] }
          ),
          _jsx("img", {
            src: resolveUrl(fullUser?.avatar) || "https://cdn.discordapp.com/embed/avatars/0.png",
            style: { width: 32, height: 32, borderRadius: "50%", border: `1px solid ${DC.border}` } }
          )] }
        )] }
      ),


      _jsx("main", { style: { flex: 1, overflowY: "auto", padding: "24px" }, className: "custom-scrollbar", children:
        _jsx("div", { style: { maxWidth: 1100, margin: "0 auto" }, children:

          _jsx(AnimatePresence, { mode: "wait", children:
            _jsxs(motion.div, {

              initial: { opacity: 0, x: 10 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -10 },
              transition: { duration: 0.2 }, children: [

              _jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }, children: [
                _jsx("div", { children:
                  _jsx("h2", { style: { fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }, children: activeTab }) }
                ),

                !isInventory &&
                _jsxs("div", { style: { position: "relative" }, children: [
                  _jsx(Search, { size: 14, color: DC.textMuted, style: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" } }),
                  _jsx("input", {
                    type: "text",
                    placeholder: "Buscar...",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    style: {
                      background: DC.bgSidebar, border: `1px solid ${DC.border}`, borderRadius: 6,
                      padding: "6px 12px 6px 30px", color: DC.textPrimary, fontSize: 12, width: 200, outline: "none"
                    } }
                  )] }
                )] }

              ),

              activeTab === "Mi Inventario" ?
              _jsx(InventoryTab, {}) :
              activeTab === "Historial" ?
              _jsx(HistoryTab, {}) :

              _jsx("div", { style: {
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 16
                }, children:
                loading ?
                Array.from({ length: 12 }).map((_, i) => _jsx(ProductSkeleton, {}, i)) :
                filteredProducts.length > 0 ?
                filteredProducts.map((prod) =>
                _jsx(ProductCard, { product: prod, onBuy: () => purchase(prod.id) }, prod.id)
                ) :

                _jsx("div", { style: { gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: DC.textMuted }, children:
                  _jsx("p", { children: "No se encontraron art\xEDculos." }) }
                ) }

              )] }, activeTab

            ) }
          ) }
        ) }
      ),

      _jsx("style", { children: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #313338; border-radius: 3px; }
        
        @media (max-width: 1000px) {
           header nav { gap: 10px; }
           header span { display: none; }
           header button { padding: 6px; }
        }
      ` })] }
    ));

}

export function ShopView() {
  return (
    _jsx(StoreProvider, { children:
      _jsx(ShopContent, {}) }
    ));

}

export default ShopView;