"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info, Package, Gem } from "lucide-react";
import { DC, RARITY_META, fmt, useStore } from "./store";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";


export function Toast() {
  const { state } = useStore();
  const n = state.notification;
  const cfg = {
    success: { border: DC.green, Icon: CheckCircle },
    error: { border: DC.red, Icon: AlertCircle },
    info: { border: DC.blurple, Icon: Info }
  };
  const s = cfg[n?.type ?? "info"];

  return (
    _jsx(AnimatePresence, { children:
      n &&
      _jsxs(motion.div, {
        initial: { y: -50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -50, opacity: 0 },
        style: {
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          background: DC.bgModal, border: `1px solid ${DC.border}`,
          borderLeft: `4px solid ${s.border}`,
          zIndex: 10000, borderRadius: 6, padding: "8px 16px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
          color: DC.textPrimary, fontSize: 13, fontWeight: 600
        }, children: [

        _jsx(s.Icon, { size: 16, color: s.border }),
        n.msg] }
      ) }

    ));

}


export function ProductCard({ product, onBuy }) {
  const { state } = useStore();
  const meta = RARITY_META[product.rarity] || RARITY_META.common;
  const [buying, setBuying] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const isOwned = state.fullUser?.inventory?.some((i) => i.itemId === product.id);
  const canAfford = (state.fullUser?.ogrs ?? 0) >= product.price;

  const handleBuyClick = (e) => {
    e.stopPropagation();
    if (buying || !canAfford || isOwned) return;
    setConfirm(true);
  };

  const finalizeBuy = async (e) => {
    e.stopPropagation();
    setBuying(true);
    await onBuy();
    setBuying(false);
    setConfirm(false);
  };

  return (
    _jsxs(motion.div, {
      whileHover: { y: isOwned ? 0 : -2 },
      style: {
        background: DC.bgCard,
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${confirm ? DC.blurple : DC.border}`,
        position: "relative",
        opacity: isOwned ? 0.7 : 1,
        transition: "border-color 0.2s"
      }, children: [


      _jsxs("div", { style: {
          height: 120,
          background: `radial-gradient(circle at 50% 50%, ${meta.glow}, transparent 80%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }, children: [
        _jsx(AnimatePresence, { children:
          confirm &&
          _jsxs(motion.div, {
            initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 },
            style: {
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)",
              zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 10
            }, children: [

            _jsxs("p", { style: { fontSize: 11, fontWeight: 800, margin: 0, textAlign: "center" }, children: ["\xBFConfirmar compra por ", fmt(product.price), " Ogrs?"] }),
            _jsxs("div", { style: { display: "flex", gap: 6, width: "100%" }, children: [
              _jsx("button", {
                onClick: finalizeBuy,
                style: { flex: 1, padding: "6px", borderRadius: 4, background: DC.blurple, border: "none", color: "white", fontSize: 10, fontWeight: 800, cursor: "pointer" }, children:
                "S\xCD" }

              ),
              _jsx("button", {
                onClick: (e) => {e.stopPropagation();setConfirm(false);},
                style: { flex: 1, padding: "6px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: 10, fontWeight: 800, cursor: "pointer" }, children:
                "NO" }

              )] }
            )] }
          ) }

        ),

        isOwned &&
        _jsx("div", { style: {
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10
          }, children:
          _jsx("div", { style: { background: DC.bgSidebar, padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800, color: DC.textSecondary, border: `1px solid ${DC.border}` }, children: "ADQUIRIDO" }

          ) }
        ),


        _jsx("div", { style: {
            position: "absolute", top: 8, left: 8,
            fontSize: 9, fontWeight: 900, textTransform: "uppercase",
            color: meta.color, background: "rgba(0,0,0,0.4)",
            padding: "2px 5px", borderRadius: 4, zIndex: 5
          }, children:
          meta.label }
        ),

        product.imageUrl ?
        _jsx("img", {
          src: product.imageUrl,
          alt: product.name,
          style: { width: "100%", height: "100%", objectFit: "contain", padding: 15 } }
        ) :

        _jsx(Package, { size: 32, color: DC.textMuted })] }

      ),


      _jsxs("div", { style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }, children: [
        _jsx("h3", { style: { fontSize: 14, fontWeight: 700, margin: 0, color: DC.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: product.name }),

        _jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 3 }, children: [
            _jsx(Gem, { size: 12, color: DC.yellow }),
            _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: "white" }, children: fmt(product.price) })] }
          ),

          _jsx("button", {
            onClick: handleBuyClick,
            disabled: buying || !canAfford || isOwned || confirm,
            style: {
              padding: "5px 12px",
              borderRadius: 6,
              background: isOwned ? "transparent" : canAfford ? DC.blurple : "rgba(255,255,255,0.05)",
              color: isOwned ? DC.textMuted : canAfford ? "white" : DC.textMuted,
              fontSize: 11,
              fontWeight: 800,
              cursor: buying || !canAfford || isOwned || confirm ? "default" : "pointer",
              transition: "all 0.1s",
              border: isOwned ? `1px solid ${DC.border}` : "none"
            }, children:

            isOwned ? "En propiedad" : buying ? "..." : canAfford ? "Comprar" : "Sin Ogrs" }
          )] }
        )] }
      )] }
    ));

}


export function ProductSkeleton() {
  return (
    _jsxs("div", { style: { background: DC.bgCard, borderRadius: 10, height: 180, border: `1px solid ${DC.border}`, overflow: "hidden" }, children: [
      _jsx("div", { style: { height: 120, background: "rgba(255,255,255,0.03)" } }),
      _jsxs("div", { style: { padding: 12 }, children: [
        _jsx("div", { style: { height: 12, background: "rgba(255,255,255,0.02)", borderRadius: 3, width: "60%", marginBottom: 12 } }),
        _jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
          _jsx("div", { style: { height: 16, background: "rgba(255,255,255,0.02)", borderRadius: 3, width: 40 } }),
          _jsx("div", { style: { height: 20, background: "rgba(255,255,255,0.02)", borderRadius: 3, width: 60 } })] }
        )] }
      )] }
    ));

}