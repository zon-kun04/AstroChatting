"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Shield, Plus, Trash2, Loader2, ChevronRight, Settings2, Palette, Lock, Search, ArrowUp, ArrowDown, X, AlertTriangle, CheckSquare, Square, Users } from "lucide-react";
import { UserAvatar } from "@/components/app/chat/ChatMessage";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";








function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  if (!isOpen) return null;
  return (
    _jsx(AnimatePresence, { children:
      _jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children:
        _jsxs(motion.div, {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
          className: "w-full max-w-md bg-[#313338] rounded-2xl border border-white/5 shadow-2xl overflow-hidden", children: [

          _jsxs("div", { className: "p-6 space-y-4", children: [
            _jsxs("div", { className: "flex items-center gap-3 text-red-400", children: [
              _jsx("div", { className: "h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0", children:
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
              className: "px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-red-500/10", children: [

              loading && _jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Confirmar"] }

            )] }
          )] }
        ) }
      ) }
    ));

}

export function RolesTab({ groupId, group, onUpdateGroup }) {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const [originalRole, setOriginalRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('general');
  const [memberSearch, setMemberSearch] = useState("");


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);


  const [gradStart, setGradStart] = useState("#5865f2");
  const [gradEnd, setGradEnd] = useState("#eb459e");
  const [gradAngle, setGradAngle] = useState(90);

  const loadRoles = useCallback(async () => {
    try {
      const res = await api.get(`/groups/${groupId}/roles`);
      const sorted = (res.roles || []).sort((a, b) => (a.position || 0) - (b.position || 0));
      setRoles(sorted);
      if (sorted.length > 0 && !selectedRoleId) {
        setSelectedRoleId(sorted[0].id);
        setOriginalRole({ ...sorted[0] });
        setEditingRole({ ...sorted[0] });
      }
    } catch (e) {
      toast.error("Error al cargar roles");
    } finally {
      setLoading(false);
    }
  }, [groupId, selectedRoleId]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);


  const hasChanges = useMemo(() => {
    if (!editingRole || !originalRole) return false;
    return JSON.stringify(editingRole) !== JSON.stringify(originalRole);
  }, [editingRole, originalRole]);

  const handleSelectRole = (role) => {


    setSelectedRoleId(role.id);
    setOriginalRole({ ...role });
    setEditingRole({ ...role });
  };

  const handleCreateRole = async () => {
    try {
      const res = await api.post(`/groups/${groupId}/roles`, { name: "Nuevo Rol", color: "#99aab5" });
      const newRole = res.role;
      setRoles((prev) => [...prev, newRole]);
      setSelectedRoleId(newRole.id);
      setOriginalRole({ ...newRole });
      setEditingRole({ ...newRole });
      toast.success("Rol creado");
    } catch (e) {
      toast.error("Error al crear rol");
    }
  };

  const handleSaveRole = async () => {
    if (!editingRole) return;
    setSaving(true);
    try {
      await api.put(`/groups/${groupId}/roles/${editingRole.id}`, editingRole);
      setRoles((prev) => prev.map((r) => r.id === editingRole.id ? editingRole : r));
      setOriginalRole({ ...editingRole });
      toast.success("Rol guardado");
    } catch (e) {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalRole) {
      setEditingRole({ ...originalRole });
      toast.info("Cambios descartados");
    }
  };

  const handleConfirmDelete = (roleId) => {
    setRoleToDelete(roleId);
    setShowDeleteModal(true);
  };

  const handleDeleteRoleExec = async () => {
    if (!roleToDelete) return;
    setSaving(true);
    try {
      await api.delete(`/groups/${groupId}/roles/${roleToDelete}`);
      setRoles((prev) => prev.filter((r) => r.id !== roleToDelete));
      if (selectedRoleId === roleToDelete) {
        setSelectedRoleId(null);
        setOriginalRole(null);
        setEditingRole(null);
      }
      toast.success("Rol eliminado");
      setShowDeleteModal(false);
    } catch (e) {
      toast.error("Error al eliminar");
    } finally {
      setSaving(false);
    }
  };

  const handleMoveRole = async (roleId, direction) => {
    const currentIndex = roles.findIndex((r) => r.id === roleId);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === roles.length - 1) return;

    const newRoles = [...roles];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const [movedRole] = newRoles.splice(currentIndex, 1);
    newRoles.splice(targetIndex, 0, movedRole);


    setRoles(newRoles.map((r, i) => ({ ...r, position: i })));

    try {
      await api.patch(`/groups/${groupId}/roles/reorder`, { roleIds: newRoles.map((r) => r.id) });
    } catch (e) {
      toast.error("Error al reordenar");
      loadRoles();
    }
  };

  const togglePermission = (perm) => {
    if (!editingRole) return;
    const newPerms = { ...(editingRole.permissions || {}) };
    newPerms[perm] = !newPerms[perm];
    setEditingRole({ ...editingRole, permissions: newPerms });
  };

  const handleToggleAllPermissions = (value) => {
    if (!editingRole) return;
    const newPerms = {};
    permissionsList.forEach((p) => {
      newPerms[p.id] = value;
    });
    setEditingRole({ ...editingRole, permissions: newPerms });
    toast.info(value ? "Todos los permisos activados" : "Todos los permisos desactivados");
  };

  const handleGenerateGradient = () => {
    const grad = `linear-gradient(${gradAngle}deg, ${gradStart}, ${gradEnd})`;
    setEditingRole({ ...editingRole, gradient: grad });
  };

  const handleToggleMemberRole = async (memberId) => {
    if (!selectedRoleId) return;
    const member = group.members.find((m) => (m.userId || m.id) === memberId);
    if (!member) return;

    const currentRoleIds = [...(member.roleIds || [])];
    const index = currentRoleIds.indexOf(selectedRoleId);

    if (index === -1) {
      currentRoleIds.push(selectedRoleId);
    } else {
      currentRoleIds.splice(index, 1);
    }

    try {
      await api.put(`/groups/${groupId}/members/${memberId}/roles`, { roleIds: currentRoleIds });
      toast.success("Roles actualizados");
      onUpdateGroup();
    } catch (e) {
      toast.error("Error al actualizar roles");
    }
  };

  const filteredMembers = useMemo(() => {
    const raw = group?.members || [];
    if (!memberSearch.trim()) return raw;
    const q = memberSearch.toLowerCase();
    return raw.filter((m) =>
    m.username?.toLowerCase().includes(q) ||
    m.displayName?.toLowerCase().includes(q)
    );
  }, [group?.members, memberSearch]);

  const permissionsList = [
  { id: 'manageGroup', label: 'Gestionar Grupo', category: 'General' },
  { id: 'editGroupInfo', label: 'Editar Info. del Grupo', category: 'General' },
  { id: 'manageMembers', label: 'Gestionar Miembros', category: 'Administración' },
  { id: 'manageRoles', label: 'Gestionar Roles', category: 'Administración' },
  { id: 'sendMessages', label: 'Enviar Mensajes', category: 'Mensajes' },
  { id: 'sendMedia', label: 'Adjuntar Archivos', category: 'Mensajes' },
  { id: 'deleteMessages', label: 'Gestionar Mensajes', category: 'Mensajes' },
  { id: 'mentionEveryone', label: 'Mencionar a todos', category: 'Mensajes' },
  { id: 'pinMessages', label: 'Anclar Mensajes', category: 'Mensajes' },
  { id: 'invitePermission', label: 'Crear Invitación', category: 'Membresía' }];


  const PRESET_COLORS = ["#99aab5", "#5865f2", "#23a55a", "#f57731", "#ed4245", "#eb459e", "#fee75c"];

  if (loading) return (
    _jsx("div", { className: "flex h-40 items-center justify-center", children:
      _jsx(Loader2, { className: "h-6 w-6 animate-spin text-[var(--discord-blurple)]" }) }
    ));


  return (
    _jsxs("div", { className: "flex flex-col md:flex-row h-[680px] -mx-4 -mb-4 overflow-hidden animate-in slide-in-from-right-4 duration-300 relative", children: [

      _jsx(ConfirmModal, {
        isOpen: showDeleteModal,
        onClose: () => setShowDeleteModal(false),
        onConfirm: handleDeleteRoleExec,
        title: "\xBFBorrar este rol?",
        message: "\xBFEst\xE1s completamente seguro? Esta acci\xF3n es irreversible y quitar\xE1 el rol autom\xE1ticamente de todos los miembros que lo tengan asignado.",
        loading: saving }
      ),


      _jsxs("div", { className: "w-full md:w-[260px] flex flex-col bg-[#2b2d31] border-r border-white/5 p-4 py-8", children: [
        _jsxs("div", { className: "flex items-center justify-between mb-4 px-2", children: [
          _jsx("h3", { className: "text-xs font-bold uppercase text-[#949ba4] tracking-widest", children: "Roles del Grupo" }),
          _jsx("button", { onClick: handleCreateRole, className: "p-1 hover:bg-white/10 rounded transition-colors text-white", children:
            _jsx(Plus, { className: "h-4 w-4" }) }
          )] }
        ),
        _jsx("div", { className: "flex-1 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-white/10", children:
          roles.map((role, idx) =>
          _jsxs("div", { className: "group relative", children: [
            _jsxs("button", {
              onClick: () => handleSelectRole(role),
              className: cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all",
                selectedRoleId === role.id ? "bg-[#3f4147] text-white shadow-sm ring-1 ring-white/5" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
              ), children: [

              _jsxs("div", { className: "flex items-center gap-3 truncate", children: [
                _jsx("div", { className: "h-3 w-3 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]", style: { backgroundColor: role.color } }),
                _jsx("span", { className: "text-sm font-bold truncate tracking-tight", style: {
                    color: role.gradient ? 'transparent' : 'inherit',
                    backgroundImage: role.gradient || 'none',
                    WebkitBackgroundClip: role.gradient ? 'text' : 'unset',
                    backgroundClip: role.gradient ? 'text' : 'unset'
                  }, children: role.name })] }
              ),
              _jsx(ChevronRight, { className: cn("h-4 w-4 opacity-0 transition-opacity", selectedRoleId === role.id && "opacity-100") })] }
            ),


            _jsxs("div", { className: "absolute -right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20", children: [
              _jsx("button", {
                onClick: (e) => {e.stopPropagation();handleMoveRole(role.id, 'up');},
                disabled: idx === 0,
                className: "bg-[#1e1f22] p-1 rounded-sm hover:text-white disabled:opacity-20 shadow-lg border border-white/5", children:

                _jsx(ArrowUp, { className: "h-2.5 w-2.5" }) }
              ),
              _jsx("button", {
                onClick: (e) => {e.stopPropagation();handleMoveRole(role.id, 'down');},
                disabled: idx === roles.length - 1,
                className: "bg-[#1e1f22] p-1 rounded-sm hover:text-white disabled:opacity-20 shadow-lg border border-white/5", children:

                _jsx(ArrowDown, { className: "h-2.5 w-2.5" }) }
              )] }
            )] }, role.id
          )
          ) }
        )] }
      ),


      _jsx("div", { className: "flex-1 flex flex-col bg-[#313338] overflow-hidden relative", children:
        editingRole ?
        _jsxs("div", { className: "flex flex-col h-full animate-in fade-in duration-300", children: [

          _jsxs("div", { className: "p-6 border-b border-white/5 bg-[#313338]/90 backdrop-blur-xl z-20 shadow-sm relative", children: [
            _jsxs("div", { className: "flex items-center justify-between", children: [
              _jsxs("div", { className: "flex items-center gap-4", children: [
                _jsx("div", { className: "h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 shadow-2xl", children:
                  editingRole.iconType === 'emoji' ?
                  _jsx("span", { className: "text-2xl", children: editingRole.icon || _jsx(Shield, { className: "h-6 w-6 opacity-10" }) }) :

                  editingRole.icon ? _jsx("img", { src: editingRole.icon, className: "h-8 w-8 object-cover rounded" }) : _jsx(Shield, { className: "h-8 w-8 text-white/20" }) }

                ),
                _jsxs("div", { children: [
                  _jsx("h3", { className: "text-xl font-bold text-white tracking-tight", style: {
                      color: editingRole.gradient ? 'transparent' : 'inherit',
                      backgroundImage: editingRole.gradient || 'none',
                      WebkitBackgroundClip: editingRole.gradient ? 'text' : 'unset',
                      backgroundClip: editingRole.gradient ? 'text' : 'unset'
                    }, children: editingRole.name }),
                  _jsx("p", { className: "text-xs text-[#949ba4] font-medium tracking-wide", children: "Editar configuraci\xF3n del rol" })] }
                )] }
              ),
              _jsx("div", { className: "flex items-center gap-3", children:
                _jsx("button", {
                  onClick: () => {
                    setSelectedRoleId(null);
                    setEditingRole(null);
                    setOriginalRole(null);
                  },
                  className: "p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-[#949ba4]", children:

                  _jsx(X, { className: "h-5 w-5" }) }
                ) }
              )] }
            ),

            _jsx("div", { className: "flex items-center gap-2 mt-8", children:
              [
              { id: 'general', label: 'Especial', icon: Palette },
              { id: 'permissions', label: 'Permisos', icon: Lock },
              { id: 'members', label: 'Miembros', icon: Users }].
              map((tab) =>
              _jsxs("button", {

                onClick: () => setActiveSubTab(tab.id),
                className: cn(
                  "px-4 py-2 text-sm font-bold transition-all rounded-lg flex items-center gap-2",
                  activeSubTab === tab.id ? "bg-white/10 text-white shadow-inner" : "text-[#949ba4] hover:bg-white/5 hover:text-[#dbdee1]"
                ), children: [

                activeSubTab === tab.id && _jsx(tab.icon, { className: "h-3.5 w-3.5" }),
                tab.label] }, tab.id
              )
              ) }
            )] }
          ),


          _jsx("div", { className: "flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 custom-scroll", children:
            activeSubTab === 'general' ?
            _jsxs("div", { className: "max-w-[850px] mx-auto space-y-12 pb-32", children: [


              _jsxs("section", { className: "space-y-6", children: [
                _jsxs("h4", { className: "text-[11px] font-bold uppercase text-[#949ba4] tracking-widest flex items-center gap-2 px-2", children: [
                  _jsx(Palette, { className: "h-3.5 w-3.5" }), " Identidad y Apariencia"] }
                ),

                _jsxs("div", { className: "bg-[#2b2d31] p-8 rounded-2xl border border-white/5 shadow-2xl space-y-8", children: [
                  _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                    _jsxs("div", { className: "space-y-3", children: [
                      _jsx("label", { className: "text-[10px] font-bold text-[#dbdee1] uppercase tracking-widest", children: "Nombre del Rol" }),
                      _jsx("input", {
                        value: editingRole.name,
                        onChange: (e) => setEditingRole({ ...editingRole, name: e.target.value }),
                        className: "w-full bg-[#1e1f22] border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[var(--discord-blurple)]/50 transition-all placeholder:text-[#4e5058]",
                        placeholder: "Ej: Administrador" }
                      )] }
                    ),

                    _jsxs("div", { className: "space-y-3", children: [
                      _jsx("label", { className: "text-[10px] font-bold text-[#dbdee1] uppercase tracking-widest", children: "Icono del Rol" }),
                      _jsxs("div", { className: "flex items-start gap-4", children: [
                        _jsx("div", { className: "h-14 w-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10 text-3xl shadow-inner shrink-0 overflow-hidden group relative", children:
                          editingRole.iconType === 'emoji' ?
                          editingRole.icon || _jsx(Shield, { className: "h-6 w-6 opacity-5" }) :

                          editingRole.icon ? _jsx("img", { src: editingRole.icon, className: "h-full w-full object-cover" }) : _jsx(Shield, { className: "h-6 w-6 opacity-5" }) }

                        ),
                        _jsxs("div", { className: "flex-1 space-y-3", children: [
                          _jsxs("div", { className: "flex gap-1 bg-black/40 p-1 rounded-xl w-fit", children: [
                            _jsx("button", {
                              onClick: () => setEditingRole({ ...editingRole, iconType: 'emoji' }),
                              className: cn("px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all", editingRole.iconType === 'emoji' ? "bg-[#4e5058] text-white shadow-sm" : "text-[#949ba4] hover:text-[#dbdee1]"), children:
                              "Emoji" }),
                            _jsx("button", {
                              onClick: () => setEditingRole({ ...editingRole, iconType: 'url' }),
                              className: cn("px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all", editingRole.iconType === 'url' ? "bg-[#4e5058] text-white shadow-sm" : "text-[#949ba4] hover:text-[#dbdee1]"), children:
                              "URL" })] }
                          ),
                          _jsx("input", {
                            value: editingRole.icon || "",
                            onChange: (e) => setEditingRole({ ...editingRole, icon: e.target.value }),
                            className: "w-full bg-[#1e1f22] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#dbdee1] outline-none hover:border-white/10 transition-colors",
                            placeholder: editingRole.iconType === 'emoji' ? "Pega un emoji..." : "https://link-directo..." }
                          )] }
                        )] }
                      )] }
                    )] }
                  ),


                  _jsxs("div", { className: "space-y-5 pt-4 border-t border-white/5", children: [
                    _jsxs("div", { className: "flex items-center justify-between", children: [
                      _jsx("label", { className: "text-[10px] font-bold text-[#dbdee1] uppercase tracking-widest", children: "Gradiente RGB (Efecto Especial)" }),
                      _jsx("div", { className: "h-4 flex-1 mx-4 rounded-full", style: { backgroundImage: `linear-gradient(${gradAngle}deg, ${gradStart}, ${gradEnd})` } })] }
                    ),

                    _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                      _jsxs("div", { className: "space-y-2", children: [
                        _jsx("p", { className: "text-[10px] text-[#949ba4] font-bold", children: "Color Inicio" }),
                        _jsxs("div", { className: "flex items-center gap-3 bg-[#1e1f22] p-2 rounded-xl border border-white/5", children: [
                          _jsx("input", { type: "color", value: gradStart, onChange: (e) => setGradStart(e.target.value), className: "h-8 w-8 rounded-lg bg-transparent border-none p-0 cursor-pointer shrink-0" }),
                          _jsx("input", { value: gradStart, readOnly: true, className: "flex-1 bg-transparent text-[11px] font-mono text-white/50 outline-none" })] }
                        )] }
                      ),
                      _jsxs("div", { className: "space-y-2", children: [
                        _jsx("p", { className: "text-[10px] text-[#949ba4] font-bold", children: "Color Fin" }),
                        _jsxs("div", { className: "flex items-center gap-3 bg-[#1e1f22] p-2 rounded-xl border border-white/5", children: [
                          _jsx("input", { type: "color", value: gradEnd, onChange: (e) => setGradEnd(e.target.value), className: "h-8 w-8 rounded-lg bg-transparent border-none p-0 cursor-pointer shrink-0" }),
                          _jsx("input", { value: gradEnd, readOnly: true, className: "flex-1 bg-transparent text-[11px] font-mono text-white/50 outline-none" })] }
                        )] }
                      ),
                      _jsxs("div", { className: "space-y-2", children: [
                        _jsxs("div", { className: "flex justify-between", children: [
                          _jsx("p", { className: "text-[10px] text-[#949ba4] font-bold", children: "\xC1ngulo" }),
                          _jsxs("p", { className: "text-[10px] text-white/50", children: [gradAngle, "\xB0"] })] }
                        ),
                        _jsx("input", {
                          type: "range", min: "0", max: "360", value: gradAngle,
                          onChange: (e) => setGradAngle(parseInt(e.target.value)),
                          className: "w-full h-1.5 bg-[#1e1f22] rounded-lg appearance-none cursor-pointer accent-[var(--discord-blurple)]" }
                        )] }
                      )] }
                    ),

                    _jsxs("div", { className: "flex gap-4", children: [
                      _jsx("button", {
                        onClick: handleGenerateGradient,
                        className: "flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-xs font-bold transition-all border border-white/5", children:
                        "Aplicar Gradiente" }

                      ),
                      _jsx("button", {
                        onClick: () => setEditingRole({ ...editingRole, gradient: null }),
                        className: "px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-500/10", children:
                        "Quitar" }

                      )] }
                    )] }
                  )] }
                ),

                _jsxs("div", { className: "bg-[#2b2d31] p-6 rounded-2xl border border-white/5 shadow-inner space-y-4", children: [
                  _jsx("label", { className: "text-[10px] font-bold text-[#dbdee1] uppercase tracking-widest px-2", children: "Color del Rol (S\xF3lido)" }),
                  _jsxs("div", { className: "flex flex-wrap gap-3 px-2", children: [
                    PRESET_COLORS.map((c) =>
                    _jsx("button", {

                      onClick: () => setEditingRole({ ...editingRole, color: c }),
                      className: cn(
                        "h-9 w-9 rounded-full border-2 transition-all hover:scale-110 shadow-lg",
                        editingRole.color === c ? "border-white scale-110 ring-4 ring-white/10" : "border-transparent"
                      ),
                      style: { backgroundColor: c } }, c
                    )
                    ),
                    _jsx("div", { className: "relative h-9 w-9 rounded-full overflow-hidden border-2 border-white/10 hover:border-white/30 transition-all shadow-lg active:scale-95", children:
                      _jsx("input", { type: "color", value: editingRole.color, onChange: (e) => setEditingRole({ ...editingRole, color: e.target.value }), className: "absolute inset-0 h-[300%] w-[300%] -translate-x-1/3 -translate-y-1/3 bg-transparent border-none p-0 cursor-pointer" }) }
                    )] }
                  )] }
                )] }
              ),


              _jsxs("section", { className: "space-y-6", children: [
                _jsxs("h4", { className: "text-[11px] font-bold uppercase text-[#949ba4] tracking-widest flex items-center gap-2 px-2", children: [
                  _jsx(Settings2, { className: "h-3.5 w-3.5" }), " Configuraci\xF3n de Visualizaci\xF3n"] }
                ),
                _jsxs("div", { className: "bg-[#2b2d31] rounded-2xl border border-white/5 divide-y divide-white/5 shadow-2xl overflow-hidden", children: [
                  _jsxs("label", { className: "flex items-center justify-between p-5 hover:bg-white/[0.01] cursor-pointer group select-none transition-colors", children: [
                    _jsxs("div", { className: "space-y-1", children: [
                      _jsx("p", { className: "text-sm font-bold text-[#dbdee1] group-hover:text-white transition-colors", children: "Mostrar miembros por separado (Hoist)" }),
                      _jsx("p", { className: "text-xs text-[#949ba4] max-w-[440px]", children: "Los usuarios que tengan este rol aparecer\xE1n destacados en su propia secci\xF3n en la lista de miembros de la derecha." })] }
                    ),
                    _jsxs("div", { className: "relative inline-block w-11 h-6 shrink-0", children: [
                      _jsx("input", { type: "checkbox", className: "sr-only peer", checked: editingRole.hoist || false, onChange: () => setEditingRole({ ...editingRole, hoist: !editingRole.hoist }) }),
                      _jsx("div", { className: "w-11 h-6 bg-[#4e5058] rounded-full peer peer-checked:bg-[#23a55a] transition-all duration-300" }),
                      _jsx("div", { className: "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 shadow-lg peer-checked:translate-x-5" })] }
                    )] }
                  ),
                  _jsxs("label", { className: "flex items-center justify-between p-5 hover:bg-white/[0.01] cursor-pointer group select-none transition-colors", children: [
                    _jsxs("div", { className: "space-y-1", children: [
                      _jsx("p", { className: "text-sm font-bold text-[#dbdee1] group-hover:text-white transition-colors", children: "Permitir que cualquiera mencione (@rol)" }),
                      _jsx("p", { className: "text-xs text-[#949ba4] max-w-[440px]", children: "Habilita la posibilidad de notificar a todos los miembros que poseen este rol usando el comando de menci\xF3n." })] }
                    ),
                    _jsxs("div", { className: "relative inline-block w-11 h-6 shrink-0", children: [
                      _jsx("input", { type: "checkbox", className: "sr-only peer", checked: editingRole.mentionable || false, onChange: () => setEditingRole({ ...editingRole, mentionable: !editingRole.mentionable }) }),
                      _jsx("div", { className: "w-11 h-6 bg-[#4e5058] rounded-full peer peer-checked:bg-[#23a55a] transition-all duration-300" }),
                      _jsx("div", { className: "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 shadow-lg peer-checked:translate-x-5" })] }
                    )] }
                  )] }
                )] }
              )] }
            ) :
            activeSubTab === 'permissions' ?
            _jsxs("div", { className: "max-w-[850px] mx-auto space-y-8 pb-32", children: [
              _jsxs("div", { className: "flex items-center justify-between px-2", children: [
                _jsxs("h4", { className: "text-[11px] font-bold uppercase text-[#949ba4] tracking-widest flex items-center gap-2", children: [
                  _jsx(Lock, { className: "h-3.5 w-3.5" }), " Permisos Administrativos"] }
                ),
                _jsxs("div", { className: "flex items-center gap-3", children: [
                  _jsxs("button", {
                    onClick: () => handleToggleAllPermissions(true),
                    className: "flex items-center gap-2 text-[10px] font-bold text-[var(--discord-blurple)] hover:underline uppercase tracking-wider", children: [

                    _jsx(CheckSquare, { className: "h-3.5 w-3.5" }), " Activar Todos"] }
                  ),
                  _jsxs("button", {
                    onClick: () => handleToggleAllPermissions(false),
                    className: "flex items-center gap-2 text-[10px] font-bold text-red-400 hover:underline uppercase tracking-wider", children: [

                    _jsx(Square, { className: "h-3.5 w-3.5" }), " Desactivar Todos"] }
                  )] }
                )] }
              ),

              _jsx("div", { className: "space-y-10 bg-[#2b2d31] p-8 rounded-2xl border border-white/5 shadow-2xl", children:
                ['General', 'Administración', 'Membresía', 'Mensajes'].map((category) =>
                _jsxs("div", { className: "space-y-4", children: [
                  _jsx("h5", { className: "text-[10px] font-bold text-[#949ba4] border-b border-white/5 pb-2 uppercase tracking-[0.2em]", children: category }),
                  _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children:
                    permissionsList.filter((p) => p.category === category).map((p) =>
                    _jsxs("label", { className: "flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all group select-none border border-transparent hover:border-white/5", children: [
                      _jsx("span", { className: "text-sm font-semibold text-[#dbdee1] group-hover:text-white transition-colors", children: p.label }),
                      _jsxs("div", { className: "relative inline-block w-10 h-5.5", children: [
                        _jsx("input", { type: "checkbox", className: "sr-only peer", checked: editingRole.permissions?.[p.id] || false, onChange: () => togglePermission(p.id) }),
                        _jsx("div", { className: "w-10 h-5.5 bg-[#4e5058] rounded-full peer peer-checked:bg-[#23a55a] transition-all duration-300 shadow-inner" }),
                        _jsx("div", { className: "absolute left-1 top-1 bg-white w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm peer-checked:translate-x-4.5" })] }
                      )] }, p.id
                    )
                    ) }
                  )] }, category
                )
                ) }
              ),


              _jsxs("section", { className: "pt-12 border-t border-white/5 flex items-center justify-between px-4", children: [
                _jsxs("div", { children: [
                  _jsx("p", { className: "text-sm font-bold text-red-500 uppercase tracking-tighter", children: "Zona Cr\xEDtica" }),
                  _jsx("p", { className: "text-xs text-[#949ba4] font-medium", children: "Borrar un rol es una acci\xF3n irreversible." })] }
                ),
                _jsxs("button", {
                  onClick: () => handleConfirmDelete(editingRole.id),
                  className: "group flex items-center gap-3 text-white bg-red-500/10 hover:bg-red-500 px-8 py-3 rounded-xl font-bold text-sm transition-all border border-red-500/20 active:scale-95 shadow-xl shadow-red-500/5 overflow-hidden relative", children: [

                  _jsx("div", { className: "absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" }),
                  _jsx(Trash2, { className: "h-4 w-4 relative transition-transform group-hover:rotate-12" }),
                  _jsx("span", { className: "relative", children: "Eliminar Rol" })] }
                )] }
              )] }
            ) :

            _jsxs("div", { className: "max-w-[850px] mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-400", children: [
              _jsxs("div", { className: "bg-[#2b2d31] rounded-2xl border border-white/5 p-8 shadow-2xl relative group", children: [
                _jsx(Search, { className: "absolute left-12 top-1/2 -translate-y-1/2 h-5 w-5 text-[#949ba4] group-focus-within:text-[var(--discord-blurple)] transition-colors" }),
                _jsx("input", {
                  value: memberSearch,
                  onChange: (e) => setMemberSearch(e.target.value),
                  placeholder: "Buscar por usuario o apodo...",
                  className: "w-full bg-[#1e1f22] border border-white/10 rounded-2xl px-14 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-[var(--discord-blurple)]/50 outline-none transition-all placeholder:text-[#4e5058] shadow-inner" }
                )] }
              ),

              _jsxs("div", { className: "bg-[#2b2d31] rounded-2xl border border-white/5 overflow-hidden shadow-2xl divide-y divide-white/5", children: [
                filteredMembers.map((m) => {
                  const mId = m.userId || m.id;
                  const hasThisRole = (m.roleIds || []).includes(selectedRoleId);
                  return (
                    _jsxs("div", { className: "flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors group", children: [
                      _jsxs("div", { className: "flex items-center gap-4", children: [
                        _jsx(UserAvatar, { participant: m, size: 11 }),
                        _jsxs("div", { children: [
                          _jsx("div", { className: "text-sm font-bold text-white group-hover:text-[var(--discord-blurple)] transition-colors", children: m.displayName || m.username }),
                          _jsxs("div", { className: "text-xs text-[#949ba4] font-medium tracking-wide", children: ["@", m.username] })] }
                        )] }
                      ),
                      _jsx("button", {
                        onClick: () => handleToggleMemberRole(mId),
                        className: cn(
                          "px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg",
                          hasThisRole ?
                          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white" :
                          "bg-[var(--discord-blurple)] text-white hover:bg-[#4752c4] shadow-[#5865f2]/20"
                        ), children:

                        hasThisRole ? "Quitar del Rol" : "Añadir al Rol" }
                      )] }, mId
                    ));

                }),
                filteredMembers.length === 0 &&
                _jsxs("div", { className: "py-24 text-center space-y-6", children: [
                  _jsx("div", { className: "h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-inner", children:
                    _jsx(Search, { className: "h-10 w-10 text-[#4e5058]" }) }
                  ),
                  _jsx("p", { className: "text-sm font-bold text-[#949ba4] tracking-wide", children: "No encontramos a ning\xFAn miembro con ese nombre." })] }
                )] }

              )] }
            ) }

          ),


          _jsx(AnimatePresence, { children:
            hasChanges &&
            _jsx(motion.div, {
              initial: { y: 100, opacity: 0 },
              animate: { y: 0, opacity: 1 },
              exit: { y: 100, opacity: 0 },
              className: "absolute bottom-6 left-6 right-6 z-50", children:

              _jsxs("div", { className: "bg-[#111214] rounded-xl p-4 flex items-center justify-between shadow-[0_-8px_20px_rgba(0,0,0,0.4)] border border-white/5", children: [
                _jsx("p", { className: "text-sm font-bold text-white pl-2", children: "\xA1Cuidado! Tienes cambios sin guardar." }),
                _jsxs("div", { className: "flex items-center gap-4", children: [
                  _jsx("button", {
                    onClick: handleReset,
                    disabled: saving,
                    className: "text-sm font-medium text-white hover:underline disabled:opacity-50", children:
                    "Descartar" }

                  ),
                  _jsxs("button", {
                    onClick: handleSaveRole,
                    disabled: saving,
                    className: "flex items-center gap-2 rounded-lg bg-[#23a55a] px-6 py-2 text-sm font-bold text-white hover:bg-[#1a7f45] transition-all disabled:opacity-50 shadow-lg shadow-green-500/10 active:scale-95", children: [

                    saving && _jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Guardar Cambios"] }

                  )] }
                )] }
              ) }
            ) }

          )] }
        ) :

        _jsxs("div", { className: "h-full flex flex-col items-center justify-center opacity-40 text-center space-y-8 animate-in zoom-in-95 duration-500", children: [
          _jsxs("div", { className: "relative", children: [
            _jsx(Shield, { className: "h-32 w-32 text-[#4e5058]" }),
            _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 bg-[var(--discord-blurple)]/10 rounded-full blur-[60px]" })] }
          ),
          _jsxs("div", { className: "max-w-[340px] space-y-3", children: [
            _jsx("p", { className: "text-xl font-bold text-white tracking-tight", children: "Personaliza la Jerarqu\xEDa" }),
            _jsx("p", { className: "text-sm text-[#949ba4] leading-relaxed font-medium", children: "Selecciona un rol de la barra lateral para empezar a configurar su apariencia visual y permisos administrativos." })] }
          )] }
        ) }

      ),

      _jsx("style", { jsx: true, children: `
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      ` })] }
    ));

}