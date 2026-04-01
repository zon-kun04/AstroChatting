"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  X, Loader2, Settings, Users, Bell,
  Lock, LogOut, Trash2, Link, ClipboardList, Shield, Webhook, UserX, UserCheck } from

"lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


import { OverviewTab } from "./group-settings/OverviewTab";
import { MembersTab } from "./group-settings/MembersTab";
import { PermissionsTab } from "./group-settings/PermissionsTab";
import { InvitesTab } from "./group-settings/InvitesTab";
import { AuditLogTab } from "./group-settings/AuditLogTab";
import { RolesTab } from "./group-settings/RolesTab";
import { BansTab } from "./group-settings/BansTab";
import { JoinRequestsTab } from "./group-settings/JoinRequestsTab";
import { WebhooksTab } from "./group-settings/WebhooksTab";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";









export function GroupSettingsModal({ groupId, onClose, onUpdated }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showMobileContent, setShowMobileContent] = useState(false);


  const [group, setGroup] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(() => {
    if (typeof window === 'undefined') return "";
    const email = localStorage.getItem("auth_active_email");
    const accounts = JSON.parse(localStorage.getItem("auth_accounts") || "[]");
    const acc = accounts.find((a) => a.email === email);
    return acc ? acc.id : "";
  });


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [accentColor, setAccentColor] = useState("#5865f2");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [invitePermission, setInvitePermission] = useState("member");
  const [editGroupInfo, setEditGroupInfo] = useState("admin");
  const [manageMembers, setManageMembers] = useState("admin");
  const [deleteMessages, setDeleteMessages] = useState("admin");
  const [pinMessages, setPinMessages] = useState("admin");
  const [mentionEveryone, setMentionEveryone] = useState("member");
  const [sendMessages, setSendMessages] = useState("member");
  const [sendMedia, setSendMedia] = useState("member");
  const [showJoinLeaveMessages, setShowJoinLeaveMessages] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedLogUserId, setSelectedLogUserId] = useState(null);


  const [requireJoinRequest, setRequireJoinRequest] = useState(false);
  const [joinQuestion, setJoinQuestion] = useState("");
  const [vanityUrl, setVanityUrl] = useState("");

  const loadData = useCallback(async () => {
    if (!group) setLoading(true);
    try {
      const g = await api.get(`/groups/${groupId}`);
      setGroup(g);
      setName(g.name || "");
      setDescription(g.description || "");
      setAccentColor(g.accentColor || "#5865f2");
      setInvitePermission(g.config?.invitePermission || "member");
      setEditGroupInfo(g.config?.editGroupInfo || "admin");
      setManageMembers(g.config?.manageMembers || "admin");
      setDeleteMessages(g.config?.deleteMessages || "admin");
      setPinMessages(g.config?.pinMessages || "admin");
      setMentionEveryone(g.config?.mentionEveryone || "member");
      setSendMessages(g.config?.sendMessages || "member");
      setSendMedia(g.config?.sendMedia || "member");
      setShowJoinLeaveMessages(g.config?.showJoinLeaveMessages !== false);

      setRequireJoinRequest(!!g.config?.requireJoinRequest);
      setJoinQuestion(g.config?.joinQuestion || "");
      setVanityUrl(g.vanityUrl || "");

      setRemoveAvatar(false);
      setRemoveBanner(false);
    } catch (e) {
      toast.error("Error al cargar el grupo");
      onClose();
    } finally {
      setLoading(false);
    }
  }, [groupId, onClose]);

  useEffect(() => {
    loadData();
  }, [groupId, loadData]);

  const hasChanges = useMemo(() => {
    if (!group) return false;
    return name !== group.name ||
    description !== (group.description || "") ||
    accentColor !== (group.accentColor || "#5865f2") ||
    invitePermission !== (group.config?.invitePermission || "member") ||
    editGroupInfo !== (group.config?.editGroupInfo || "admin") ||
    manageMembers !== (group.config?.manageMembers || "admin") ||
    deleteMessages !== (group.config?.deleteMessages || "admin") ||
    pinMessages !== (group.config?.pinMessages || "admin") ||
    mentionEveryone !== (group.config?.mentionEveryone || "member") ||
    sendMessages !== (group.config?.sendMessages || "member") ||
    sendMedia !== (group.config?.sendMedia || "member") ||
    showJoinLeaveMessages !== (group.config?.showJoinLeaveMessages !== false) ||
    requireJoinRequest !== !!group.config?.requireJoinRequest ||
    joinQuestion !== (group.config?.joinQuestion || "") ||
    vanityUrl !== (group.vanityUrl || "") ||
    !!avatarFile || !!bannerFile ||
    removeAvatar || removeBanner;
  }, [group, name, description, accentColor, avatarFile, bannerFile, invitePermission, editGroupInfo, manageMembers, deleteMessages, pinMessages, mentionEveryone, sendMessages, sendMedia, removeAvatar, removeBanner, requireJoinRequest, joinQuestion, vanityUrl, showJoinLeaveMessages]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleReset = () => {
    if (!group) return;
    setName(group.name || "");
    setDescription(group.description || "");
    setAccentColor(group.accentColor || "#5865f2");
    setInvitePermission(group.config?.invitePermission || "member");
    setEditGroupInfo(group.config?.editGroupInfo || "admin");
    setManageMembers(group.config?.manageMembers || "admin");
    setDeleteMessages(group.config?.deleteMessages || "admin");
    setPinMessages(group.config?.pinMessages || "admin");
    setMentionEveryone(group.config?.mentionEveryone || "member");
    setSendMessages(group.config?.sendMessages || "member");
    setSendMedia(group.config?.sendMedia || "member");
    setShowJoinLeaveMessages(group.config?.showJoinLeaveMessages !== false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setBannerFile(null);
    setBannerPreview(null);
    setRemoveAvatar(false);
    setRemoveBanner(false);
    setRequireJoinRequest(!!group.config?.requireJoinRequest);
    setJoinQuestion(group.config?.joinQuestion || "");
    setVanityUrl(group.vanityUrl || "");
    setOpenDropdown(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/groups/${groupId}`, {
        name,
        description,
        accentColor,
        removeAvatar,
        removeBanner,
        vanityUrl,
        requireJoinRequest,
        joinQuestion,
        config: {
          invitePermission,
          editGroupInfo,
          manageMembers,
          deleteMessages,
          pinMessages,
          mentionEveryone,
          sendMessages,
          sendMedia,
          showJoinLeaveMessages
        }
      });

      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        await api.post(`/groups/${groupId}/avatar`, fd);
      }

      if (bannerFile) {
        const fd = new FormData();
        fd.append("banner", bannerFile);
        await api.post(`/groups/${groupId}/banner`, fd);
      }

      toast.success("Ajustes guardados");
      onUpdated?.();
      loadData();
      setAvatarFile(null);
      setAvatarPreview(null);
      setBannerFile(null);
      setBannerPreview(null);
      setRemoveAvatar(false);
      setRemoveBanner(false);
    } catch (e) {
      toast.error(e.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleTransferOwnership = async (userId) => {
    if (!confirm("¿Seguro que quieres transferir la propiedad? Dejarás de ser el dueño.")) return;
    try {
      await api.post(`/groups/${groupId}/transfer-ownership`, { newOwnerId: userId });
      toast.success("Propiedad transferida");
      loadData();
      onUpdated?.();
    } catch (e) {toast.error(e.message);}
  };

  const handleKick = async (userId) => {
    if (!confirm("¿Expulsar a este miembro?")) return;
    try {
      await api.delete(`/groups/${groupId}/members/${userId}`);
      toast.success("Miembro expulsado");
      loadData();
      onUpdated?.();
    } catch (e) {toast.error(e.message);}
  };

  const handleResetPermissions = () => {
    setInvitePermission("member");
    setEditGroupInfo("admin");
    setManageMembers("admin");
    setDeleteMessages("admin");
    setPinMessages("admin");
    setMentionEveryone("member");
    setSendMessages("member");
    setSendMedia("member");
    setShowJoinLeaveMessages(false);
    toast.info("Permisos restablecidos a los valores predeterminados");
  };

  const handleDeleteGroup = async () => {
    if (!confirm("¿ESTÁS COMPLETAMENTE SEGURO? Esta acción borrará el grupo para siempre.")) return;
    try {
      await api.delete(`/groups/${groupId}`);
      toast.success("Grupo eliminado");
      onClose();
      onUpdated?.();
      window.location.reload();
    } catch (e) {toast.error(e.message);}
  };

  const isOwner = group?.ownerId === currentUserId;

  if (loading) return (
    _jsx("div", { className: "fixed inset-0 z-[200] flex items-center justify-center bg-[#313338]", children:
      _jsxs("div", { className: "flex flex-col items-center gap-4", children: [
        _jsx(Loader2, { className: "h-10 w-10 animate-spin text-[var(--discord-blurple)]" }),
        _jsx("p", { className: "text-sm font-medium text-[var(--muted-foreground)] animate-pulse", children: "Cargando ajustes..." })] }
      ) }
    ));


  const SIDEBAR_ITEMS = [
  { id: "overview", label: "Vista General", icon: Settings },
  { id: "roles", label: "Roles", icon: Shield, ownerOnly: true },
  { id: "members", label: "Miembros", icon: Users },
  { id: "join_requests", label: "Solicitudes", icon: UserCheck, adminLevel: true },
  { id: "bans", label: "Baneados", icon: UserX, adminLevel: true },
  { id: "permissions", label: "Permisos", icon: Lock, ownerOnly: true },
  { id: "invites", label: "Invitaciones", icon: Link, adminLevel: true },
  { id: "webhooks", label: "Webhooks", icon: Webhook, adminLevel: true },
  { id: "audit_log", label: "Historial", icon: ClipboardList, adminLevel: true },
  { id: "notifications", label: "Notificaciones", icon: Bell }];


  return (
    _jsxs("div", { className: "fixed inset-0 z-[200] flex flex-col md:flex-row overflow-hidden bg-[var(--discord-chat)] animate-in fade-in duration-200", children: [


      _jsxs("div", { className: cn(
          "w-full md:w-[240px] flex-shrink-0 flex-col bg-[#2b2d31] py-12 px-6 md:pr-2 transition-all",
          showMobileContent ? "hidden md:flex" : "flex h-full"
        ), children: [

        _jsx("button", {
          onClick: onClose,
          className: "md:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-white/5", children:

          _jsx(X, { className: "h-6 w-6 text-[#b5bac1]" }) }
        ),
        _jsx("div", { className: "mb-4 px-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]", children: "Ajustes de Grupo" }

        ),
        SIDEBAR_ITEMS.map((item) => {
          if (item.ownerOnly && !isOwner) return null;

          const isAdmin = group?.members?.find((m) => m.userId === currentUserId)?.role === "admin";
          if (item.adminLevel && !isOwner && !isAdmin) return null;

          const active = activeTab === item.id;
          return (
            _jsxs("button", {

              onClick: () => {
                setActiveTab(item.id);
                setShowMobileContent(true);
              },
              className: cn(
                "mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                active ?
                "bg-[#3f4147] text-white" :
                "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
              ), children: [

              _jsx(item.icon, { className: "h-4 w-4" }),
              item.label] }, item.id
            ));

        }),

        _jsx("div", { className: "my-2 h-px bg-white/5 mx-2" }),

        isOwner &&
        _jsxs("button", {
          onClick: handleDeleteGroup,
          className: "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors", children: [

          _jsx(Trash2, { className: "h-4 w-4" }), "Eliminar Grupo"] }

        ),


        _jsxs("button", {
          onClick: onClose,
          className: "mt-auto flex items-center gap-2.5 rounded-md border border-white/10 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-white/5 transition-colors", children: [

          _jsx(LogOut, { className: "h-4 w-4" }), "Cerrar"] }

        )] }
      ),


      _jsxs("div", { className: cn(
          "relative flex flex-1 flex-col overflow-y-auto px-6 md:px-10 py-12 scrollbar-thin scrollbar-thumb-white/10",
          showMobileContent ? "flex" : "hidden md:flex"
        ), children: [

        _jsxs("button", {
          onClick: () => setShowMobileContent(false),
          className: "md:hidden flex items-center gap-2 mb-6 text-[#b5bac1] hover:text-white transition-colors", children: [

          _jsx(Loader2, { className: "h-4 w-4 rotate-90" }), " ",
          _jsx("span", { className: "text-sm font-bold uppercase tracking-wider", children: "Ajustes" })] }
        ),
        _jsxs("div", { className: "w-full max-w-[1000px] transition-all duration-300", children: [

          activeTab === "overview" &&
          _jsx(OverviewTab, {
            name: name, setName: setName,
            description: description, setDescription: setDescription,
            accentColor: accentColor, setAccentColor: setAccentColor,
            avatarPreview: avatarPreview, bannerPreview: bannerPreview,
            group: group,
            handleAvatarChange: handleAvatarChange,
            handleBannerChange: handleBannerChange,
            removeAvatar: removeAvatar, setRemoveAvatar: setRemoveAvatar,
            removeBanner: removeBanner, setRemoveBanner: setRemoveBanner,
            setAvatarFile: setAvatarFile, setAvatarPreview: setAvatarPreview,
            setBannerFile: setBannerFile, setBannerPreview: setBannerPreview,
            requireJoinRequest: requireJoinRequest, setRequireJoinRequest: setRequireJoinRequest,
            joinQuestion: joinQuestion, setJoinQuestion: setJoinQuestion,
            vanityUrl: vanityUrl, setVanityUrl: setVanityUrl }
          ),


          activeTab === "members" &&
          _jsx(MembersTab, {
            groupId: groupId,
            group: group,
            currentUserId: currentUserId,
            isOwner: isOwner,
            handleTransferOwnership: handleTransferOwnership,
            handleKick: handleKick,
            onTabChange: setActiveTab,
            setSelectedLogUserId: setSelectedLogUserId,
            onUpdate: loadData }
          ),


          activeTab === "permissions" && isOwner &&
          _jsx(PermissionsTab, {
            invitePermission: invitePermission, setInvitePermission: setInvitePermission,
            editGroupInfo: editGroupInfo, setEditGroupInfo: setEditGroupInfo,
            manageMembers: manageMembers, setManageMembers: setManageMembers,
            deleteMessages: deleteMessages, setDeleteMessages: setDeleteMessages,
            pinMessages: pinMessages, setPinMessages: setPinMessages,
            mentionEveryone: mentionEveryone, setMentionEveryone: setMentionEveryone,
            sendMessages: sendMessages, setSendMessages: setSendMessages,
            sendMedia: sendMedia, setSendMedia: setSendMedia,
            showJoinLeaveMessages: showJoinLeaveMessages, setShowJoinLeaveMessages: setShowJoinLeaveMessages,
            openDropdown: openDropdown, setOpenDropdown: setOpenDropdown,
            handleResetPermissions: handleResetPermissions }
          ),


          activeTab === "invites" &&
          _jsx(InvitesTab, { groupId: groupId }),


          activeTab === "audit_log" &&
          _jsx(AuditLogTab, {
            groupId: groupId,
            filterUserId: selectedLogUserId,
            onClearFilter: () => setSelectedLogUserId(null) }
          ),


          activeTab === "roles" && isOwner &&
          _jsx(RolesTab, { groupId: groupId, group: group, onUpdateGroup: loadData }),


          activeTab === "bans" &&
          _jsx(BansTab, { groupId: groupId }),


          activeTab === "join_requests" &&
          _jsx(JoinRequestsTab, { groupId: groupId }),


          activeTab === "webhooks" &&
          _jsx(WebhooksTab, { groupId: groupId }),


          activeTab === "notifications" &&
          _jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40", children: [
            _jsx(Bell, { className: "h-12 w-12 text-[var(--muted-foreground)]" }),
            _jsx("p", { className: "text-sm font-medium", children: "Pr\xF3ximamente: Ajustes de notificaciones por grupo" })] }
          )] }


        )] }
      ),


      hasChanges &&
      _jsxs("div", { className: "fixed bottom-6 left-[280px] right-10 z-[210] flex items-center justify-between rounded-lg bg-[#111214] p-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300", children: [
        _jsx("p", { className: "text-sm font-semibold text-white", children: "\xA1Cuidado! \u2014 tienes cambios sin guardar." }),
        _jsxs("div", { className: "flex items-center gap-4", children: [
          _jsx("button", {
            onClick: handleReset,
            disabled: saving,
            className: "text-sm font-medium text-white hover:underline disabled:opacity-50", children:
            "Descartar" }

          ),
          _jsxs("button", {
            onClick: handleSave,
            disabled: saving,
            className: "flex items-center gap-2 rounded bg-[#23a55a] px-4 py-1.5 text-sm font-bold text-white hover:bg-[#1a7f45] transition-colors disabled:opacity-50", children: [

            saving && _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), "Guardar Cambios"] }

          )] }
        )] }
      ),



      _jsxs("div", { className: "fixed top-12 right-12 flex flex-col items-center gap-2", children: [
        _jsx("button", { onClick: onClose,
          className: "group flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#b5bac1] transition-all hover:border-white", children:
          _jsx(X, { className: "h-5 w-5 text-[#b5bac1] group-hover:text-white" }) }
        ),
        _jsx("span", { className: "text-[13px] font-bold text-[#b5bac1] select-none", children: "ESC" })] }
      )] }

    ));

}