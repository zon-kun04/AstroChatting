"use client";



import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hash } from "lucide-react";
import { assetUrl } from "./hooks";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";



export function StatusDot({ status }) {
  if (status === "online") {
    return _jsx("span", { className: "block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[var(--discord-sidebar)]" });
  }
  if (status === "idle") {
    return (
      _jsx("span", { className: "relative block h-3 w-3 rounded-full bg-yellow-400 ring-2 ring-[var(--discord-sidebar)] overflow-hidden", children:
        _jsx("span", { className: "absolute -right-[2px] -top-[2px] h-[8px] w-[8px] rounded-full bg-[var(--discord-sidebar)]" }) }
      ));

  }
  if (status === "dnd") {
    return (
      _jsx("span", { className: "relative flex h-3 w-3 items-center justify-center rounded-full bg-red-500 ring-2 ring-[var(--discord-sidebar)]", children:
        _jsx("span", { className: "h-[1.5px] w-[6px] rounded-full bg-white" }) }
      ));

  }
  return (
    _jsx("span", { className: "relative flex h-3 w-3 items-center justify-center rounded-full bg-[#80848e] ring-2 ring-[var(--discord-sidebar)]", children:
      _jsx("span", { className: "h-[5px] w-[5px] rounded-full bg-[var(--discord-sidebar)]" }) }
    ));

}


function AvatarDecoration({ path }) {
  const url = assetUrl(path);
  if (!url) return null;
  return (
    _jsx("img", {
      src: url,
      alt: "",
      draggable: false,
      className: "pointer-events-none absolute inset-0 z-10 h-full w-full scale-[1.35] object-contain" }
    ));

}


function Nameplate({ path, hovered, active



}) {
  if (!path || path === "none" || path === "default") return null;
  const url = assetUrl(path);
  if (!url) return null;

  const isVideo = path.endsWith(".webm") || path.endsWith(".mp4");
  const opacity = active ? "opacity-100" : hovered ? "opacity-50" : "opacity-20";

  return (
    _jsx("span", { className: cn("pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-md transition-opacity duration-200", opacity), children:
      isVideo ?
      _jsx("video", { src: url, autoPlay: true, loop: true, muted: true, playsInline: true, className: "h-full w-full object-cover" }) :

      _jsx("img", { src: url, alt: "", draggable: false, className: "h-full w-full object-cover" }) }

    ));

}


export function ChatSkeleton() {
  return (
    _jsxs("div", { className: "flex items-center gap-3 px-2 py-1.5 animate-pulse", children: [
      _jsx("div", { className: "h-8 w-8 flex-shrink-0 rounded-full bg-[var(--discord-dark)]" }),
      _jsxs("div", { className: "flex flex-1 flex-col gap-1.5", children: [
        _jsx("div", { className: "h-2.5 w-24 rounded bg-[var(--discord-dark)]" }),
        _jsx("div", { className: "h-2 w-16 rounded bg-[var(--discord-dark)] opacity-60" })] }
      )] }
    ));

}


