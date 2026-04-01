"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ClipboardList, Loader2, UserMinus, Crown, Link, ShieldAlert, History, UserPlus, X, Search, ArrowRight, Users } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { UserAvatar } from "@/components/app/chat/ChatMessage";

import { motion, AnimatePresence } from "framer-motion";import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";







export function AuditLogTab({ groupId, filterUserId, onClearFilter }) {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const observerTarget = useRef(null);
  const limit = 20;

  const loadLogs = useCallback(async (isInitial = true) => {
    if (isInitial) setLoading(true);else
    setLoadingMore(true);

    try {
      const currentOffset = isInitial ? 0 : offset;
      const res = await api.get(
        `/groups/${groupId}/audit-logs?limit=${limit}&offset=${currentOffset}&search=${search}`
      );

      if (isInitial) {
        setLogs(res.logs);
      } else {
        setLogs((prev) => [...prev, ...res.logs]);
      }

      setTotal(res.total);
      setHasMore(res.hasMore);
      setOffset(currentOffset + limit);
    } catch (e) {
      toast.error("Error al cargar el historial");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [groupId, offset, search]);


  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs(true);
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, groupId]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadLogs(false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadLogs]);

  const filteredLogs = useMemo(() => {
    if (!filterUserId) return logs;
    const fId = String(filterUserId);
    return logs.filter((log) =>
    String(log.userId) === fId ||
    String(log.details?.targetUserId) === fId ||
    String(log.details?.kickedUserId) === fId ||
    String(log.details?.newOwnerId) === fId
    );
  }, [logs, filterUserId]);

  const filteredUser = useMemo(() => {
    if (!filterUserId || logs.length === 0) return null;
    const fId = String(filterUserId);
    const log = logs.find((l) => String(l.userId) === fId);
    if (log) return { id: log.userId, name: log.userName, avatar: log.userAvatar };
    return null;
  }, [logs, filterUserId]);

  const getActionIcon = (action) => {
    switch (action) {
      case 'member_kick':return _jsx(UserMinus, { className: "h-4 w-4 text-red-400" });
      case 'member_ban':return _jsx(UserMinus, { className: "h-4 w-4 text-orange-400" });
      case 'member_unban':return _jsx(UserPlus, { className: "h-4 w-4 text-green-400" });
      case 'transfer_ownership':return _jsx(Crown, { className: "h-4 w-4 text-yellow-400" });
      case 'invite_create':return _jsx(Link, { className: "h-4 w-4 text-green-400" });
      case 'invite_revoke':return _jsx(ShieldAlert, { className: "h-4 w-4 text-orange-400" });
      case 'invite_revoke_all':return _jsx(ShieldAlert, { className: "h-4 w-4 text-red-400" });
      case 'join_request_approved':return _jsx(UserPlus, { className: "h-4 w-4 text-green-400" });
      case 'join_request_rejected':return _jsx(UserMinus, { className: "h-4 w-4 text-red-400" });
      case 'webhook_create':return _jsx(ArrowRight, { className: "h-4 w-4 text-[var(--discord-blurple)]" });
      case 'webhook_delete':return _jsx(ShieldAlert, { className: "h-4 w-4 text-orange-400" });
      case 'member_roles_update':return _jsx(ShieldAlert, { className: "h-4 w-4 text-[var(--discord-blurple)]" });
      default:return _jsx(History, { className: "h-4 w-4 text-[var(--discord-blurple)]" });
    }
  };

  const getActionText = (log) => {
    const name = _jsx("span", { className: "font-bold text-white", children: log.userName });
    const target = log.details?.targetUserId || log.details?.bannedUserId || log.details?.unbannedUserId;

    switch (log.action) {
      case 'member_kick':
        return _jsxs(_Fragment, { children: [name, " ha expulsado a un miembro."] });
      case 'member_ban':
        return _jsxs(_Fragment, { children: [name, " ha baneado a un usuario", log.details?.reason ? _jsxs(_Fragment, { children: [" \u2014 raz\xF3n: ", _jsx("em", { className: "text-white/70", children: log.details.reason })] }) : "", "."] });
      case 'member_unban':
        return _jsxs(_Fragment, { children: [name, " ha desbaneado a un usuario."] });
      case 'transfer_ownership':
        return _jsxs(_Fragment, { children: [name, " ha traspasado la propiedad del grupo."] });
      case 'invite_create':
        return _jsxs(_Fragment, { children: [name, " ha creado un enlace de invitaci\xF3n: ", _jsx("code", { className: "text-xs bg-white/5 px-1 rounded", children: log.details?.code })] });
      case 'invite_revoke':
        return _jsxs(_Fragment, { children: [name, " ha revocado el enlace: ", _jsx("code", { className: "text-xs bg-white/5 px-1 rounded", children: log.details?.code })] });
      case 'invite_revoke_all':
        return _jsxs(_Fragment, { children: [name, " ha revocado ", _jsx("strong", { children: "todas" }), " las invitaciones."] });
      case 'join_request_approved':
        return _jsxs(_Fragment, { children: [name, " ha aprobado una solicitud de uni\xF3n."] });
      case 'join_request_rejected':
        return _jsxs(_Fragment, { children: [name, " ha rechazado una solicitud de uni\xF3n."] });
      case 'webhook_create':
        return _jsxs(_Fragment, { children: [name, " ha creado el webhook ", _jsx("em", { className: "text-white/70", children: log.details?.webhookName }), "."] });
      case 'webhook_delete':
        return _jsxs(_Fragment, { children: [name, " ha eliminado un webhook."] });
      case 'member_roles_update':
        return _jsxs(_Fragment, { children: [name, " ha actualizado los roles de un miembro."] });
      default:
        return _jsxs(_Fragment, { children: [name, " realiz\xF3: ", _jsx("code", { className: "text-xs bg-white/5 px-1 rounded", children: log.action })] });
    }
  };

  return (
    _jsxs("div", { className: "space-y-6 animate-in slide-in-from-bottom-2 duration-500 pb-20 max-w-[900px] mx-auto", children: [
      _jsx("div", { className: "flex flex-col gap-6", children:
        _jsxs("div", { className: "flex items-center justify-between", children: [
          _jsxs("div", { children: [
            _jsxs("h2", { className: "text-2xl font-black text-white tracking-tight flex items-center gap-3", children: [
              _jsx(ClipboardList, { className: "h-6 w-6 text-[var(--discord-blurple)]" }), " Historial de Auditor\xEDa"] }
            ),
            _jsx("p", { className: "text-xs text-[#949ba4] font-medium tracking-wide mt-1", children: "Registro detallado de acciones administrativas." })] }
          ),

          _jsxs("div", { className: "flex items-center gap-4", children: [
            filterUserId &&
            _jsxs(motion.div, {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "flex items-center gap-3 bg-[var(--discord-blurple)]/10 border border-[var(--discord-blurple)]/20 px-4 py-2 rounded-xl", children: [

              _jsxs("div", { className: "flex items-center gap-2", children: [
                _jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[#949ba4]", children: "Viendo a:" }),
                filteredUser ?
                _jsxs("div", { className: "flex items-center gap-2 px-2 py-0.5 bg-black/20 rounded-lg border border-white/5", children: [
                  _jsx(UserAvatar, { participant: filteredUser, size: 5 }),
                  _jsx("span", { className: "text-xs font-bold text-white", children: filteredUser.name })] }
                ) :

                _jsxs("div", { className: "flex items-center gap-2 px-2 py-0.5 bg-black/20 rounded-lg border border-white/5", children: [
                  _jsx("div", { className: "h-5 w-5 rounded-full bg-white/5 flex items-center justify-center", children:
                    _jsx(Users, { className: "h-3 w-3 text-[#949ba4]" }) }
                  ),
                  _jsx("span", { className: "text-xs font-bold text-white tracking-widest", children: String(filterUserId).slice(0, 8) })] }
                )] }

              ),
              _jsx("button", {
                onClick: onClearFilter,
                className: "p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all text-[#949ba4]", children:

                _jsx(X, { className: "h-4 w-4" }) }
              )] }
            ),


            _jsxs("div", { className: "relative group", children: [
              _jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949ba4] group-focus-within:text-[var(--discord-blurple)] transition-colors" }),
              _jsx("input", {
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Buscar acciones o usuarios...",
                className: "w-[280px] bg-[#1e1f22] border border-white/5 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-[#4e5058] focus:ring-2 focus:ring-[var(--discord-blurple)]/50 outline-none transition-all shadow-inner" }
              ),
              search &&
              _jsx("button", {
                onClick: () => setSearch(""),
                className: "absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-all", children:

                _jsx(X, { className: "h-4 w-4 text-[#949ba4]" }) }
              )] }

            )] }
          )] }
        ) }
      ),

      _jsx("div", { className: "space-y-2", children:
        loading ?
        _jsxs("div", { className: "flex flex-col items-center justify-center py-24 space-y-4", children: [
          _jsx(Loader2, { className: "h-8 w-8 animate-spin text-[var(--discord-blurple)]" }),
          _jsx("p", { className: "text-xs font-bold text-[#4e5058] uppercase tracking-widest animate-pulse", children: "Cargando registros..." })] }
        ) :
        filteredLogs.length > 0 ?
        _jsxs(_Fragment, { children: [
          _jsx(AnimatePresence, { mode: "popLayout", children:
            filteredLogs.map((log, idx) =>
            _jsxs(motion.div, {

              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: Math.min(idx * 0.05, 1) },
              className: "group flex gap-4 p-4 rounded-2xl bg-[#2b2d31] border border-white/5 hover:border-white/10 transition-all hover:bg-[#313338] shadow-sm", children: [

              _jsx("div", { className: "flex-shrink-0", children:
                _jsx(UserAvatar, { participant: { id: log.userId, avatar: log.userAvatar, displayName: log.userName }, size: 10 }) }
              ),
              _jsxs("div", { className: "flex flex-1 flex-col min-w-0 justify-center", children: [
                _jsxs("div", { className: "flex items-center gap-3 text-sm text-[#dbdee1]", children: [
                  _jsx("div", { className: "flex-shrink-0 bg-white/5 p-2 rounded-xl group-hover:bg-white/10 transition-colors", children: getActionIcon(log.action) }),
                  _jsx("div", { className: "truncate group-hover:text-white transition-colors", children: getActionText(log) })] }
                ),
                _jsxs("div", { className: "text-[10px] font-bold text-[#4e5058] mt-2 ml-12 uppercase tracking-widest flex items-center gap-2", children: [
                  _jsx("div", { className: "h-1 w-1 rounded-full bg-[#4e5058]" }),
                  new Date(log.createdAt).toLocaleString()] }
                )] }
              )] }, log.id
            )
            ) }
          ),


          _jsxs("div", { ref: observerTarget, className: "h-20 flex items-center justify-center", children: [
            loadingMore &&
            _jsxs("div", { className: "flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 scale-90", children: [
              _jsx(Loader2, { className: "h-4 w-4 animate-spin text-[var(--discord-blurple)]" }),
              _jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[#949ba4]", children: "Cargando m\xE1s..." })] }
            ),

            !hasMore && filteredLogs.length > 5 &&
            _jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-[#4e5058] border-t border-white/5 pt-8 w-full text-center", children: "Has llegado al final del historial" }

            )] }

          )] }
        ) :

        _jsxs("div", { className: "flex flex-col items-center justify-center py-24 text-center space-y-6 animate-in zoom-in-95 duration-500", children: [
          _jsx("div", { className: "h-24 w-24 rounded-full bg-white/5 flex items-center justify-center shadow-inner group", children:
            _jsx(History, { className: "h-12 w-12 text-[#4e5058] group-hover:text-[var(--discord-blurple)] transition-colors" }) }
          ),
          _jsxs("div", { className: "max-w-[300px] space-y-2", children: [
            _jsx("p", { className: "text-lg font-bold text-white", children: "No se encontr\xF3 nada" }),
            _jsx("p", { className: "text-sm text-[#949ba4] font-medium leading-relaxed", children:
              search ?
              `No hay resultados para "${search}". Intenta con otros términos.` :
              "Todavía no se ha registrado ninguna acción administrativa en este grupo." }
            )] }
          ),
          (search || filterUserId) &&
          _jsx("button", {
            onClick: () => {setSearch("");onClearFilter?.();},
            className: "px-6 py-2 bg-[var(--discord-blurple)] hover:bg-[var(--discord-blurple)]/80 text-white text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95", children:
            "Limpiar Filtros" }

          )] }

        ) }

      )] }
    ));

}