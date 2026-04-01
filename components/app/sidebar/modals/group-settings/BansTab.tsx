"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ShieldOff, Loader2, Search, X, UserX, Clock, Check, User } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/components/app/chat/hooks";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";





export function BansTab({ groupId }) {
  const [loading, setLoading] = useState(true);
  const [bans, setBans] = useState([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [unbanning, setUnbanning] = useState(null);

  useEffect(() => {setMounted(true);}, []);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/groups/${groupId}/bans`);
      setBans(res.bans);
    } catch (e) {
      toast.error("Error al cargar los baneos");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {load();}, [load]);

  const handleUnban = async (userId) => {
    setUnbanning(userId);
    try {
      await api.delete(`/groups/${groupId}/bans/${userId}`);
      setBans((prev) => prev.filter((b) => b.userId !== userId));
      toast.success("Usuario desbaneado");
    } catch (e) {
      toast.error(e.message || "Error al desbanear");
    } finally {
      setUnbanning(null);
      setConfirm(null);
    }
  };

  const filtered = bans.filter((b) =>
  !search.trim() || b.userName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    _jsx("div", { className: "flex h-40 items-center justify-center", children:
      _jsx(Loader2, { className: "h-6 w-6 animate-spin text-[var(--discord-blurple)]" }) }
    ));


  return (
    _jsxs(_Fragment, { children: [
      _jsxs("div", { className: "space-y-6 animate-in slide-in-from-right-4 duration-300", children: [
        _jsxs("div", { children: [
          _jsx("h2", { className: "text-xl font-bold text-white", children: "Usuarios Baneados" }),
          _jsx("p", { className: "text-sm text-[var(--muted-foreground)]", children: "Los usuarios baneados no pueden unirse al grupo ni usar invitaciones." }

          )] }
        ),


        _jsxs("div", { className: "relative", children: [
          _jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" }),
          _jsx("input", {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Buscar usuario baneado...",
            className: "w-full bg-[#1e1f22] border border-white/5 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:ring-1 focus:ring-[var(--discord-blurple)] outline-none" }
          ),
          search &&
          _jsx("button", { onClick: () => setSearch(""), className: "absolute right-3 top-1/2 -translate-y-1/2", children:
            _jsx(X, { className: "h-3.5 w-3.5 text-[var(--muted-foreground)]" }) }
          )] }

        ),


        _jsx("div", { className: "space-y-2", children:
          filtered.length > 0 ? filtered.map((ban) =>
          _jsxs("div", {

            className: "flex items-center gap-4 rounded-xl bg-[#2b2d31] border border-white/5 p-4 group hover:bg-white/[0.02] transition-colors", children: [


            _jsxs("div", { className: "relative h-10 w-10 flex-shrink-0", children: [
              ban.userAvatar ?
              _jsx("img", { src: assetUrl(ban.userAvatar), className: "h-full w-full rounded-full object-cover" }) :

              _jsx("div", { className: "h-full w-full rounded-full bg-red-900/30 flex items-center justify-center text-red-400 font-bold", children:
                ban.userName[0]?.toUpperCase() }
              ),

              _jsx("div", { className: "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center", children:
                _jsx(UserX, { className: "h-2.5 w-2.5 text-white" }) }
              )] }
            ),


            _jsxs("div", { className: "flex-1 min-w-0", children: [
              _jsx("p", { className: "font-semibold text-white text-sm truncate", children: ban.userName }),
              _jsxs("div", { className: "flex items-center gap-3 text-xs text-[var(--muted-foreground)] mt-0.5", children: [
                ban.reason &&
                _jsxs("span", { className: "flex items-center gap-1 truncate", children: [
                  _jsx(User, { className: "h-3 w-3 flex-shrink-0" }),
                  ban.reason] }
                ),

                _jsxs("span", { className: "flex items-center gap-1 flex-shrink-0", children: [
                  _jsx(Clock, { className: "h-3 w-3" }),
                  new Date(ban.bannedAt).toLocaleDateString()] }
                )] }
              )] }
            ),


            _jsxs("button", {
              onClick: () => setConfirm({ userId: ban.userId, userName: ban.userName }),
              disabled: unbanning === ban.userId,
              className: cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                "bg-[#23a55a]/10 text-[#23a55a] hover:bg-[#23a55a]/20 opacity-0 group-hover:opacity-100"
              ), children: [

              unbanning === ban.userId ? _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : _jsx(ShieldOff, { className: "h-3.5 w-3.5" }), "Desbanear"] }

            )] }, ban.userId
          )
          ) :
          _jsxs("div", { className: "flex flex-col items-center justify-center py-20 rounded-xl border-2 border-dashed border-white/5 text-center", children: [
            _jsx("div", { className: "h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4", children:
              _jsx(ShieldOff, { className: "h-8 w-8 text-[var(--muted-foreground)] opacity-20" }) }
            ),
            _jsx("p", { className: "text-sm font-semibold text-white", children:
              search ? "No se encontraron resultados" : "No hay usuarios baneados" }
            ),
            _jsx("p", { className: "text-xs text-[var(--muted-foreground)] mt-1 max-w-[240px]", children:
              search ? "Intenta con otro nombre." : "Cuando banees a alguien, aparecerá aquí." }
            )] }
          ) }

        )] }
      ),


      confirm && mounted && createPortal(
        _jsx("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200", children:
          _jsxs("div", { className: "bg-[#313338] w-full max-w-sm rounded-xl shadow-2xl border border-white/5 p-6 animate-in zoom-in-95 duration-200", children: [
            _jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              _jsx("div", { className: "p-2.5 rounded-xl bg-[#23a55a]/10 text-[#23a55a]", children:
                _jsx(ShieldOff, { className: "h-5 w-5" }) }
              ),
              _jsxs("h3", { className: "text-lg font-bold text-white", children: ["\xBFDesbanear a ", confirm.userName, "?"] })] }
            ),
            _jsx("p", { className: "text-sm text-[#dbdee1] leading-relaxed mb-6", children: "Este usuario podr\xE1 volver a unirse al grupo usando una invitaci\xF3n. Podr\xE1s volver a banearle si es necesario." }

            ),
            _jsxs("div", { className: "flex items-center justify-end gap-3", children: [
              _jsx("button", { onClick: () => setConfirm(null), className: "px-4 py-2 text-sm font-medium text-white hover:underline", children: "Cancelar" }

              ),
              _jsxs("button", {
                onClick: () => handleUnban(confirm.userId),
                className: "bg-[#23a55a] hover:bg-[#1a7f45] px-6 py-2 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2", children: [

                _jsx(Check, { className: "h-4 w-4" }), " Desbanear"] }
              )] }
            )] }
          ) }
        ),
        document.body
      )] }
    ));

}