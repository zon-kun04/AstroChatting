



import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Lock } from "lucide-react";
import { DC, useStore } from "./store";
import { ProductCard, GiftModal, ProductSkeleton } from "./components";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export function ExclusiveTab() {
  const { state, purchase } = useStore();
  const [giftProduct, setGiftProduct] = useState(null);
  const exclusives = state.products.filter((p) => p.rarity === "exclusive");

  return (
    _jsxs("div", { children: [

      _jsxs("div", { style: {
          display: "flex", alignItems: "center", gap: 16, marginBottom: 24
        }, children: [
        _jsx("div", { style: { flex: 1, height: 1, background: DC.border } }),
        _jsxs(motion.div, {
          initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 },
          style: {
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 18px", borderRadius: 20,
            background: "rgba(235,69,158,0.08)",
            border: "1px solid rgba(235,69,158,0.25)"
          }, children: [

          _jsx(Gem, { size: 14, color: "#eb459e", strokeWidth: 2 }),
          _jsx("span", { style: { color: "#eb459e", fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em" }, children: "Colecci\xF3n Exclusiva" }

          ),
          _jsx(Lock, { size: 11, color: "rgba(235,69,158,0.6)", strokeWidth: 2.5 })] }
        ),
        _jsx("div", { style: { flex: 1, height: 1, background: DC.border } })] }
      ),


      _jsx("p", { style: {
          color: DC.textMuted, fontSize: 13, textAlign: "center",
          marginBottom: 24, lineHeight: 1.5
        }, children: "\xCDtems de edici\xF3n limitada. Una vez agotados no vuelven al cat\xE1logo." }

      ),

      state.loading ?
      _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }, children:
        Array.from({ length: 6 }).map((_, i) => _jsx(ProductSkeleton, {}, i)) }
      ) :
      exclusives.length === 0 ?
      _jsxs("div", { style: { textAlign: "center", padding: "64px 0" }, children: [
        _jsx(Gem, { size: 36, color: DC.textMuted, style: { margin: "0 auto 12px" } }),
        _jsx("p", { style: { color: DC.textSecondary, fontWeight: 600, marginBottom: 4 }, children: "No hay exclusivos disponibles" }

        ),
        _jsx("p", { style: { color: DC.textMuted, fontSize: 12 }, children: "Vuelve pronto para nuevas colecciones" })] }
      ) :

      _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }, children:
        exclusives.map((p, i) =>
        _jsx(motion.div, {
          initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 },
          transition: { delay: i * 0.05, type: "spring", stiffness: 300, damping: 22 }, children:

          _jsx(ProductCard, {
            product: p,
            onBuy: purchase,
            onGift: (prod) => setGiftProduct(prod),
            hoverSide: i % 4 >= 3 ? "left" : "right" }
          ) }, p.id
        )
        ) }
      ),


      _jsx(AnimatePresence, { children:
        giftProduct && _jsx(GiftModal, { product: giftProduct, onClose: () => setGiftProduct(null) }) }
      )] }
    ));

}