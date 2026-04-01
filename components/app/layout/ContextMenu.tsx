"use client";

import { useEffect, useRef, useState } from "react";
import {
  User, X, Copy, Ban, Flag, UserMinus,
  MessageSquare, Bell, BellOff, LogOut, Settings,
  UserPlus, Hash, Video, Gift, Pin, Search,
  PhoneCall, Pencil, Trash2, AtSign, Link, Folder as FolderIcon, FolderMinus } from
"lucide-react";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";








































































const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
function mediaUrl(p) {
  if (!p) return null;
  if (/^https?:\/\
  return `${API_BASE}${p.startsWith("/") ? "" : "/"}${p}`;
}

const STATUS_COLOR = {
  online: "#23a559", idle: "#f0b232", dnd: "#ed4245",
  invisible: "#80848e", offline: "#80848e"
};
const STATUS_LABEL = {
  online: "En línea", idle: "Ausente", dnd: "No molestar",
  invisible: "Invisible", offline: "Desconectado"
};


function UserHeader({ name, avatar, status, isOctoPro

}) {
  const src = mediaUrl(avatar);
  return (
    _jsxs("div", { style: { padding: "10px 10px 8px", display: "flex", alignItems: "center", gap: 10 }, children: [
      _jsxs("div", { style: { position: "relative", flexShrink: 0 }, children: [
        _jsx("div", { style: {
            width: 38, height: 38, borderRadius: "50%",
            overflow: "hidden", background: "#5865f2",
            display: "flex", alignItems: "center", justifyContent: "center"
          }, children:
          src ?
          _jsx("img", { src: src, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) :
          _jsx("span", { style: { color: "#fff", fontSize: 15, fontWeight: 800 }, children: name[0]?.toUpperCase() }) }

        ),
        status &&
        _jsx("span", { style: {
            position: "absolute", bottom: 1, right: 1,
            width: 11, height: 11, borderRadius: "50%",
            background: STATUS_COLOR[status] ?? "#80848e",
            border: "2.5px solid #111214"
          } })] }

      ),
      _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
        _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
          _jsx("span", { style: { fontSize: 14, fontWeight: 700, color: "#f2f3f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children:
            name }
          ),
          isOctoPro &&
          _jsx("span", { style: { fontSize: 9, fontWeight: 700, background: "linear-gradient(90deg,#f0b232,#f07832)", color: "#fff", borderRadius: 3, padding: "1px 5px", flexShrink: 0, letterSpacing: "0.03em" }, children: "PRO" }

          )] }

        ),
        status &&
        _jsx("div", { style: { fontSize: 11, color: STATUS_COLOR[status] ?? "#87898c", marginTop: 1 }, children:
          STATUS_LABEL[status] ?? status }
        )] }

      )] }
    ));

}


function GroupHeader({ name, icon, memberCount }) {
  const src = mediaUrl(icon);
  return (
    _jsxs("div", { style: { padding: "10px 10px 8px", display: "flex", alignItems: "center", gap: 10 }, children: [
      _jsx("div", { style: { width: 38, height: 38, borderRadius: 10, overflow: "hidden", background: "#5865f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children:
        src ? _jsx("img", { src: src, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : _jsx(Hash, { size: 18, style: { color: "#fff" } }) }
      ),
      _jsxs("div", { children: [
        _jsx("div", { style: { fontSize: 14, fontWeight: 700, color: "#f2f3f5" }, children: name }),
        memberCount != null && _jsxs("div", { style: { fontSize: 11, color: "#87898c", marginTop: 1 }, children: [memberCount, " miembros"] })] }
      )] }
    ));

}


function MenuBase({ x, y, header, items, onClose




}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x, y });

  useEffect(() => {
    const el = ref.current;if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: x + r.width > window.innerWidth ? x - r.width : x,
      y: y + r.height > window.innerHeight ? y - r.height : y
    });
  }, [x, y]);

  useEffect(() => {
    const onDown = (e) => {if (!ref.current?.contains(e.target)) onClose();};
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    _jsxs("div", {
      ref: ref,
      onContextMenu: (e) => e.preventDefault(),
      style: {
        position: "fixed", top: pos.y, left: pos.x,
        zIndex: 9999, minWidth: 240, maxWidth: 280,
        background: "#111214", borderRadius: 8,
        boxShadow: "0 10px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)",
        padding: "4px",
        animation: "cm-pop .12s cubic-bezier(.2,.8,.3,1.2)",
        userSelect: "none"
      }, children: [

      header &&
      _jsxs(_Fragment, { children: [
        header,
        _jsx("div", { style: { height: 1, background: "#2a2b2e", margin: "2px 0 4px" } })] }
      ),


      items.map((item, i) =>
      _jsxs("div", { children: [
        item.divider && _jsx("div", { style: { height: 1, background: "#2a2b2e", margin: "4px 0" } }),
        _jsxs("button", {
          onClick: () => {if (!item.disabled) {item.onClick();onClose();}},
          disabled: item.disabled,
          style: {
            display: "flex", alignItems: "center", gap: 9,
            width: "100%", padding: "8px 10px",
            background: "transparent", border: "none", borderRadius: 4,
            cursor: item.disabled ? "default" : "pointer",
            textAlign: "left", fontFamily: "inherit",
            fontSize: 14, fontWeight: 500,
            color: item.disabled ? "#4e5058" : item.danger ? "#ed4245" : "#dbdee1",
            opacity: item.disabled ? 0.5 : 1,
            transition: "background .08s"
          },
          onMouseEnter: (e) => {
            if (!item.disabled)
            e.currentTarget.style.background = item.danger ? "rgba(237,66,69,0.15)" : "#35373c";
          },
          onMouseLeave: (e) => e.currentTarget.style.background = "transparent", children: [

          _jsx("span", { style: { flexShrink: 0, color: item.danger ? "#ed4245" : "#87898c", display: "flex" }, children:
            item.icon }
          ),
          _jsx("span", { style: { flex: 1 }, children: item.label }),
          item.badge &&
          _jsx("span", { style: { fontSize: 10, fontWeight: 700, background: item.danger ? "#ed4245" : "#5865f2", color: "#fff", borderRadius: 99, padding: "1px 6px", flexShrink: 0 }, children:
            item.badge }
          )] }

        )] }, i
      )
      ),

      _jsx("style", { children: `@keyframes cm-pop { from{opacity:0;transform:scale(.92) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }` })] }
    ));

}


