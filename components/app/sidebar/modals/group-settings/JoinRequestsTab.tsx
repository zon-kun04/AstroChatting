"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Loader2, X, Clock, MessageSquare, BadgeCheck, BadgeX, Search } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { assetUrl } from "@/components/app/chat/hooks";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";





export function JoinRequestsTab({ groupId }) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [processing, setProcessing] = useState({});
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/groups/${groupId}/requests`);
      setRequests(res.requests);
    } catch (e) {
      toast.error("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {load();}, [load]);

  const handleAction = async (requestId, action) => {
    setProcessing((prev) => ({ ...prev, [requestId]: action }));
    try {
      await api.post(`/groups/${groupId}/requests/${requestId}/${action}`, {});
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      toast.success(action === "approve" ? "Solicitud aprobada" : "Solicitud rechazada");
    } catch (e) {
      toast.error(e.message || "Error al procesar la solicitud");
    } finally {
      setProcessing((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  const filtered = requests.filter((r) =>
  !search.trim() || r.userName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    _jsx("div", { className: "flex h-40 items-center justify-center", children:
      _jsx(Loader2, { className: "h-6 w-6 animate-spin text-[var(--discord-blurple)]" }) }
    ));


  return (
    _jsxs("div", { className: "space-y-6 animate-in slide-in-from-right-4 duration-300", children: [
      _jsxs("div", { className: "flex items-center justify-between", children: [
        _jsxs("div", { children: [
          _jsx("h2", { className: "text-xl font-bold text-white", children: "Solicitudes de Uni\xF3n" }),
          _jsxs("p", { className: "text-sm text-[var(--muted-foreground)]", children: ["Gestiona qui\xE9n puede unirse a tu grupo.",
            " ",
            _jsx("span", { className: "font-bold text-[var(--discord-blurple)]", children: requests.length }), " solicitud", requests.length !== 1 ? "es" : "", " pendiente", requests.length !== 1 ? "s" : "", "."] }
          )] }
        ),
        requests.length > 0 &&
        _jsx("div", { className: "flex items-center gap-2", children:
          _jsx("button", {
            onClick: async () => {
              for (const r of requests) await handleAction(r.id, "reject");
            },
            className: "px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 text-xs font-bold transition-colors", children:
            "Rechazar Todas" }

          ) }
        )] }

      ),


      _jsxs("div", { className: "relative", children: [
        _jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" }),
        _jsx("input", {
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Buscar por nombre...",
          className: "w-full bg-[#1e1f22] border border-white/5 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:ring-1 focus:ring-[var(--discord-blurple)] outline-none" }
        ),
        search &&
        _jsx("button", { onClick: () => setSearch(""), className: "absolute right-3 top-1/2 -translate-y-1/2", children:
          _jsx(X, { className: "h-3.5 w-3.5 text-[var(--muted-foreground)]" }) }
        )] }

      ),


      _jsx("div", { className: "space-y-3", children:
        filtered.length > 0 ? filtered.map((req) =>
        _jsxs("div", {

          className: "flex flex-col gap-3 rounded-xl bg-[#2b2d31] border border-white/5 p-4", children: [

          _jsxs("div", { className: "flex items-center gap-3", children: [
            req.userAvatar ?
            _jsx("img", { src: assetUrl(req.userAvatar), className: "h-10 w-10 rounded-full object-cover flex-shrink-0" }) :

            _jsx("div", { className: "h-10 w-10 rounded-full bg-[var(--discord-blurple)] flex items-center justify-center text-white font-bold flex-shrink-0", children:
              req.userName[0]?.toUpperCase() }
            ),

            _jsxs("div", { className: "flex-1 min-w-0", children: [
              _jsx("p", { className: "font-semibold text-white text-sm", children: req.userName }),
              _jsxs("p", { className: "text-xs text-[var(--muted-foreground)] flex items-center gap-1", children: [
                _jsx(Clock, { className: "h-3 w-3" }),
                new Date(req.createdAt).toLocaleString()] }
              )] }
            )] }
          ),


          req.answer &&
          _jsxs("div", { className: "rounded-lg bg-black/20 border border-white/5 p-3", children: [
            _jsxs("p", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-1 flex items-center gap-1", children: [
              _jsx(MessageSquare, { className: "h-3 w-3" }), " Su respuesta"] }
            ),
            _jsxs("p", { className: "text-sm text-[#dbdee1] leading-relaxed italic", children: ["\"", req.answer, "\""] })] }
          ),



          _jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
            _jsxs("button", {
              onClick: () => handleAction(req.id, "reject"),
              disabled: !!processing[req.id],
              className: "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors disabled:opacity-50", children: [

              processing[req.id] === "reject" ? _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : _jsx(BadgeX, { className: "h-3.5 w-3.5" }), "Rechazar"] }

            ),
            _jsxs("button", {
              onClick: () => handleAction(req.id, "approve"),
              disabled: !!processing[req.id],
              className: "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#23a55a] hover:bg-[#1a7f45] text-white transition-colors disabled:opacity-50", children: [

              processing[req.id] === "approve" ? _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : _jsx(BadgeCheck, { className: "h-3.5 w-3.5" }), "Aprobar"] }

            )] }
          )] }, req.id
        )
        ) :
        _jsxs("div", { className: "flex flex-col items-center justify-center py-20 rounded-xl border-2 border-dashed border-white/5 text-center", children: [
          _jsx("div", { className: "h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4", children:
            _jsx(Users, { className: "h-8 w-8 text-[var(--muted-foreground)] opacity-20" }) }
          ),
          _jsx("p", { className: "text-sm font-semibold text-white", children:
            search ? "No se encontraron resultados" : "No hay solicitudes pendientes" }
          ),
          _jsx("p", { className: "text-xs text-[var(--muted-foreground)] mt-1 max-w-[240px]", children:
            search ? "Intenta con otro nombre." : "Cuando alguien solicite unirse, aparecerá aquí." }
          )] }
        ) }

      )] }
    ));

}