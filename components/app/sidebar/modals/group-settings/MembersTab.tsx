"use client";

import { useState, useMemo } from "react";
import { Crown, Shield, UserMinus, Search, X, Plus, Check, Users, ArrowRight, ClipboardList, AlertTriangle, Loader2, ShieldAlert, Ban } from "lucide-react";
import { UserAvatar } from "@/components/app/chat/ChatMessage";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";














function MemberConfirmModal({ isOpen, onClose, onConfirm, title, message, variant = 'danger', loading }) {
  if (!isOpen) return null;
  return (
    _jsx(AnimatePresence, { children:
      _jsx("div", { className: "fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children:
        _jsxs(motion.div, {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
          className: "w-full max-w-md bg-[#313338] rounded-2xl border border-white/5 shadow-2xl overflow-hidden", children: [

          _jsxs("div", { className: "p-6 space-y-4", children: [
            _jsxs("div", { className: cn("flex items-center gap-3", variant === 'danger' ? "text-red-400" : "text-yellow-400"), children: [
              _jsx("div", { className: cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", variant === 'danger' ? "bg-red-500/10" : "bg-yellow-500/10"), children:
                _jsx(AlertTriangle, { className: "h-6 w-6" }) }
              ),
              _jsx("h3", { className: "text-xl font-bold text-white", children: title })] }
            ),
            _jsx("p", { className: "text-[#949ba4] text-sm leading-relaxed", children: message })] }
          ),
          _jsxs("div", { className: "bg-[#2b2d31] p-4 flex items-center justify-end gap-3", children: [
            _jsx("button", {
              onClick: onClose,
              className: "px-4 py-2 text-sm font-medium text-white hover:underline transition-all", children:
              "Cancelar" }

            ),
            _jsxs("button", {
              onClick: onConfirm,
              disabled: loading,
              className: cn(
                "px-6 py-2 text-white text-sm font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg",
                variant === 'danger' ? "bg-red-500 hover:bg-red-600 shadow-red-500/10" : "bg-yellow-500 hover:bg-yellow-600 text-black shadow-yellow-500/10"
              ), children: [

              loading && _jsx(Loader2, { className: "h-4 w-4 animate-spin text-inherit" }), "Confirmar"] }

            )] }
          )] }
        ) }
      ) }
    ));

}