export function DmContextMenu({
  x, y, userName, userId, userAvatar, userStatus, isOctoPro,
  onClose, onViewProfile, onCall, onVideoCall, onCloseDm,
  onMute, onCopyId, onCopyUsername, onBlock, onReport,
  onRemoveFriend, onAddFriend, onMarkUnread, onPin,
  onAddNote, onOrganize, onGiftPro, onRemoveFromFolder,
  isFriend = true, isMuted = false, isPinned = false
}) {
  const items = [
  onViewProfile && { icon: _jsx(User, { size: 15 }), label: "Ver perfil completo", onClick: onViewProfile },
  onCall && { icon: _jsx(PhoneCall, { size: 15 }), label: "Llamada de voz", onClick: onCall, divider: true },
  onVideoCall && { icon: _jsx(Video, { size: 15 }), label: "Videollamada", onClick: onVideoCall },
  onMarkUnread && { icon: _jsx(MessageSquare, { size: 15 }), label: "Marcar como no leído", onClick: onMarkUnread, divider: true },
  onPin && { icon: _jsx(Pin, { size: 15 }), label: isPinned ? "Desanclar" : "Anclar conversación", onClick: onPin },
  onOrganize && { icon: _jsx(FolderIcon, { size: 15 }), label: "Organizar en carpetas", onClick: onOrganize },
  onRemoveFromFolder && { icon: _jsx(FolderMinus, { size: 15 }), label: "Sacar de esta carpeta", onClick: onRemoveFromFolder },
  onAddNote && { icon: _jsx(Pencil, { size: 15 }), label: "Añadir nota privada", onClick: onAddNote },
  onMute && {
    icon: isMuted ? _jsx(Bell, { size: 15 }) : _jsx(BellOff, { size: 15 }),
    label: isMuted ? "Reactivar notificaciones" : "Silenciar", onClick: onMute, divider: true
  },
  onGiftPro && { icon: _jsx(Gift, { size: 15 }), label: "Regalar OctoPro", onClick: onGiftPro, badge: "✨" },
  !isFriend && onAddFriend && { icon: _jsx(UserPlus, { size: 15 }), label: "Añadir amigo", onClick: onAddFriend, divider: true },
  isFriend && onRemoveFriend && { icon: _jsx(UserMinus, { size: 15 }), label: "Eliminar de amigos", onClick: onRemoveFriend, danger: true, divider: true },
  onCloseDm && { icon: _jsx(X, { size: 15 }), label: "Cerrar DM", onClick: onCloseDm },
  onCopyUsername && { icon: _jsx(AtSign, { size: 15 }), label: "Copiar nombre de usuario", onClick: onCopyUsername, divider: true },
  onCopyId && { icon: _jsx(Copy, { size: 15 }), label: "Copiar ID de usuario", onClick: onCopyId },
  onBlock && { icon: _jsx(Ban, { size: 15 }), label: "Bloquear usuario", onClick: onBlock, danger: true, divider: true },
  onReport && { icon: _jsx(Flag, { size: 15 }), label: "Reportar usuario", onClick: onReport, danger: true }].
  filter(Boolean);

  return (
    _jsx(MenuBase, { x: x, y: y, onClose: onClose,
      header: _jsx(UserHeader, { name: userName, avatar: userAvatar, status: userStatus, isOctoPro: isOctoPro }),
      items: items }
    ));

}


