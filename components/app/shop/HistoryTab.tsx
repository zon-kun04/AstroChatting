"use client";


import { Clock, Gem, ShoppingBag } from "lucide-react";
import { DC, useStore, fmt } from "./store";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export function HistoryTab() {
  const { state } = useStore();


  const transactions = state.transactions || [];

  return (
    _jsx("div", { style: { maxWidth: 800 }, children:
      _jsxs("div", { style: { background: DC.bgSidebar, borderRadius: 12, padding: 24, border: `1px solid ${DC.border}` }, children: [
        _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }, children: [
          _jsx(Clock, { size: 24, color: DC.textSecondary }),
          _jsx("h3", { style: { fontSize: 18, fontWeight: 700, margin: 0 }, children: "Historial de Transacciones" })] }
        ),

        _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children:
          transactions.length > 0 ?
          transactions.map((tx) => {
            const isSell = tx.type === 'shop_sell';
            const dateStr = new Date(tx.createdAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

            return (
              _jsxs("div", { style: {
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "12px 16px", background: DC.bgCard, borderRadius: 8,
                  border: `1px solid ${DC.border}`
                }, children: [
                _jsx("div", { style: {
                    width: 36, height: 36, borderRadius: "50%",
                    background: isSell ? "rgba(35,165,90,0.1)" : "rgba(88,101,242,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }, children:
                  isSell ? _jsx(ShoppingBag, { size: 18, color: DC.green }) : _jsx(ShoppingBag, { size: 18, color: DC.blurple }) }
                ),

                _jsxs("div", { style: { flex: 1 }, children: [
                  _jsx("p", { style: { fontSize: 13, fontWeight: 700, margin: 0 }, children: tx.description }),
                  _jsx("p", { style: { fontSize: 11, color: DC.textMuted, margin: "2px 0 0" }, children: dateStr })] }
                ),

                _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                  _jsxs("span", { style: {
                      fontSize: 14, fontWeight: 800,
                      color: isSell ? DC.green : "white"
                    }, children: [
                    isSell ? "+" : "-", fmt(tx.ogrsEarned || tx.ogrsSpent)] }
                  ),
                  _jsx(Gem, { size: 14, color: DC.yellow })] }
                )] }, tx.id
              ));

          }) :

          _jsx("div", { style: { textAlign: "center", padding: "40px 0", color: DC.textMuted }, children:
            _jsx("p", { children: "No tienes transacciones recientes." }) }
          ) }

        )] }
      ) }
    ));

}