export function MembersTab({
  groupId,
  group,
  currentUserId,
  isOwner,
  handleTransferOwnership,
  handleKick,
  onTabChange,
  setSelectedLogUserId,
  onUpdate
}) {
  const [search, setSearch] = useState("");
  const [openRoleMenu, setOpenRoleMenu] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);


  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'transfer',
    targetId: null,
    targetName: ''
  });

  const handleToggleRole = async (memberId, roleId) => {
    const member = group.members.find((m) => (m.userId || m.id) === memberId);
    if (!member) return;

    const currentRoleIds = [...(member.roleIds || [])];
    const index = currentRoleIds.indexOf(roleId);
    if (index === -1) {
      currentRoleIds.push(roleId);
    } else {
      currentRoleIds.splice(index, 1);
    }

    try {
      await api.put(`/groups/${groupId}/members/${memberId}/roles`, { roleIds: currentRoleIds });
      member.roleIds = currentRoleIds;
      toast.success("Roles actualizados");
    } catch (e) {
      toast.error("Error al actualizar roles");
    }
  };

  const handleToggleAdminStatus = async (memberId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    try {
      await api.put(`/groups/${groupId}/members/${memberId}/role`, { role: newRole });
      toast.success(newRole === 'admin' ? "Miembro ascendido a Admin" : "Admin revocado");
      const member = group.members.find((m) => (m.userId || m.id) === memberId);
      if (member) member.role = newRole;
    } catch (e) {
      toast.error("Error al actualizar estado administrativo");
    }
  };

  const handleConfirmTransfer = (member) => {
    setConfirmModal({
      isOpen: true,
      type: 'transfer',
      targetId: member.userId || member.id,
      targetName: member.displayName || member.username
    });
  };

  const handleConfirmKick = (member) => {
    setConfirmModal({
      isOpen: true,
      type: 'kick',
      targetId: member.userId || member.id,
      targetName: member.displayName || member.username
    });
  };

  const handleViewUserHistory = (member) => {
    const mId = member.userId || member.id || member._id;
    console.log("Filtering history for user:", mId);
    setSelectedLogUserId?.(mId || null);
    onTabChange?.('audit_log');
  };

  const handleConfirmBan = (member) => {
    setConfirmModal({
      isOpen: true,
      type: 'ban',
      targetId: member.userId || member.id,
      targetName: member.displayName || member.username
    });
  };

  const executeAction = async () => {
    if (!confirmModal.targetId) return;
    setLoadingAction(true);
    try {
      if (confirmModal.type === 'transfer') {
        await handleTransferOwnership(confirmModal.targetId);
      } else if (confirmModal.type === 'ban') {
        await api.post(`/groups/${groupId}/bans`, { userId: confirmModal.targetId, reason: '' });
        toast.success("Usuario baneado");
      } else {
        await handleKick(confirmModal.targetId);
      }
      await onUpdate?.();
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    } catch (e) {
      toast.error(e.message || "Error al ejecutar la acción");
    } finally {
      setLoadingAction(false);
    }
  };

  const isAdmin = group?.members?.find((m) => (m.userId || m.id) === currentUserId)?.role === "admin";
  const canManageRoles = isOwner || isAdmin;


  const groupedMembers = useMemo(() => {
    if (!group) return [];
    const members = [...(group.members || [])];
    const roles = [...(group.roles || [])].sort((a, b) => (a.position || 0) - (b.position || 0));


    const sortedMembers = members.sort((a, b) => {
      if (a.role === 'owner') return -1;
      if (b.role === 'owner') return 1;
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (b.role === 'admin' && a.role !== 'admin') return 1;

      const getHighestRolePos = (m) => {
        const mRoles = (m.roleIds || []).map((rid) => roles.find((r) => r.id === rid)).filter(Boolean);
        if (mRoles.length === 0) return 9999;
        return Math.min(...mRoles.map((r) => r.position || 0));
      };

      return getHighestRolePos(a) - getHighestRolePos(b);
    });

    const filtered = sortedMembers.filter((m) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return m.username?.toLowerCase().includes(q) || m.displayName?.toLowerCase().includes(q);
    });

    return filtered;
  }, [group, search]);

  return (
    _jsxs("div", { className: "flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500", children: [

      _jsx(MemberConfirmModal, {
        isOpen: confirmModal.isOpen,
        onClose: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: executeAction,
        loading: loadingAction,
        variant: confirmModal.type === 'transfer' ? 'warning' : 'danger',
        title: confirmModal.type === 'transfer' ? "¿Transferir Propiedad?" : "¿Expulsar Miembro?",
        message: confirmModal.type === 'transfer' ?
        `¿Estás seguro de que quieres pasarle la corona a ${confirmModal.targetName}? Dejarás de tener control total sobre el grupo y pasarás a ser un administrador.` :
        `¿Quieres sacar a ${confirmModal.targetName} del grupo? Tendrá que ser invitado de nuevo para poder entrar.` }

      ),


      _jsxs("div", { className: "flex items-center justify-between mb-8 px-2", children: [
        _jsxs("div", { children: [
          _jsxs("h2", { className: "text-2xl font-black text-white tracking-tight flex items-center gap-3", children: [
            _jsx(Users, { className: "h-6 w-6 text-[var(--discord-blurple)]" }), " Miembros"] }
          ),
          _jsx("p", { className: "text-xs text-[#949ba4] font-medium tracking-wide mt-1", children: "Gestiona los roles y el acceso a tu grupo." })] }
        ),

        _jsxs("div", { className: "relative group", children: [
          _jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949ba4] group-focus-within:text-[var(--discord-blurple)] transition-colors" }),
          _jsx("input", {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Buscar por usuario o apodo...",
            className: "w-full md:w-[320px] bg-[#1e1f22] border border-white/5 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-[#4e5058] focus:ring-2 focus:ring-[var(--discord-blurple)]/50 outline-none transition-all shadow-inner" }
          ),
          search &&
          _jsx("button", {
            onClick: () => setSearch(""),
            className: "absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-all", children:

            _jsx(X, { className: "h-4 w-4 text-[#949ba4]" }) }
          )] }

        )] }
      ),


      _jsx("div", { className: "flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10 pb-20", children:
        _jsx("div", { className: "grid grid-cols-1 gap-2", children:
          groupedMembers.map((m) => {
            const mId = m.userId || m.id;
            const isSelf = mId === currentUserId;
            const isOnline = m.status === "online";
            const memberRoles = (group?.roles || []).filter((r) => (m.roleIds || []).includes(r.id));
            const highestRole = memberRoles.sort((a, b) => (a.position || 0) - (b.position || 0))[0];

            return (
              _jsxs("div", {

                className: "group flex items-center gap-4 p-4 rounded-2xl bg-[#2b2d31] border border-white/5 hover:border-white/10 transition-all hover:bg-[#313338] shadow-sm relative overflow-hidden", children: [


                highestRole?.color &&
                _jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1 opacity-40", style: { backgroundColor: highestRole.color } }),


                _jsxs("div", { className: "relative shrink-0", children: [
                  _jsx(UserAvatar, { participant: m, size: 12 }),
                  _jsx("div", { className: cn(
                      "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-[3px] border-[#2b2d31] group-hover:border-[#313338] transition-colors",
                      isOnline ? "bg-[#23a55a]" : "bg-[#949ba4]"
                    ) })] }
                ),

                _jsxs("div", { className: "flex-1 min-w-0", children: [
                  _jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                    _jsx("span", { className: "text-base font-bold text-white truncate group-hover:text-[var(--discord-blurple)] transition-colors", style: highestRole?.color ? { color: highestRole.color } : {}, children:
                      m.displayName || m.username }
                    ),
                    m.role === "owner" &&
                    _jsxs("div", { className: "flex items-center bg-yellow-400/10 text-yellow-500 rounded-lg px-2 py-0.5 border border-yellow-400/20 shadow-sm relative group/owner", children: [
                      _jsx(Crown, { className: "h-3 w-3 mr-1" }),
                      _jsx("span", { className: "text-[10px] font-black uppercase tracking-tighter", children: "Due\xF1o" })] }
                    ),

                    m.role === "admin" && m.role !== 'owner' &&
                    _jsxs("div", { className: "flex items-center bg-[var(--discord-blurple)]/10 text-[var(--discord-blurple)] rounded-lg px-2 py-0.5 border border-[var(--discord-blurple)]/20 shadow-sm", children: [
                      _jsx(Shield, { className: "h-3 w-3 mr-1" }),
                      _jsx("span", { className: "text-[10px] font-black uppercase tracking-tighter", children: "Admin" })] }
                    )] }

                  ),
                  _jsxs("div", { className: "flex flex-wrap gap-1.5 items-center", children: [
                    _jsxs("span", { className: "text-xs text-[#949ba4] font-medium mr-2", children: ["@", m.username] }),


                    memberRoles.map((r) =>
                    _jsxs("div", {

                      className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/5 shadow-inner transition-transform hover:scale-105",
                      style: { backgroundColor: `${r.color}15`, color: r.color }, children: [

                      _jsx("div", { className: "h-1.5 w-1.5 rounded-full", style: { backgroundColor: r.color } }),
                      _jsx("span", { className: "text-[11px] font-bold tracking-tight", children: r.name }),
                      canManageRoles &&
                      _jsx("button", {
                        onClick: (e) => {e.stopPropagation();handleToggleRole(mId, r.id);},
                        className: "ml-1 hover:text-white transition-colors", children:

                        _jsx(X, { className: "h-2.5 w-2.5" }) }
                      )] }, r.id

                    )
                    ),

                    canManageRoles &&
                    _jsxs("div", { className: "relative", children: [
                      _jsx("button", {
                        onClick: () => setOpenRoleMenu(openRoleMenu === mId ? null : mId),
                        className: "h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-[#949ba4] hover:text-white transition-all shadow-sm active:scale-90", children:

                        _jsx(Plus, { className: "h-3.5 w-3.5" }) }
                      ),

                      _jsx(AnimatePresence, { children:
                        openRoleMenu === mId &&
                        _jsxs(_Fragment, { children: [
                          _jsx("div", { className: "fixed inset-0 z-[220]", onClick: () => setOpenRoleMenu(null) }),
                          _jsxs(motion.div, {
                            initial: { scale: 0.95, opacity: 0, y: 10 },
                            animate: { scale: 1, opacity: 1, y: 0 },
                            exit: { scale: 0.95, opacity: 0, y: 10 },
                            className: "absolute bottom-full left-0 mb-3 z-[1000] w-60 bg-[#111214] border border-white/10 shadow-2xl rounded-2xl p-2 overflow-hidden", children: [

                            _jsxs("div", { className: "px-3 py-2 text-[10px] font-black text-[#949ba4] uppercase tracking-widest border-b border-white/5 mb-1 flex items-center gap-2 font-black", children: [
                              _jsx(ArrowRight, { className: "h-3 w-3" }), " Asignar Roles"] }
                            ),
                            _jsxs("div", { className: "max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10", children: [

                              isOwner && !isSelf &&
                              _jsxs("button", {
                                onClick: () => handleToggleAdminStatus(mId, m.role),
                                className: cn(
                                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all mb-2 border border-white/5",
                                  m.role === 'admin' ? "bg-red-500/10 text-red-400" : "bg-[var(--discord-blurple)]/10 text-[var(--discord-blurple)]"
                                ), children: [

                                _jsxs("div", { className: "flex items-center gap-3 truncate", children: [
                                  _jsx(ShieldAlert, { className: "h-3.5 w-3.5" }),
                                  _jsx("span", { className: "text-sm font-black truncate", children: m.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin' })] }
                                ),
                                m.role === 'admin' && _jsx(Check, { className: "h-4 w-4" })] }
                              ),


                              group.roles && group.roles.length > 0 ?
                              group.roles.map((r) => {
                                const hasRole = (m.roleIds || []).includes(r.id);
                                return (
                                  _jsxs("button", {

                                    onClick: () => handleToggleRole(mId, r.id),
                                    className: cn(
                                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all mb-0.5",
                                      hasRole ? "bg-[var(--discord-blurple)]/20 text-white" : "text-[#949ba4] hover:bg-white/5 hover:text-[#dbdee1]"
                                    ), children: [

                                    _jsxs("div", { className: "flex items-center gap-3 truncate", children: [
                                      _jsx("div", { className: "h-3 w-3 rounded-full shadow-lg", style: { backgroundColor: r.color } }),
                                      _jsx("span", { className: "text-sm font-bold truncate", children: r.name })] }
                                    ),
                                    hasRole && _jsx(Check, { className: "h-4 w-4 text-[var(--discord-blurple)]" })] }, r.id
                                  ));

                              }) :

                              _jsx("div", { className: "px-3 py-6 text-xs text-[#4e5058] text-center font-bold", children: "No hay roles definidos" })] }

                            )] }
                          )] }
                        ) }

                      )] }
                    )] }

                  )] }
                ),


                (isOwner || isAdmin && m.role !== 'owner') && !isSelf &&
                _jsxs("div", { className: "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pr-2", children: [
                  _jsx("button", {
                    onClick: () => handleViewUserHistory(m),
                    className: "p-3 text-[#949ba4] hover:text-[var(--discord-blurple)] hover:bg-[var(--discord-blurple)]/10 rounded-xl transition-all shadow-lg active:scale-90 border border-transparent hover:border-[var(--discord-blurple)]/20",
                    title: "Ver Historial", children:

                    _jsx(ClipboardList, { className: "h-5 w-5" }) }
                  ),
                  isOwner &&
                  _jsx("button", {
                    onClick: () => handleConfirmTransfer(m),
                    className: "p-3 text-[#949ba4] hover:text-yellow-400 hover:bg-yellow-400/10 rounded-xl transition-all shadow-lg active:scale-90 border border-transparent hover:border-yellow-400/20",
                    title: "Traspasar Propiedad", children:

                    _jsx(Crown, { className: "h-5 w-5" }) }
                  ),

                  _jsx("button", {
                    onClick: () => handleConfirmKick(m),
                    className: "p-3 text-[#949ba4] hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all shadow-lg active:scale-90 border border-transparent hover:border-red-400/20",
                    title: "Expulsar Miembro", children:

                    _jsx(UserMinus, { className: "h-5 w-5" }) }
                  ),
                  (isOwner || isAdmin) &&
                  _jsx("button", {
                    onClick: () => handleConfirmBan(m),
                    className: "p-3 text-[#949ba4] hover:text-orange-400 hover:bg-orange-400/10 rounded-xl transition-all shadow-lg active:scale-90 border border-transparent hover:border-orange-400/20",
                    title: "Banear Miembro", children:

                    _jsx(Ban, { className: "h-5 w-5" }) }
                  )] }

                )] }, mId

              ));

          }) }
        ) }
      )] }
    ));

}