export function GroupContextMenu({
  x, y, groupName, groupId, groupIcon, memberCount,
  isOwner = false,
  onClose, onOpenGroup, onMuteGroup, onMarkUnread, onOrganize,
  onCopyId, onCopyInvite, onLeaveGroup, onDeleteGroup,
  onGroupSettings, onSearchMessages, onPinGroup, onRemoveFromFolder,
  isMuted = false, isPinned = false
}) {
  const items = [
  onOpenGroup && { icon: _jsx(Hash, { size: 15 }), label: "Abrir grupo", onClick: onOpenGroup },
  onOrganize && { icon: _jsx(FolderIcon, { size: 15 }), label: "Organizar en carpetas", onClick: onOrganize },
  onRemoveFromFolder && { icon: _jsx(FolderMinus, { size: 15 }), label: "Sacar de esta carpeta", onClick: onRemoveFromFolder },
  onSearchMessages && { icon: _jsx(Search, { size: 15 }), label: "Buscar en el grupo", onClick: onSearchMessages },
  onMarkUnread && { icon: _jsx(MessageSquare, { size: 15 }), label: "Marcar como no leído", onClick: onMarkUnread, divider: true },
  onPinGroup && { icon: _jsx(Pin, { size: 15 }), label: isPinned ? "Desanclar" : "Anclar grupo", onClick: onPinGroup },
  onMuteGroup && {
    icon: isMuted ? _jsx(Bell, { size: 15 }) : _jsx(BellOff, { size: 15 }),
    label: isMuted ? "Reactivar notificaciones" : "Silenciar grupo", onClick: onMuteGroup
  },
  isOwner && onGroupSettings && { icon: _jsx(Settings, { size: 15 }), label: "Configuración del grupo", onClick: onGroupSettings, divider: true },
  onCopyInvite && { icon: _jsx(Link, { size: 15 }), label: "Copiar enlace de invitación", onClick: onCopyInvite, divider: !isOwner },
  onCopyId && { icon: _jsx(Copy, { size: 15 }), label: "Copiar ID del grupo", onClick: onCopyId },
  !isOwner && onLeaveGroup && { icon: _jsx(LogOut, { size: 15 }), label: "Salir del grupo", onClick: onLeaveGroup, danger: true, divider: true },
  isOwner && onDeleteGroup && { icon: _jsx(Trash2, { size: 15 }), label: "Eliminar grupo", onClick: onDeleteGroup, danger: true, divider: true }].
  filter(Boolean);

  return (
    _jsx(MenuBase, { x: x, y: y, onClose: onClose,
      header: _jsx(GroupHeader, { name: groupName, icon: groupIcon, memberCount: memberCount }),
      items: items }
    ));

}












export function FolderContextMenu({
  x, y, folderName, folderId,
  onClose, onRename, onDelete
}) {
  const items = [
  onRename && { icon: _jsx(Pencil, { size: 15 }), label: "Renombrar carpeta", onClick: onRename },
  onDelete && { icon: _jsx(Trash2, { size: 15 }), label: "Eliminar carpeta", onClick: onDelete, danger: true }].
  filter(Boolean);

  return (
    _jsx(MenuBase, { x: x, y: y, onClose: onClose,
      header: _jsxs("div", { style: { padding: "10px 14px 6px", fontSize: 13, fontWeight: 700, color: "#949ba4", textTransform: "uppercase" }, children: ["Carpeta: ", folderName] }),
      items: items }
    ));

}


export function ContextMenu(props) {
  return _jsx(DmContextMenu, { ...props });
}




export function useContextMenu() {
  const [menu, setMenu] = useState(







    null);

  function openDm(e, chatId, userId, userName, extra)

  {
    e.preventDefault();e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, type: "dm", id: userId, chatId, name: userName, ...extra });
  }

  function openGroup(e, groupId, groupName, isOwner = false, folderId) {
    e.preventDefault();e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, type: "group", id: groupId, name: groupName, isOwner, folderId });
  }

  function openFolder(e, folderId, folderName) {
    e.preventDefault();e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, type: "folder", id: folderId, name: folderName });
  }

  function open(e, chatId, userId, userName) {openDm(e, chatId, userId, userName);}
  function close() {setMenu(null);}

  return { menu, open, openDm, openGroup, openFolder, close };
}