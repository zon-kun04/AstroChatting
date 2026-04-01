



import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, LayoutGrid } from "lucide-react";
import { DC, RARITY_META, fmt, useStore, useFilteredProducts, SUBCATS } from "./store";
import { ProductCard, GiftModal, ProductSkeleton } from "./components";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";


const SORTS = ["popular", "price_asc", "price_desc", "newest"];
const SORT_LABELS = {
  popular: "Más popular", price_asc: "Precio ↑", price_desc: "Precio ↓", newest: "Más reciente"
};
const RARITIES = ["common", "uncommon", "rare", "epic", "legendary", "exclusive"];


function FilterPanel() {
  const { state, dispatch } = useStore();
  const { filters } = state;

  const toggleRarity = (r) => {
    const next = filters.rarity.includes(r) ?
    filters.rarity.filter((x) => x !== r) :
    [...filters.rarity, r];
    dispatch({ type: "SET_FILTERS", payload: { rarity: next } });
  };

  const hasActive = filters.subcat !== "Todos" || filters.rarity.length > 0 ||
  filters.maxPrice < 99999 || filters.onlyExclusive;

  const sectionLabel = {
    display: "block", color: DC.textMuted, fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6
  };

  return (
    _jsxs(motion.div, {
      initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 },
      style: {
        background: DC.bg300, border: `1px solid ${DC.border}`,
        borderRadius: 8, padding: 14, marginBottom: 14
      }, children: [


      _jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }, children: [

        _jsxs("div", { children: [
          _jsx("label", { style: sectionLabel, children: "Categor\xEDa" }),
          _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 5 }, children:
            SUBCATS.map((s) =>
            _jsx("button", { onClick: () => dispatch({ type: "SET_FILTERS", payload: { subcat: s } }),
              style: {
                padding: "4px 10px", borderRadius: 4, border: "none", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                background: filters.subcat === s ? DC.blurple : DC.bg500,
                color: filters.subcat === s ? "white" : DC.textSecondary,
                transition: "background 0.15s, color 0.15s"
              },
              onMouseEnter: (e) => filters.subcat !== s && (e.currentTarget.style.background = DC.bg600),
              onMouseLeave: (e) => filters.subcat !== s && (e.currentTarget.style.background = DC.bg500), children:
              s }, s)
            ) }
          )] }
        ),


        _jsxs("div", { children: [
          _jsx("label", { style: sectionLabel, children: "Rareza" }),
          _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 5 }, children:
            RARITIES.map((r) => {
              const meta = RARITY_META[r];
              const active = filters.rarity.includes(r);
              return (
                _jsx("button", { onClick: () => toggleRarity(r),
                  style: {
                    padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                    border: `1px solid ${active ? meta.color + "50" : "transparent"}`,
                    background: active ? `${meta.color}16` : DC.bg500,
                    color: active ? meta.color : DC.textSecondary,
                    transition: "all 0.15s"
                  }, children:
                  meta.label }, r));

            }) }
          )] }
        ),


        _jsxs("div", { children: [
          _jsx("label", { style: sectionLabel, children: "Precio m\xE1x." }),
          _jsx("input", {
            type: "range", min: 0, max: 50000, step: 500,
            value: filters.maxPrice,
            onChange: (e) => dispatch({ type: "SET_FILTERS", payload: { maxPrice: +e.target.value } }),
            style: { accentColor: DC.blurple, width: 120, display: "block", cursor: "pointer" } }
          ),
          _jsxs("span", { style: { color: DC.textSecondary, fontSize: 11, fontWeight: 700 }, children: [fmt(filters.maxPrice), " OGRS"] })] }
        ),


        _jsxs("div", { children: [
          _jsx("label", { style: sectionLabel, children: "Ordenar" }),
          _jsx("select", { value: filters.sort,
            onChange: (e) => dispatch({ type: "SET_FILTERS", payload: { sort: e.target.value } }),
            style: {
              padding: "5px 10px", borderRadius: 4, border: `1px solid ${DC.border}`,
              background: DC.bg500, color: DC.textSecondary,
              fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none", fontFamily: "inherit"
            }, children:

            SORTS.map((s) => _jsx("option", { value: s, children: SORT_LABELS[s] }, s)) }
          )] }
        ),


        _jsxs("div", { children: [
          _jsx("label", { style: sectionLabel, children: "Tipo" }),
          _jsx("button", {
            onClick: () => dispatch({ type: "SET_FILTERS", payload: { onlyExclusive: !filters.onlyExclusive } }),
            style: {
              padding: "4px 10px", borderRadius: 4, fontFamily: "inherit",
              border: `1px solid ${filters.onlyExclusive ? DC.yellow + "50" : "transparent"}`,
              background: filters.onlyExclusive ? DC.yellowDim : DC.bg500,
              color: filters.onlyExclusive ? DC.yellow : DC.textSecondary,
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
            }, children:
            "Solo exclusivos" })] }
        )] }
      ),


      _jsx(AnimatePresence, { children:
        hasActive &&
        _jsxs(motion.div, {
          initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 },
          style: { display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12, alignItems: "center" }, children: [

          filters.subcat !== "Todos" &&
          _jsx(Chip, { label: filters.subcat, onRemove: () => dispatch({ type: "SET_FILTERS", payload: { subcat: "Todos" } }) }),

          filters.rarity.map((r) =>
          _jsx(Chip, { label: RARITY_META[r]?.label ?? r, color: RARITY_META[r]?.color,
            onRemove: () => toggleRarity(r) }, r)
          ),
          filters.maxPrice < 99999 &&
          _jsx(Chip, { label: `≤ ${fmt(filters.maxPrice)} OGRS`,
            onRemove: () => dispatch({ type: "SET_FILTERS", payload: { maxPrice: 99999 } }) }),

          filters.onlyExclusive &&
          _jsx(Chip, { label: "Solo exclusivos", color: DC.yellow,
            onRemove: () => dispatch({ type: "SET_FILTERS", payload: { onlyExclusive: false } }) }),

          _jsxs("button", {
            onClick: () => dispatch({ type: "RESET_FILTERS" }),
            style: {
              background: "none", border: "none", cursor: "pointer",
              color: DC.red, fontSize: 11, fontWeight: 700, padding: "2px 4px",
              display: "flex", alignItems: "center", gap: 3, fontFamily: "inherit"
            }, children: [

            _jsx(X, { size: 11, strokeWidth: 2.5 }), "Borrar todo"] }
          )] }
        ) }

      )] }
    ));

}