export function DmItem({ chat, active, onClick, onContextMenu, unreadOverride





}) {
  const p = chat.participant;
  const name = p?.displayName || p?.username || "Usuario";
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);

  const avatarSrc = assetUrl(p?.avatar);
  const decoration = p?.decorations?.avatarDecoration;
  const nameplate = p?.decorations?.nameplate;
  const status = p?.status ?? "offline";

  const hasDecoration = !!decoration && decoration !== "none";
  const hasNameplate = !!nameplate && nameplate !== "none" && nameplate !== "default";


  const unreadCount = unreadOverride !== undefined ? unreadOverride : chat.unreadCount;

  return (
    _jsxs("button", {
      onClick: onClick,
      onContextMenu: onContextMenu,
      draggable: true,
      onDragStart: (e) => {
        e.dataTransfer.setData("chatId", chat.id);
        e.dataTransfer.effectAllowed = "move";
      },
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => {setHov(false);setPressed(false);},
      onMouseDown: () => setPressed(true),
      onMouseUp: () => setPressed(false),
      className: cn(
        "group relative flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-all duration-150 overflow-hidden",
        active ?
        "bg-[var(--discord-active)] text-[var(--foreground)]" :
        "text-[var(--muted-foreground)] hover:bg-[var(--discord-hover)] hover:text-[var(--foreground)]"
      ), children: [

      hasNameplate &&
      _jsx(Nameplate, { path: nameplate, hovered: hov, active: pressed || active }),


      _jsxs("div", { className: "relative z-10 flex-shrink-0", children: [
        _jsxs("div", { className: cn("relative h-8 w-8 transition-transform duration-150", hov && "scale-105"), children: [
          _jsxs(Avatar, { className: "h-8 w-8", children: [
            _jsx(AvatarImage, { src: avatarSrc, alt: name }),
            _jsx(AvatarFallback, { className: "bg-[var(--discord-blurple)] text-white text-xs", children:
              name[0]?.toUpperCase() }
            )] }
          ),
          hasDecoration && _jsx(AvatarDecoration, { path: decoration })] }
        ),
        _jsx("span", { className: "absolute -bottom-0.5 -right-0.5", children:
          _jsx(StatusDot, { status: status }) }
        )] }
      ),

      _jsxs("div", { className: "relative z-10 flex min-w-0 flex-1 flex-col", children: [
        _jsx("span", { className: cn(
            "truncate text-sm leading-tight",
            unreadCount > 0 ? "font-semibold text-[var(--foreground)]" : "font-medium"
          ), children:
          name }
        ),
        chat.lastMessage &&
        _jsx("span", { className: "truncate text-[11px] leading-tight text-[var(--muted-foreground)] opacity-70", children:
          chat.lastMessage.content || "Archivo adjunto" }
        )] }

      ),

      unreadCount > 0 &&
      _jsx("span", { className: "relative z-10 flex h-4 min-w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--destructive)] px-1 text-[10px] font-bold text-white", children:
        unreadCount > 99 ? "99+" : unreadCount }
      )] }

    ));

}


export function GroupItem({ group, active, onClick, onContextMenu, unreadOverride





}) {
  const [hov, setHov] = useState(false);
  const avatarSrc = assetUrl(group.avatar);

  const unreadCount = unreadOverride !== undefined ? unreadOverride : group.unreadCount;

  return (
    _jsxs("button", {
      onClick: onClick,
      onContextMenu: onContextMenu,
      draggable: true,
      onDragStart: (e) => {
        e.dataTransfer.setData("chatId", group.id);
        e.dataTransfer.effectAllowed = "move";
      },
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      className: cn(
        "group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-all duration-150",
        active ?
        "bg-[var(--discord-active)] text-[var(--foreground)]" :
        "text-[var(--muted-foreground)] hover:bg-[var(--discord-hover)] hover:text-[var(--foreground)]"
      ), children: [

      _jsxs(Avatar, { className: cn("h-8 w-8 flex-shrink-0 transition-transform duration-150", hov && "scale-105"), children: [
        _jsx(AvatarImage, { src: avatarSrc, alt: group.name }),
        _jsx(AvatarFallback, { className: "bg-[var(--discord-blurple)] text-white text-xs", children:
          _jsx(Hash, { className: "h-4 w-4" }) }
        )] }
      ),

      _jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
        _jsx("span", { className: cn(
            "truncate text-sm leading-tight",
            unreadCount > 0 ? "font-semibold text-[var(--foreground)]" : "font-medium"
          ), children:
          group.name }
        ),
        _jsxs("span", { className: "text-[11px] leading-tight text-[var(--muted-foreground)] opacity-70", children: [
          group.memberCount, " miembro", group.memberCount !== 1 ? "s" : ""] }
        )] }
      ),

      unreadCount > 0 &&
      _jsx("span", { className: "flex h-4 min-w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--destructive)] px-1 text-[10px] font-bold text-white", children:
        unreadCount > 99 ? "99+" : unreadCount }
      )] }

    ));

}