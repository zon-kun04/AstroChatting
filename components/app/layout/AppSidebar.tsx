"use client";



import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserStatusPanel } from "@/components/app/user/UserStatusPanel";
import { DmContextMenu, GroupContextMenu, FolderContextMenu, useContextMenu } from "@/components/app/layout/ContextMenu";
import { ChatPanel } from "@/components/app/sidebar/ChatPanel";
import { CreateGroupModal } from "@/components/app/sidebar/modals/CreateGroupModal";
import { NewDmModal } from "@/components/app/sidebar/modals/NewDmModal";

import { ManageFoldersModal } from "@/components/app/sidebar/modals/ManageFoldersModal";
import { AddToFolderModal } from "@/components/app/sidebar/modals/AddToFolderModal";
import { useChats, useGroups, usePendingFriends, markAsRead } from "@/components/app/sidebar/hooks";
import { useServers } from "@/hooks/use-servers";
import { ServerPanel } from "@/components/app/sidebar/ServerPanel";
import { api } from "@/lib/api";
import { getActiveAccount } from "@/lib/auth";

import { useLayout } from "./AppLayout";

import { MessageSquare, Users, Settings, Plus, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
"@/components/ui/alert-dialog";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

const MIN_W = 180,MAX_W = 400,DEFAULT_W = 240;

function RailBtn({ icon, label, active, badge, onClick, onContextMenu, dataTour


}) {
  return (
    _jsx(TooltipProvider, { delayDuration: 100, children:
      _jsxs(Tooltip, { children: [
        _jsx(TooltipTrigger, { asChild: true, children:
          _jsxs("div", { className: "group relative flex items-center justify-center mb-2 px-3", children: [

            _jsx("div", { className: cn(
                "absolute left-0 w-1.5 rounded-r-full bg-white transition-all duration-300 transform -translate-x-1",
                active ? "h-10 opacity-100 translate-x-0" : "h-0 opacity-0 group-hover:h-5 group-hover:opacity-100 group-hover:translate-x-0"
              ) }),

            _jsxs("button", {
              onClick: onClick,
              onContextMenu: onContextMenu,
              "data-tour": dataTour,
              className: cn(
                "relative flex h-12 w-12 items-center justify-center transition-all duration-200",
                active ?
                "rounded-[16px] bg-[var(--discord-blurple)] text-white shadow-md" :
                "rounded-[24px] bg-[#313338] text-[var(--muted-foreground)] hover:rounded-[16px] hover:bg-[var(--discord-blurple)] hover:text-white"
              ), children: [
              icon,
              !!badge &&
              _jsx("div", { className: "absolute -bottom-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ed4245] px-1 text-[10px] font-bold text-white ring-4 ring-[#1e1f22]", children:
                badge > 99 ? "99+" : badge }
              )] }

            )] }
          ) }
        ),
        _jsx(TooltipContent, { side: "right", sideOffset: 12,
          className: "text-white text-[13px] font-bold px-3 py-1.5 shadow-2xl", children:
          label }
        )] }
      ) }
    ));

}

function RailDivider() {
  return _jsx("div", { className: "mx-auto my-0.5 h-0.5 w-8 rounded-full bg-white/10" });
}

const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001");
const assetUrl = (p) => p ? p.startsWith('http') ? p : `${BACKEND}${p.startsWith('/') ? '' : '/'}${p}` : null;

const FolderIconPreview = ({ folder, chats, groups }) => {
  const items = folder.chatIds.map((id) => {
    return chats.find((c) => id === c.id) || groups.find((g) => id === g.id);
  }).filter(Boolean).slice(0, 4);

  return (
    _jsxs("div", { className: "grid grid-cols-2 gap-1 p-1 h-full w-full overflow-hidden rounded-[16px] bg-[#313338] ring-1 ring-white/5 transition-all group-hover:bg-[#35373c]", children: [
      items.map((item, i) => {
        const avatar = item.type === 'dm' ? item.participant?.avatar : item.avatar;
        const name = item.type === 'dm' ? item.participant?.displayName || item.participant?.username || "?" : item.name || "?";
        return (
          _jsx("div", { className: "relative h-full w-full rounded-full overflow-hidden bg-[var(--discord-blurple)]", children:
            avatar ?
            _jsx("img", { src: assetUrl(avatar) || undefined, alt: "", className: "h-full w-full object-cover" }) :

            _jsx("span", { className: "flex h-full w-full items-center justify-center text-[5px] font-bold text-white uppercase", children:
              name[0] }
            ) }, `${item.id}-${i}`

          ));

      }),
      [...Array(Math.max(0, 4 - items.length))].map((_, i) =>
      _jsx("div", { className: "h-full w-full rounded-full bg-white/[0.05]" }, `empty-${i}`)
      )] }
    ));

};













export function AppSidebar({
  activeView, activeChatId,
  onViewChange, onChatSelect, onOverlayOpen,
  onProfileClick, onReport, onBlock, onOpenGroupSettings
}) {
  const [panelW, setPanelW] = useState(DEFAULT_W);
  const [showGroup, setShowGroup] = useState(false);
  const [showDm, setShowDm] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(DEFAULT_W);
  const ctx = useContextMenu();
  const { setMobileMenuOpen } = useLayout();
  const [isMobileMode, setIsMobileMode] = useState(false);

  useEffect(() => {
    const check = () => setIsMobileMode(window.innerWidth < 768);
    check();window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleViewChange = useCallback((view) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  }, [onViewChange, setMobileMenuOpen]);

  const handleOverlayOpen = useCallback((overlay) => {
    onOverlayOpen(overlay);
    setMobileMenuOpen(false);
  }, [onOverlayOpen, setMobileMenuOpen]);

  const [selectedFolderId, setSelectedFolderId] = useState("all");
  const [expandedFolderIds, setExpandedFolderIds] = useState(new Set());
  const [showManageFolders, setShowManageFolders] = useState(false);

  const handleAddChatToFolder = async (folderId, chatId) => {
    try {
      await api.patch(`/folders/${folderId}/chats`, { chatId, action: 'add' });
      rc();
      toast.success("Añadido a la carpeta");
    } catch (e) {
      toast.error("No se pudo añadir a la carpeta");
    }
  };

  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteFolder = async (id, x, y) => {
    setDeletingId(id);


    setTimeout(async () => {
      if (x !== undefined && y !== undefined) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
          colors: ["#5865f2", "#ffffff", "#ed4245"],
          gravity: 1.2,
          scalar: 0.7,
          startVelocity: 20
        });
      }

      try {
        await api.delete(`/folders/${id}`);
        rc();
        if (selectedFolderId === id) setSelectedFolderId("all");
        toast.success("Carpeta eliminada");
      } catch (e) {
        toast.error("Error al eliminar la carpeta");
      } finally {
        setDeletingId(null);
      }
    }, 300);
  };

  const handleRemoveFromFolder = async (folderId, chatId) => {
    try {
      await api.patch(`/folders/${folderId}/chats`, { chatId, action: 'remove' });
      rc();
      toast.success("Eliminado de la carpeta");
    } catch (e) {
      toast.error("No se pudo eliminar de la carpeta");
    }
  };
  const [addToFolderData, setAddToFolderData] = useState(null);

  const [confirmData, setConfirmData] = useState(



    null);

  const { chats, folders, loading: cl, refetch: rc } = useChats();
  const { groups, loading: gl, refetch: rg } = useGroups();
  const { servers, loading: sl, refetch: rs } = useServers();
  const pending = usePendingFriends();

  const activeAccount = getActiveAccount();
  const currentUserId = activeAccount?.id ?? "";

  const dms = chats.filter((c) => c.type === "dm");
  const loading = cl || gl;

  const [activeServerId, setActiveServerId] = useState(null);



  const totalUnread =
  chats.reduce((s, c) => readIds.has(c.id) ? s : s + (c.unreadCount || 0), 0) +
  groups.reduce((s, g) => readIds.has(g.id) ? s : s + (g.unreadCount || 0), 0);


  const handleChatSelect = useCallback((id, messageId = null) => {
    console.log(`[Sidebar:Debug] Selecting chat: ${id} with message: ${messageId}`);
    setReadIds((prev) => new Set(prev).add(id));
    const isGroup = groups.some((g) => g.id === id);
    console.log(`[Sidebar:Debug] Calling markAsRead for ${id} (isGroup: ${isGroup})`);
    markAsRead(id, isGroup ? "group" : "dm");
    onChatSelect(id, messageId);
    setMobileMenuOpen(false);
  }, [groups, onChatSelect, setMobileMenuOpen]);


  const onMouseDown = useCallback((e) => {
    dragging.current = true;startX.current = e.clientX;startW.current = panelW;
    document.body.style.cursor = "ew-resize";document.body.style.userSelect = "none";
  }, [panelW]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      setPanelW(Math.min(MAX_W, Math.max(MIN_W, startW.current + e.clientX - startX.current)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {window.removeEventListener("mousemove", onMove);window.removeEventListener("mouseup", onUp);};
  }, []);


  const handleLeaveGroup = useCallback(async (groupId) => {
    try {
      await api.post(`/groups/${groupId}/leave`);
      rg();
      toast.success("Has abandonado el grupo");
    } catch (e) {toast.error(e.message);}
  }, [rg]);

  const handleDeleteGroup = useCallback(async (groupId) => {
    setConfirmData({
      title: "¿Eliminar este grupo?",
      description: "Esta acción no se puede deshacer. Se borrarán todos los mensajes y miembros.",
      onConfirm: async () => {
        try {
          await api.delete(`/groups/${groupId}`);
          rg();
          toast.success("Grupo eliminado correctamente");
        } catch (e) {toast.error(e.message);}
      }
    });
  }, [rg]);

  const handleCopyInvite = useCallback(async (groupId) => {
    try {
      const d = await api.post(`/groups/${groupId}/invite`);
      const code = d.invite.code;
      const link = `astro/invite/${code}`;
      await navigator.clipboard.writeText(link);
      toast.success("Enlace de invitación copiado al portapapeles");
    } catch (e) {toast.error("No se pudo crear la invitación");}
  }, []);

  return (
    _jsxs(_Fragment, { children: [
      _jsxs("div", { className: "flex h-full", children: [


        _jsxs("div", { className: "flex w-[72px] flex-shrink-0 flex-col items-center gap-2 bg-[var(--discord-darker)] py-3", children: [
          _jsx(RailBtn, {
            icon: _jsx("span", { className: "text-lg font-black tracking-tight", children: "V" }),
            label: "Inicio", active: activeView === "friends",
            onClick: () => onViewChange("friends") }
          ),
          _jsx(RailDivider, {}),
          _jsx(RailBtn, {
            icon: _jsx(MessageSquare, { className: "h-5 w-5" }),
            label: "Mensajes directos",
            badge: totalUnread,
            active: !activeServerId && selectedFolderId === "all",
            dataTour: "sidebar-chats",
            onClick: () => {
              setActiveServerId(null);
              setSelectedFolderId("all");
            } }
          ),

          folders.map((f) => {
            const isExpanded = expandedFolderIds.has(f.id);
            return (
              _jsxs(motion.div, {

                animate: deletingId === f.id ? { x: [-2, 2, -2, 2, 0], scale: [1, 1.05, 0.95, 1], transition: { duration: 0.2, repeat: Infinity } } : {},
                className: cn(
                  "flex flex-col items-center gap-2 w-[64px] transition-all duration-300 rounded-[28px] overflow-hidden",
                  isExpanded ? "bg-white/10 py-2 mb-2 ring-1 ring-white/10" : "py-0 mb-1"
                ),
                onDragOver: (e) => e.preventDefault(),
                onDrop: (e) => {
                  const cid = e.dataTransfer.getData("chatId");
                  if (cid) handleAddChatToFolder(f.id, cid);
                }, children: [

                _jsx(RailBtn, {
                  icon: isExpanded ? _jsx(FolderOpen, { className: "h-6 w-6 text-white" }) : _jsx(FolderIconPreview, { folder: f, chats: chats, groups: groups }),
                  label: f.name,
                  active: !activeServerId && selectedFolderId === f.id,
                  onClick: () => {
                    const next = new Set();
                    if (expandedFolderIds.has(f.id)) {
                      setSelectedFolderId("all");
                    } else {
                      next.add(f.id);
                      setSelectedFolderId(f.id);
                    }
                    setExpandedFolderIds(next);
                    setActiveServerId(null);
                  },
                  onContextMenu: (e) => ctx.openFolder(e, f.id, f.name) }
                ),

                _jsx(AnimatePresence, { children:
                  isExpanded &&
                  _jsx(motion.div, {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: "auto", opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    className: "flex flex-col gap-3 items-center overflow-hidden w-full px-1 py-4 mb-2", children:

                    f.chatIds.map((cid) => {
                      const chat = chats.find((c) => c.id === cid) || groups.find((g) => g.id === cid);
                      if (!chat) return null;
                      const avatarPath = chat.type === 'dm' ? chat.participant?.avatar : chat.avatar;
                      const name = chat.type === 'dm' ? chat.participant?.displayName || chat.participant?.username || "DM" : chat.name;
                      return (
                        _jsxs("button", {

                          draggable: true,
                          onDragStart: (e) => {
                            e.dataTransfer.setData("chatId", cid);
                            e.dataTransfer.effectAllowed = "move";
                          },
                          onContextMenu: (e) => {
                            if (chat.type === 'dm') {
                              ctx.openDm(e, chat.id, chat.participant.uuid, name, {
                                avatar: avatarPath,
                                status: chat.participant?.status,
                                folderId: f.id
                              });
                            } else {
                              ctx.openGroup(e, chat.id, chat.name, chat.ownerId === currentUserId, f.id);
                            }
                          },
                          onClick: () => handleChatSelect(cid),
                          className: cn(
                            "group/sub relative h-11 w-11 rounded-full overflow-hidden transition-all duration-200 hover:rounded-xl ring-2 ring-transparent",
                            activeChatId === cid ? "rounded-xl ring-[var(--discord-blurple)]" : "hover:ring-white/20"
                          ), children: [

                          _jsxs(Avatar, { className: "h-full w-full pointer-events-none", children: [
                            _jsx(AvatarImage, { src: avatarPath ? assetUrl(avatarPath) : undefined }),
                            _jsx(AvatarFallback, { className: "text-sm bg-[#1e1f22] font-bold text-white uppercase", children: name?.[0] })] }
                          ),


                          _jsxs("div", { className: "absolute left-[64px] top-1/2 -translate-y-1/2 hidden group-hover/sub:block bg-[#111214] text-white text-[10px] font-bold px-3 py-1.5 rounded-md whitespace-nowrap z-[100] pointer-events-none shadow-[0_4px_12px_rgba(0,0,0,0.8)] border border-white/10 animate-in fade-in slide-in-from-left-2 duration-150", children: [
                            _jsx("div", { className: "absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#111214] rotate-45 border-l border-b border-white/10" }),
                            name] }
                          ),


                          activeChatId === cid &&
                          _jsx("div", { className: "absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" })] }, cid

                        ));

                    }) }
                  ) }

                )] }, f.id
              ));

          }),

          _jsx(RailBtn, {
            icon: _jsx(Plus, { className: "h-4 w-4" }),
            label: "Gestionar carpetas",
            onClick: () => setShowManageFolders(true) }
          ),

          _jsx(RailDivider, {}),

          servers.map((s) =>
          _jsx(RailBtn, {
            icon:
            _jsxs(Avatar, { className: "h-full w-full rounded-[inherit]", children: [
              _jsx(AvatarImage, { src: s.avatar ?? undefined, alt: s.name }),
              _jsx(AvatarFallback, { className: "rounded-[inherit] bg-[var(--discord-blurple)] text-white text-xs", children:
                s.name?.[0]?.toUpperCase() || "S" }
              )] }
            ),

            label: s.name,
            active: activeServerId === s.id,
            onClick: () => {
              setActiveServerId(s.id);
              setMobileMenuOpen(false);
            } }, s.id
          )
          ),

          _jsx(RailBtn, { icon: _jsx(Plus, { className: "h-5 w-5" }), label: "Crear servidor/grupo", onClick: () => setShowGroup(true) }),
          _jsx("div", { className: "flex-1" }),
          _jsx(RailBtn, { icon: _jsx(Users, { className: "h-5 w-5" }), label: "Amigos", badge: pending, active: activeView === "friends", dataTour: "sidebar-friends", onClick: () => handleViewChange("friends") }),
          _jsx(RailBtn, { icon: _jsx(Settings, { className: "h-5 w-5" }), label: "Ajustes", dataTour: "sidebar-settings", onClick: () => handleOverlayOpen("settings") })] }
        ),



        activeServerId ?
        _jsx(ServerPanel, { serverId: activeServerId, onChannelSelect: () => {}, canManage: true }) :

        _jsxs("div", {
          className: cn(
            "relative flex flex-col bg-[var(--discord-sidebar)] min-w-0 flex-1 md:flex-none"
          ),
          style: {
            width: isMobileMode ? 'calc(100% - 72px)' : panelW
          }, children: [

          _jsx(ChatPanel, {
            shopActive: activeView === "shop",
            chats: chats,
            groups: groups,
            folders: folders,
            selectedFolderId: selectedFolderId,
            loading: loading,
            activeChatId: activeChatId,
            pendingFriends: pending,
            friendsActive: activeView === "friends",
            currentUserId: currentUserId,
            readIds: readIds,
            onChatSelect: handleChatSelect,
            onFriendsClick: () => handleViewChange("friends"),
            onTiendaClick: () => handleViewChange("shop"),
            onMisionesClick: () => handleOverlayOpen("missions"),
            onStoriesClick: () => handleOverlayOpen("stories"),

            onNewDm: () => setShowDm(true),
            onNewGroup: () => setShowGroup(true),
            onContextMenu: (e, chatId, userId, userName) => ctx.openDm(e, chatId, userId, userName),
            onGroupContextMenu: (e, groupId, groupName, isOwner) => ctx.openGroup(e, groupId, groupName, isOwner),
            onMessageSearch: (cid, mid) => handleChatSelect(cid, mid),
            onManageFolders: () => setShowManageFolders(true) }
          ),
          _jsx(UserStatusPanel, { onOverlayOpen: onOverlayOpen }),


          _jsx("div", { onMouseDown: onMouseDown,
            style: { position: "absolute", right: -3, top: 0, bottom: 0, width: 6, cursor: "ew-resize", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }, children:
            _jsx("div", { style: { width: 2, height: "40%", borderRadius: 2, background: "rgba(255,255,255,0)", transition: "background .15s" },
              onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)",
              onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0)" }) }
          )] }
        ),



        ctx.menu?.type === "dm" &&
        _jsx(DmContextMenu, {
          x: ctx.menu.x, y: ctx.menu.y,
          userName: ctx.menu.name, userId: ctx.menu.id,
          chatId: ctx.menu.chatId,
          onClose: ctx.close,
          onViewProfile: onProfileClick ? () => {onProfileClick(ctx.menu.id);ctx.close();} : undefined,
          onCall: () => {
            toast.info(`Llamando a ${ctx.menu.name}... 📞`, {
              description: "La función de llamadas estará disponible próximamente.",
              icon: "🚀"
            });
            ctx.close();
          },
          onCloseDm: async () => {
            const cid = ctx.menu?.chatId;
            if (!cid) return;
            try {
              await api.post(`/chats/${cid}/close`, {});
              rc();
              if (activeChatId === cid) onViewChange("friends");
              toast.success("Conversación cerrada");
            } catch (e) {toast.error(e.message);}
            ctx.close();
          },
          onOrganize: () => {
            setAddToFolderData({ id: ctx.menu.chatId, name: ctx.menu.name });
            ctx.close();
          },
          onRemoveFromFolder: ctx.menu.folderId ? () => {
            handleRemoveFromFolder(ctx.menu.folderId, ctx.menu.chatId);
            ctx.close();
          } : undefined,
          onMute: async () => {
            const cid = ctx.menu?.chatId;
            if (!cid) return;
            try {
              const res = await api.post(`/chats/${cid}/mute`, {});
              rc();
              toast.success(res.isMuted ? "Notificaciones silenciadas" : "Notificaciones reactivadas");
            } catch (e) {toast.error(e.message);}
            ctx.close();
          },
          onCopyId: () => {
            navigator.clipboard.writeText(ctx.menu.id);
            toast.success("ID copiado");
            ctx.close();
          },
          onBlock: onBlock ? () => {onBlock(ctx.menu.id);ctx.close();} : undefined,
          onReport: onReport ? () => {onReport(ctx.menu.id, ctx.menu.name);ctx.close();} : undefined,
          onRemoveFriend: () => {
            setConfirmData({
              title: "¿Eliminar de amigos?",
              description: `¿Estás seguro de que quieres eliminar a ${ctx.menu.name} de tu lista de amigos?`,
              onConfirm: async () => {
                try {
                  await api.delete(`/friends/${ctx.menu.id}`);
                  toast.success("Amigo eliminado");
                  rc();
                } catch (e) {toast.error(e.message);}
              }
            });
            ctx.close();
          },
          onMarkUnread: async () => {
            const cid = ctx.menu?.chatId;
            if (!cid) return;
            try {
              await api.post(`/chats/${cid}/unread`, {});
              rc();
              toast.success("Marcado como no leído");
            } catch (e) {toast.error(e.message);}
            ctx.close();
          },
          isMuted: chats.find((c) => c.id === ctx.menu.chatId)?.isMuted }
        ),


        ctx.menu?.type === "group" &&
        _jsx(GroupContextMenu, {
          x: ctx.menu.x, y: ctx.menu.y,
          groupName: ctx.menu.name, groupId: ctx.menu.id,
          isOwner: ctx.menu.isOwner,
          onClose: ctx.close,
          onOpenGroup: () => {handleChatSelect(ctx.menu.id);ctx.close();},
          onOrganize: () => {
            setAddToFolderData({ id: ctx.menu.id, name: ctx.menu.name });
            ctx.close();
          },
          onRemoveFromFolder: ctx.menu.folderId ? () => {
            handleRemoveFromFolder(ctx.menu.folderId, ctx.menu.id);
            ctx.close();
          } : undefined,
          onMuteGroup: () => {toast.info("Grupo silenciado");ctx.close();},
          onMarkUnread: () => {toast.info("Marcado como no leído");ctx.close();},
          onCopyId: () => {navigator.clipboard.writeText(ctx.menu.id);toast.success("ID copiado");ctx.close();},
          onCopyInvite: () => {handleCopyInvite(ctx.menu.id);ctx.close();},
          onLeaveGroup: !ctx.menu.isOwner ? () => {handleLeaveGroup(ctx.menu.id);ctx.close();} : undefined,
          onDeleteGroup: ctx.menu.isOwner ? () => {handleDeleteGroup(ctx.menu.id);ctx.close();} : undefined,
          onGroupSettings: () => {onOpenGroupSettings?.(ctx.menu.id);ctx.close();} }
        )] }

      ),

      _jsx(AlertDialog, { open: !!confirmData, onOpenChange: (o) => !o && setConfirmData(null), children:
        _jsxs(AlertDialogContent, { className: "border-white/10 bg-[#313338] text-white", children: [
          _jsxs(AlertDialogHeader, { children: [
            _jsx(AlertDialogTitle, { children: confirmData?.title }),
            _jsx(AlertDialogDescription, { className: "text-[var(--muted-foreground)]", children:
              confirmData?.description }
            )] }
          ),
          _jsxs(AlertDialogFooter, { children: [
            _jsx(AlertDialogCancel, { className: "bg-transparent text-white hover:bg-white/5 border-white/10", children: "Cancelar" }),
            _jsx(AlertDialogAction, {
              onClick: confirmData?.onConfirm,
              className: "bg-red-500 hover:bg-red-600 text-white border-none", children:
              "Confirmar" }

            )] }
          )] }
        ) }
      ),

      showGroup && _jsx(CreateGroupModal, { onClose: () => setShowGroup(false), onCreated: (id) => {rg();handleChatSelect(id);} }),
      showDm && _jsx(NewDmModal, { onClose: () => setShowDm(false), onCreated: (id) => {rc();handleChatSelect(id);} }),

      ctx.menu?.type === "folder" &&
      _jsx(FolderContextMenu, {
        x: ctx.menu.x,
        y: ctx.menu.y,
        folderId: ctx.menu.id,
        folderName: ctx.menu.name,
        onClose: ctx.close,
        onDelete: () => {
          handleDeleteFolder(ctx.menu.id, ctx.menu.x, ctx.menu.y);
          ctx.close();
        },
        onRename: () => {
          setShowManageFolders(true);
          ctx.close();
        } }
      ),


      showManageFolders &&
      _jsx(ManageFoldersModal, {
        folders: folders,
        onClose: () => setShowManageFolders(false),
        onRefresh: rc }
      ),


      addToFolderData &&
      _jsx(AddToFolderModal, {
        chatId: addToFolderData.id,
        chatName: addToFolderData.name,
        folders: folders,
        onClose: () => setAddToFolderData(null),
        onRefresh: rc }
      )] }

    ));

}