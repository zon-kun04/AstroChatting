"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package } from
"lucide-react";
import { DC, RARITY_META, resolveUrl, useStore } from "./store";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

const CATEGORY_MAP = {
  avatar_decoration: "Decoración de Avatar",
  nameplate: "Placa de Nombre",
  entry_effect: "Efecto de Entrada",
  profile_effect: "Efecto de Perfil"
};

function ProfilePreview({ selectedItem }) {
  const { state } = useStore();
  const { fullUser } = state;

  const avatarUrl = resolveUrl(fullUser?.avatar) || "https://cdn.discordapp.com/embed/avatars/0.png";
  const bannerUrl = resolveUrl(fullUser?.banner);
  const displayName = fullUser?.displayName || fullUser?.username || "Usuario";


  const previewDecoration = selectedItem?.category === "avatar_decoration" ? resolveUrl(selectedItem.itemId ? `/uploads/decorations/${selectedItem.itemId.replace("avatar_", "")}.gif` : null) : resolveUrl(fullUser?.decorations?.avatarDecoration);
  const previewNameplate = selectedItem?.category === "nameplate" ? resolveUrl(fullUser?.decorations?.nameplate) : resolveUrl(fullUser?.decorations?.nameplate);

  return (
    _jsxs("div", { style: {
        background: DC.bgSidebar, borderRadius: 8, overflow: "hidden",
        width: 300, border: `1px solid ${DC.border}`, position: "sticky", top: 0
      }, children: [
      _jsx("div", { style: { height: 60, background: bannerUrl ? `url(${bannerUrl}) center/cover` : DC.blurple } }),
      _jsxs("div", { style: { padding: "0 16px 16px", position: "relative" }, children: [
        _jsxs("div", { style: { position: "relative", width: 80, height: 80, marginTop: -40, marginBottom: 12 }, children: [
          _jsx("img", { src: avatarUrl, style: { width: "100%", height: "100%", borderRadius: "50%", border: `6px solid ${DC.bgSidebar}`, background: DC.bgBase } }),
          previewDecoration &&
          _jsx("img", { src: previewDecoration, style: { position: "absolute", inset: -8, width: "calc(100% + 16px)", height: "calc(100% + 16px)", objectFit: "contain" } })] }

        ),
        _jsx("h3", { style: { fontSize: 18, fontWeight: 700, margin: 0 }, children: displayName }),
        _jsxs("p", { style: { fontSize: 13, color: DC.textSecondary, margin: "2px 0 12px" }, children: ["@", fullUser?.username] }),

        fullUser?.bio && _jsx("p", { style: { fontSize: 12, borderTop: `1px solid ${DC.border}`, paddingTop: 12 }, children: fullUser.bio })] }
      )] }
    ));

}

export function InventoryTab() {
  const { state, equipItem } = useStore();
  const { fullUser } = state;
  const [selected, setSelected] = useState(null);

  const inventory = fullUser?.inventory || [];

  if (inventory.length === 0) {
    return (
      _jsxs("div", { style: { textAlign: "center", padding: "100px 0", color: DC.textMuted }, children: [
        _jsx(Package, { size: 48, style: { marginBottom: 16, opacity: 0.2 } }),
        _jsx("p", { children: "Tu inventario est\xE1 vac\xEDo." })] }
      ));

  }

  return (
    _jsxs("div", { style: { display: "flex", gap: 32, alignItems: "start" }, children: [
      _jsx("div", { style: { flex: 1 }, children:
        _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }, children:
          inventory.map((item) => {
            const meta = RARITY_META[item.rarity] || RARITY_META.common;
            const isSelected = selected?.itemId === item.itemId;

            return (
              _jsxs(motion.div, {

                whileHover: { scale: 1.02 },
                onClick: () => setSelected(item),
                style: {
                  background: DC.bgCard,
                  borderRadius: 8,
                  border: `1px solid ${isSelected ? DC.blurple : DC.border}`,
                  padding: 12,
                  cursor: "pointer",
                  position: "relative"
                }, children: [

                _jsx("div", { style: { height: 100, background: `radial-gradient(circle, ${meta.glow}, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, borderRadius: 4, overflow: "hidden" }, children:
                  item.imageUrl ?
                  item.imageUrl.endsWith(".webm") ?
                  _jsx("video", { src: resolveUrl(item.imageUrl), autoPlay: true, loop: true, muted: true, playsInline: true, style: { maxWidth: "80%", maxHeight: "80%" } }) :

                  _jsx("img", { src: resolveUrl(item.imageUrl), style: { maxWidth: "80%", maxHeight: "80%", objectFit: "contain" } }) :


                  _jsx(Package, { size: 32, color: meta.color }) }

                ),
                _jsx("h4", { style: { fontSize: 14, fontWeight: 600, margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: item.name }),
                _jsx("p", { style: { fontSize: 11, color: DC.textSecondary, margin: "0 0 12px" }, children: CATEGORY_MAP[item.category] || item.category }),

                _jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                  _jsx("button", {
                    onClick: (e) => {e.stopPropagation();equipItem(item.itemId, !item.equipped);},
                    style: {
                      flex: 1, padding: "6px", borderRadius: 4, border: "none",
                      background: item.equipped ? DC.red : DC.blurple,
                      color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }, children:

                    item.equipped ? "Desequipar" : "Equipar" }
                  ),
                  _jsx(SellButton, { itemId: item.itemId })] }
                )] }, item.itemId
              ));

          }) }
        ) }
      ),

      _jsx(ProfilePreview, { selectedItem: selected })] }
    ));

}

function SellButton({ itemId }) {
  const { sellItem } = useStore();
  const [confirm, setConfirm] = useState(false);

  const handleSell = async (e) => {
    e.stopPropagation();
    await sellItem(itemId);
    setConfirm(false);
  };

  return (
    _jsxs("div", { style: { position: "relative" }, children: [
      _jsx("button", {
        onClick: (e) => {e.stopPropagation();setConfirm(true);},
        style: {
          padding: "6px 10px", borderRadius: 4, border: `1px solid ${DC.border}`,
          background: "rgba(255,255,255,0.05)", color: DC.textMuted,
          fontSize: 12, fontWeight: 700, cursor: "pointer"
        },
        onMouseEnter: (e) => e.currentTarget.style.color = DC.red,
        onMouseLeave: (e) => e.currentTarget.style.color = DC.textMuted, children:
        "Vender" }

      ),

      _jsx(AnimatePresence, { children:
        confirm &&
        _jsxs(motion.div, {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          style: {
            position: "absolute", bottom: "120%", right: 0, width: 160,
            background: DC.bgModal, border: `1px solid ${DC.red}`,
            borderRadius: 8, padding: 10, zIndex: 100,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
          }, children: [

          _jsx("p", { style: { fontSize: 10, fontWeight: 700, margin: "0 0 8px", textAlign: "center", color: DC.textPrimary }, children: "\xBFVender por el 60% de su valor?" }

          ),
          _jsxs("div", { style: { display: "flex", gap: 6 }, children: [
            _jsx("button", {
              onClick: handleSell,
              style: { flex: 1, padding: "4px", borderRadius: 4, background: DC.red, border: "none", color: "white", fontSize: 10, fontWeight: 800, cursor: "pointer" }, children:
              "S\xCD" }

            ),
            _jsx("button", {
              onClick: (e) => {e.stopPropagation();setConfirm(false);},
              style: { flex: 1, padding: "4px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: 10, fontWeight: 800, cursor: "pointer" }, children:
              "NO" }

            )] }
          )] }
        ) }

      )] }
    ));

}