



import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Gift, ChevronLeft, ChevronRight, Gem } from "lucide-react";
import { DC, RARITY_META, fmt, useStore } from "./store";
import { ProductCard, GiftModal, RarityBadge, ProductSkeleton } from "./components";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

export function FeaturedTab() {
  const { state, purchase } = useStore();
  const [giftProduct, setGiftProduct] = useState(null);
  const featured = state.products.filter((p) => p.featured);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const advance = useCallback(() => {
    if (featured.length > 0) setIdx((i) => (i + 1) % featured.length);
  }, [featured.length]);

  const prev = useCallback(() => {
    setIdx((i) => i === 0 ? featured.length - 1 : i - 1);
  }, [featured.length]);

  useEffect(() => {
    if (paused || featured.length < 2) return;
    timerRef.current = setInterval(advance, 5000);
    return () => {if (timerRef.current) clearInterval(timerRef.current);};
  }, [advance, paused, featured.length]);


  if (state.loading) return (
    _jsxs("div", { children: [
      _jsx("div", { style: { height: 240, borderRadius: 8, background: DC.bg400, marginBottom: 24 } }),
      _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }, children:
        Array.from({ length: 4 }).map((_, i) => _jsx(ProductSkeleton, {}, i)) }
      )] }
    ));


  if (!featured.length) return (
    _jsxs("div", { style: { textAlign: "center", padding: "64px 0", color: DC.textMuted }, children: [
      _jsx(Gem, { size: 32, color: DC.textMuted, style: { margin: "0 auto 12px" } }),
      _jsx("p", { style: { fontWeight: 600, color: DC.textSecondary }, children: "Sin productos destacados" })] }
    ));


  const p = featured[idx];
  const meta = RARITY_META[p.rarity] ?? RARITY_META.common;

  return (
    _jsxs("div", { children: [

      _jsxs("div", { style: { position: "relative", marginBottom: 6 },
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false), children: [

        _jsx(AnimatePresence, { mode: "wait", children:
          _jsxs(motion.div, {

            initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 },
            transition: { duration: 0.28, ease: "easeInOut" },
            style: {
              position: "relative", borderRadius: 8, overflow: "hidden",
              display: "flex", alignItems: "center", gap: 40, padding: "32px 36px",
              background: meta.gradient,
              border: `1px solid ${meta.color}28`,
              minHeight: 220
            }, children: [


            _jsx(motion.div, {
              animate: { opacity: [0.2, 0.5, 0.2] },
              transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              style: {
                position: "absolute", inset: 0, pointerEvents: "none",
                background: `radial-gradient(ellipse at 25% 50%, ${meta.glow}, transparent 55%)`
              } }
            ),


            _jsx(motion.div, {
              style: { flexShrink: 0, position: "relative", zIndex: 1 },
              whileHover: { scale: 1.06, rotate: -1.5 },
              transition: { type: "spring", stiffness: 300, damping: 18 }, children:

              _jsx("img", {
                src: p.imageUrl || `https://placehold.co/160x160/${DC.bg200.replace("#", "")}/5865f2?text=?`,
                alt: p.name,
                style: { width: 136, height: 136, objectFit: "contain", borderRadius: 12, display: "block" } }
              ) }
            ),


            _jsxs("div", { style: { flex: 1, position: "relative", zIndex: 1, minWidth: 0 }, children: [
              _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }, children: [
                _jsx(RarityBadge, { rarity: p.rarity }),
                p.rarity === "exclusive" &&
                _jsx("span", { style: {
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                    padding: "2px 8px", borderRadius: 4, background: DC.yellowDim,
                    border: `1px solid ${DC.yellow}50`, color: DC.yellow
                  }, children: "LIMITADO" })] }

              ),
              _jsx("h2", { style: {
                  color: DC.textPrimary, fontWeight: 800, fontSize: 26, margin: "0 0 6px",
                  letterSpacing: "-0.02em", lineHeight: 1.1
                }, children: p.name }),
              _jsx("p", { style: { color: DC.textSecondary, fontSize: 13, margin: "0 0 4px", lineHeight: 1.5, maxWidth: 400 }, children:
                p.description }
              ),
              p.rarity === "exclusive" && p.stock !== undefined &&
              _jsxs("p", { style: { color: DC.yellow, fontSize: 12, fontWeight: 600, margin: "4px 0 0" }, children: [
                p.stock, " / ", p.maxStock, " unidades restantes"] }
              ),


              _jsxs("div", { style: { display: "flex", gap: 10, alignItems: "center", marginTop: 20, flexWrap: "wrap" }, children: [

                _jsxs("div", { style: {
                    display: "flex", alignItems: "baseline", gap: 4,
                    padding: "0 14px 0 0", borderRight: `1px solid ${DC.border}`
                  }, children: [
                  _jsx(Gem, { size: 12, color: DC.textMuted }),
                  _jsx("span", { style: { color: DC.textPrimary, fontWeight: 800, fontSize: 18 }, children: fmt(p.price) }),
                  _jsx("span", { style: { color: DC.textMuted, fontSize: 12, fontWeight: 600 }, children: "OGRS" })] }
                ),

                _jsxs(motion.button, {
                  whileTap: { scale: 0.96 }, whileHover: { scale: 1.02 },
                  onClick: () => purchase(p.id),
                  style: {
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 22px", borderRadius: 4, border: "none",
                    background: DC.blurple, color: "white",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(88,101,242,0.35)",
                    fontFamily: "inherit"
                  },
                  onMouseEnter: (e) => e.currentTarget.style.background = DC.blurpleHover,
                  onMouseLeave: (e) => e.currentTarget.style.background = DC.blurple, children: [

                  _jsx(ShoppingBag, { size: 14, strokeWidth: 2.5 }), "Comprar"] }

                ),

                _jsxs(motion.button, {
                  whileTap: { scale: 0.96 }, whileHover: { scale: 1.02 },
                  onClick: () => setGiftProduct(p),
                  style: {
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 16px", borderRadius: 4,
                    border: `1px solid ${DC.border}`,
                    background: "rgba(0,0,0,0.25)",
                    color: DC.textSecondary, fontWeight: 600, fontSize: 13, cursor: "pointer",
                    backdropFilter: "blur(4px)", fontFamily: "inherit"
                  },
                  onMouseEnter: (e) => e.currentTarget.style.color = DC.textPrimary,
                  onMouseLeave: (e) => e.currentTarget.style.color = DC.textSecondary, children: [

                  _jsx(Gift, { size: 14, strokeWidth: 2 }), "Regalar"] }

                )] }
              )] }
            ),


            featured.length > 1 &&
            _jsxs(_Fragment, { children: [
              _jsx("button", { onClick: prev,
                style: {
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  width: 30, height: 30, borderRadius: "50%", border: "none",
                  background: "rgba(0,0,0,0.4)", color: DC.textSecondary,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", zIndex: 2, backdropFilter: "blur(4px)",
                  transition: "background 0.15s, color 0.15s"
                },
                onMouseEnter: (e) => {e.currentTarget.style.background = "rgba(0,0,0,0.65)";e.currentTarget.style.color = DC.textPrimary;},
                onMouseLeave: (e) => {e.currentTarget.style.background = "rgba(0,0,0,0.4)";e.currentTarget.style.color = DC.textSecondary;}, children:

                _jsx(ChevronLeft, { size: 16, strokeWidth: 2.5 }) }
              ),
              _jsx("button", { onClick: advance,
                style: {
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  width: 30, height: 30, borderRadius: "50%", border: "none",
                  background: "rgba(0,0,0,0.4)", color: DC.textSecondary,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", zIndex: 2, backdropFilter: "blur(4px)",
                  transition: "background 0.15s, color 0.15s"
                },
                onMouseEnter: (e) => {e.currentTarget.style.background = "rgba(0,0,0,0.65)";e.currentTarget.style.color = DC.textPrimary;},
                onMouseLeave: (e) => {e.currentTarget.style.background = "rgba(0,0,0,0.4)";e.currentTarget.style.color = DC.textSecondary;}, children:

                _jsx(ChevronRight, { size: 16, strokeWidth: 2.5 }) }
              )] }
            )] }, p.id

          ) }
        ),


        featured.length > 1 &&
        _jsx("div", { style: { display: "flex", justifyContent: "center", gap: 5, marginTop: 10 }, children:
          featured.map((_, i) =>
          _jsx("button", { onClick: () => setIdx(i), style: {
              width: i === idx ? 20 : 5, height: 5, borderRadius: 3, border: "none",
              background: i === idx ? DC.blurple : DC.bg600, padding: 0, cursor: "pointer",
              transition: "width 0.2s, background 0.2s"
            } }, i)
          ) }
        )] }

      ),


      _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, margin: "24px 0 14px" }, children: [
        _jsx("span", { style: { color: DC.textMuted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }, children: "Todos los destacados" }

        ),
        _jsx("div", { style: { flex: 1, height: 1, background: DC.border } })] }
      ),


      _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }, children:
        featured.map((prod, i) =>
        _jsx(ProductCard, {

          product: prod,
          onBuy: purchase,
          onGift: (p) => setGiftProduct(p),
          hoverSide: i % 4 >= 3 ? "left" : "right" }, prod.id
        )
        ) }
      ),

      _jsx(AnimatePresence, { children:
        giftProduct && _jsx(GiftModal, { product: giftProduct, onClose: () => setGiftProduct(null) }) }
      )] }
    ));

}