function Chip({ label, color, onRemove }) {
  return (
    _jsxs(motion.span, {
      initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 },
      style: {
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 7px", borderRadius: 4, fontSize: 11, fontWeight: 600,
        background: color ? `${color}16` : DC.bg500,
        color: color || DC.textSecondary,
        border: `1px solid ${color ? color + "38" : DC.border}`
      }, children: [

      label,
      _jsx("button", { onClick: onRemove, style: {
          background: "none", border: "none", cursor: "pointer",
          color: "inherit", padding: 0, lineHeight: 1,
          display: "flex", alignItems: "center", opacity: 0.65
        }, children:
        _jsx(X, { size: 10, strokeWidth: 3 }) }
      )] }
    ));

}


export function ExploreTab() {
  const { state, purchase, dispatch } = useStore();
  const [giftProduct, setGiftProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const filtered = useFilteredProducts();

  useEffect(() => {
    dispatch({ type: "SET_FILTERS", payload: { search } });
  }, [search]);

  const totalCols = "repeat(auto-fill, minmax(180px, 1fr))";

  return (
    _jsxs("div", { children: [

      _jsxs("div", { style: { display: "flex", gap: 8, marginBottom: 10 }, children: [
        _jsxs("div", { style: { position: "relative", flex: 1 }, children: [
          _jsx(Search, { size: 14, color: DC.textMuted, style: {
              position: "absolute", left: 11, top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none"
            } }),
          _jsx("input", {
            value: search, onChange: (e) => setSearch(e.target.value),
            placeholder: "Buscar en la tienda...",
            style: {
              width: "100%", padding: "9px 12px 9px 32px", borderRadius: 6,
              background: DC.bg300, color: DC.textPrimary, border: `1px solid ${DC.border}`,
              outline: "none", fontSize: 13, boxSizing: "border-box",
              transition: "border-color 0.15s", fontFamily: "inherit"
            },
            onFocus: (e) => e.currentTarget.style.borderColor = DC.blurple,
            onBlur: (e) => e.currentTarget.style.borderColor = DC.border }
          ),
          search &&
          _jsx("button", { onClick: () => setSearch(""), style: {
              position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: DC.textMuted,
              display: "flex", padding: 2
            }, children:
            _jsx(X, { size: 13, strokeWidth: 2.5 }) }
          )] }

        ),


        _jsxs("button", {
          onClick: () => setShowFilters((f) => !f),
          style: {
            padding: "9px 14px", borderRadius: 6, border: `1px solid ${showFilters ? DC.blurple + "60" : DC.border}`,
            background: showFilters ? DC.blurpleDim : DC.bg300, color: showFilters ? DC.blurple : DC.textSecondary,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s"
          }, children: [

          _jsx(SlidersHorizontal, { size: 14, strokeWidth: 2 }), "Filtros"] }

        )] }
      ),


      _jsx(AnimatePresence, { children:
        showFilters && _jsx(FilterPanel, {}) }
      ),


      _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }, children: [
        _jsx(LayoutGrid, { size: 13, color: DC.textMuted, strokeWidth: 2 }),
        _jsxs("span", { style: { color: DC.textMuted, fontSize: 12, fontWeight: 600 }, children: [
          filtered.length, " resultado", filtered.length !== 1 ? "s" : ""] }
        )] }
      ),


      state.loading ?
      _jsx("div", { style: { display: "grid", gridTemplateColumns: totalCols, gap: 12 }, children:
        Array.from({ length: 8 }).map((_, i) => _jsx(ProductSkeleton, {}, i)) }
      ) :
      filtered.length === 0 ?
      _jsxs("div", { style: { textAlign: "center", padding: "64px 0" }, children: [
        _jsx(Search, { size: 36, color: DC.textMuted, style: { margin: "0 auto 12px" } }),
        _jsx("p", { style: { color: DC.textSecondary, fontWeight: 600, marginBottom: 8 }, children: "Sin resultados" }),
        _jsx("button", { onClick: () => {dispatch({ type: "RESET_FILTERS" });setSearch("");},
          style: {
            background: "none", border: "none", cursor: "pointer",
            color: DC.blurple, fontSize: 13, fontWeight: 600, fontFamily: "inherit"
          }, children:
          "Borrar filtros" })] }
      ) :

      _jsx("div", { style: { display: "grid", gridTemplateColumns: totalCols, gap: 12 }, children:
        filtered.map((p, i) =>
        _jsx(ProductCard, { product: p, onBuy: purchase, onGift: (prod) => setGiftProduct(prod),
          hoverSide: i % 4 >= 3 ? "left" : "right" }, p.id
        )
        ) }
      ),


      _jsx(AnimatePresence, { children:
        giftProduct && _jsx(GiftModal, { product: giftProduct, onClose: () => setGiftProduct(null) }) }
      )] }
    ));

}