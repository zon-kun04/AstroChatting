"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings, X, Copy, Check, Music,
  Link2, Trash2, Crown } from
"lucide-react";

import { wsClient } from "@/lib/ws";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";



const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAuthData() {
  try {
    const raw = localStorage.getItem("auth_accounts");
    const email = localStorage.getItem("auth_active_email");
    if (!raw || !email) return null;
    const accounts = JSON.parse(raw);
    return accounts.find((a) => a.email === email) ?? null;
  } catch {return null;}
}


function extractColors(raw) {
  if (!raw) return ["#5865f2"];
  const m = raw.match(/#[0-9a-fA-F]{6}/g);
  return m && m.length ? m : ["#5865f2"];
}


function g(raw, angle = 135) {
  if (!raw) return "#5865f2";
  const colors = extractColors(raw);
  if (colors.length === 1) return colors[0];
  if (raw.includes("%")) return `linear-gradient(${angle}deg, ${raw})`;
  const stops = colors.map((c, i) => `${c} ${Math.round(i / (colors.length - 1) * 100)}%`).join(", ");
  return `linear-gradient(${angle}deg, ${stops})`;
}


function gAlpha(raw, alpha, angle = 135) {
  const colors = extractColors(raw);
  const stops = colors.map((c, i) => {
    const r = parseInt(c.slice(1, 3), 16);
    const gv = parseInt(c.slice(3, 5), 16);
    const b = parseInt(c.slice(5, 7), 16);
    const pct = raw && raw.includes("%") ?
    (raw.match(/(\d+)%/g) || [])[i]?.replace("%", "") ?? Math.round(i / Math.max(colors.length - 1, 1) * 100) :
    Math.round(i / Math.max(colors.length - 1, 1) * 100);
    return `rgba(${r},${gv},${b},${alpha}) ${pct}%`;
  });
  return `linear-gradient(${angle}deg, ${stops.join(", ")})`;
}




const STATUS_OPTIONS = [
{ value: "online", label: "Online", color: "#23a559" },
{ value: "idle", label: "Ausente", color: "#f0b232" },
{ value: "dnd", label: "No Molestar", color: "#ed4245", desc: "No recibirás notificaciones" },
{ value: "invisible", label: "Invisible", color: "#80848e", desc: "Saldrás offline para todos" }];

const STATUS_COLOR = {
  online: "#23a559", idle: "#f0b232", dnd: "#ed4245", invisible: "#80848e", offline: "#80848e"
};
const NOTE_COLORS = ["#5865f2", "#23a559", "#f0b232", "#ed4245", "#eb459e", "#f47fff"];
const RARITY_COLOR = {
  common: "#b5bac1", uncommon: "#23a559", rare: "#5865f2",
  epic: "#eb459e", legendary: "#f0b232", special: "#f47fff"
};
const CATEGORY_LABEL = {
  avatar_decoration: "Decoración avatar", nameplate: "Placa nombre",
  profile_effect: "Efecto perfil", badge: "Insignia",
  banner: "Banner", entry_effect: "Efecto de entrada"
};



























export function UserStatusPanel({ wsRef, onOverlayOpen }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [entryVisible, setEntryVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("online");
  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState("music");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0]);
  const [noteLoading, setNoteLoading] = useState(false);
  const panelRef = useRef(null);

  const fetchUser = useCallback(() => {
    const auth = getAuthData();if (!auth) return;
    fetch(`${API_BASE}/api/users/me`, { headers: { Authorization: `Bearer ${auth.token}` } }).
    then((r) => r.json()).then((d) => {
      setUser(d.user);
      setCurrentStatus(d.user.status || "online");
    }).catch(() => {});
  }, []);

  const fetchNotes = useCallback(() => {
    const auth = getAuthData();if (!auth) return;
    fetch(`${API_BASE}/api/notes`, { headers: { Authorization: `Bearer ${auth.token}` } }).
    then((r) => r.json()).then((d) => setNotes(d.notes || [])).catch(() => {});
  }, []);

  useEffect(() => {fetchUser();fetchNotes();}, [fetchUser, fetchNotes]);
  useEffect(() => {if (showCard || showFullProfile) {fetchUser();fetchNotes();}}, [showCard, showFullProfile, fetchUser, fetchNotes]);

  useEffect(() => {
    function handle(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowCard(false);setShowStatusMenu(false);setShowNoteForm(false);
      }
    }
    if (showCard) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showCard]);

  useEffect(() => {setEntryVisible(!!showFullProfile);}, [showFullProfile]);

  function changeStatus(s) {
    setCurrentStatus(s);setShowStatusMenu(false);
    try {
      wsClient.send("presence:status_update", { status: s, customStatus: user?.customStatus ?? "" });
    } catch {}
  }

  async function createNote() {
    if (!noteContent.trim()) return;
    const auth = getAuthData();if (!auth) return;
    setNoteLoading(true);
    try {
      await fetch(`${API_BASE}/api/notes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteContent.slice(0, 30),
          content: noteContent,
          category: "Personal",
          color: noteColor,
          isPublic: true
        })
      });
      fetchNotes();setNoteContent("");setShowNoteForm(false);
    } finally {setNoteLoading(false);}
  }

  async function deleteNote(id) {
    const auth = getAuthData();if (!auth) return;
    setNotes((p) => p.filter((n) => n.id !== id));
    await fetch(`${API_BASE}/api/notes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${auth.token}` } }).catch(() => {});
  }

  function logout() {localStorage.removeItem("auth_active_email");router.push("/auth");}
  function copyId() {
    if (!user) return;
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);setTimeout(() => setCopiedId(false), 2000);
  }


  const raw = user?.profileColor;
  const color0 = extractColors(raw)[0];
  const grad135 = g(raw, 135);

  function mUrl(p) {
    if (!p || p === "none" || p === "default") return undefined;
    return p.startsWith("http") ? p : `${API_BASE}${p}`;
  }

  const avatarSrc = mUrl(user?.avatar);
  const bannerSrc = mUrl(user?.banner);
  const avatarDecoSrc = mUrl(user?.decorations?.avatarDecoration);
  const profileEffectSrc = mUrl(user?.decorations?.profileEffect);
  const entryEffectSrc = mUrl(user?.decorations?.entryEffect);
  const nameplateSrc = user?.decorations?.nameplate && user.decorations.nameplate !== "default" && user.decorations.nameplate !== "none" ?
  mUrl(user.decorations.nameplate) :
  undefined;
  const nameplateIsVideo = nameplateSrc ? /\.(mp4|webm|ogg)$/i.test(nameplateSrc) : false;
  const entryIsVideo = entryEffectSrc ? /\.(mp4|webm|ogg)$/i.test(entryEffectSrc) : false;

  const statusColor = STATUS_COLOR[currentStatus] || "#80848e";
  const statusLabel = STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label || "Online";
  const memberSince = user ?
  new Date(user.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "";


  function AvatarWithDeco({ size, bg, ringW = 3 }) {
    const total = size + (ringW + 2) * 2;
    return (
      _jsxs("div", { style: { position: "relative", width: total, height: total, flexShrink: 0, zIndex: 30 }, children: [
        _jsx("div", { style: { position: "absolute", inset: 0, borderRadius: "50%", background: grad135 } }),
        _jsx("div", { style: { position: "absolute", inset: ringW, borderRadius: "50%", background: bg } }),
        _jsx("div", { style: { position: "absolute", inset: ringW + 2, borderRadius: "50%", overflow: "hidden" }, children:
          _jsxs(Avatar, { style: { width: "100%", height: "100%" }, children: [
            _jsx(AvatarImage, { src: avatarSrc, className: "object-cover" }),
            _jsx(AvatarFallback, { style: { background: grad135, color: "#fff", fontSize: size * 0.32, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }, children:
              user?.displayName?.[0] ?? "?" }
            )] }
          ) }
        ),
        avatarDecoSrc &&
        _jsx("img", { src: avatarDecoSrc, alt: "", style: { position: "absolute", top: "-85%", left: "50%", transform: "translateX(-50%)", width: size * 3, height: size * 3, objectFit: "contain", pointerEvents: "none", zIndex: 3 } }),

        _jsx("span", { style: { position: "absolute", borderRadius: "50%", width: Math.round(size * 0.26), height: Math.round(size * 0.26), bottom: 1, right: 1, background: statusColor, border: `${Math.max(2, ringW)}px solid ${bg}`, zIndex: 4 } })] }
      ));

  }

  function SecBtn({ onClick, children, danger = false }) {
    return (
      _jsx("button", { onClick: onClick,
        style: { width: "100%", background: "rgba(0,0,0,0.25)", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 13, color: danger ? "#ed4245" : "rgba(255,255,255,0.8)", cursor: "pointer", fontFamily: "inherit" },
        onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.4)",
        onMouseLeave: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.25)", children:
        children }
      ));

  }

  const Divider = () => _jsx("div", { style: { height: 1, background: "rgba(255,255,255,0.12)", margin: "2px 0" } });

  return (
    _jsxs("div", { ref: panelRef, className: "relative", children: [

      showCard &&
      _jsxs("div", { className: "absolute bottom-full left-0 mb-2 w-[300px] z-50 rounded-2xl shadow-2xl overflow-hidden", style: { background: grad135, animation: "usp-slideUp .15s ease" }, children: [
        _jsx("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 0 } }),
        _jsx("div", { style: { height: 80, position: "relative", zIndex: 1, overflow: "hidden" }, children:
          bannerSrc ? _jsx("img", { src: bannerSrc, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : _jsx("div", { style: { width: "100%", height: "100%", background: "rgba(0,0,0,0.2)" } }) }
        ),
        _jsxs("div", { style: { position: "relative", zIndex: 2, padding: "0 12px", marginTop: -28, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }, children: [
          _jsx(AvatarWithDeco, { size: 50, bg: "transparent", ringW: 3 }),
          user?.isOctoPro &&
          _jsx("div", { style: { marginTop: 36 }, children:
            _jsx("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }, children: _jsx(Crown, { style: { width: 12, height: 12, color: "#fff" } }) }) }
          )] }

        ),
        _jsxs("div", { style: { position: "relative", zIndex: 2, padding: "6px 12px 14px", display: "flex", flexDirection: "column", gap: 8 }, children: [
          _jsxs("div", { children: [
            _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }, children: [
              _jsx("span", { style: { fontWeight: 800, fontSize: 17, color: "#ffffff", lineHeight: 1.2, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }, children: user?.displayName }),
              user?.badges?.map((badgeUrl, idx) => {
                const name = badgeUrl.split('/').pop()?.split('.')[0]?.replace(/_/g, ' ') || "Insignia";
                return (
                  _jsxs("div", { className: "group/badge relative flex items-center justify-center", children: [
                    _jsx("img", {
                      src: badgeUrl.startsWith("http") ? badgeUrl : `${API_BASE}${badgeUrl}`,
                      alt: "",
                      style: { width: 18, height: 18, objectFit: "contain", transition: "transform 0.2s" },
                      className: "group-hover/badge:scale-125" }
                    ),

                    _jsxs("div", { className: "absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/90 text-[10px] text-white rounded opacity-0 group-hover/badge:opacity-100 pointer-events-none transition-all duration-200 -translate-y-1 group-hover/badge:translate-y-0 whitespace-nowrap z-[100] border border-white/10 capitalize shadow-2xl", children: [
                      _jsx("div", { className: "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-t border-l border-white/10 rotate-45" }),
                      name] }
                    )] }, idx
                  ));

              })] }
            ),
            _jsxs("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.65)" }, children: ["@", user?.username] }),
            user?.customStatus && _jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }, children: user.customStatus })] }
          ),
          notes.slice(0, 3).map((note) =>
          _jsxs("div", { className: "group", style: { display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.3)", borderLeft: `3 solid ${note.color || "#fff"}`, borderRadius: "0 8px 8px 0", padding: "6px 10px" }, children: [
            _jsx("span", { style: { flex: 1, fontSize: 12, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: note.content }),
            _jsx("button", { onClick: () => deleteNote(note.id), className: "opacity-0 group-hover:opacity-100", style: { color: "#ff6b6b", background: "none", border: "none", cursor: "pointer" }, children: _jsx(Trash2, { size: 12 }) })] }, note.id
          )
          ),

          _jsxs("div", { style: { display: "flex", gap: 8, marginTop: 4 }, children: [
            _jsx("button", {
              onClick: () => {setShowCard(false);onOverlayOpen?.("settings");},
              style: { flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" },
              onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)",
              onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)", children:
              "Editar Perfil" }

            ),
            _jsxs("button", {
              onClick: copyId,
              style: { flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
              onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)",
              onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)", children: [

              copiedId ? _jsx(Check, { size: 14, style: { color: "#23a559" } }) : _jsx(Copy, { size: 14 }),
              copiedId ? "Copiado" : "Copiar ID"] }
            )] }
          ),

          _jsx("button", { onClick: () => {setShowCard(false);setShowFullProfile(true);}, style: { width: "100%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }, children: "Ver mi perfil completo" }),


          _jsx("div", { style: { display: "flex", gap: 4, background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 4, marginTop: 4 }, children:
            STATUS_OPTIONS.map((opt) =>
            _jsx("button", {

              onClick: () => changeStatus(opt.value),
              style: {
                flex: 1, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
                background: currentStatus === opt.value ? "rgba(255,255,255,0.15)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
              },
              title: opt.label,
              onMouseEnter: (e) => !(currentStatus === opt.value) && (e.currentTarget.style.background = "rgba(255,255,255,0.05)"),
              onMouseLeave: (e) => !(currentStatus === opt.value) && (e.currentTarget.style.background = "transparent"), children:

              _jsx("div", { style: { width: 12, height: 12, borderRadius: "50%", background: opt.color, boxShadow: currentStatus === opt.value ? `0 0 8px ${opt.color}` : "none" } }) }, opt.value
            )
            ) }
          ),

          _jsx(SecBtn, { onClick: logout, danger: true, children: "Cerrar sesi\xF3n" })] }
        )] }
      ),



      showStatusMenu &&
      _jsxs("div", { className: "absolute bottom-full left-0 mb-2 w-[220px] z-50 rounded-lg bg-[#111214] p-1 shadow-2xl border border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-150", children: [
        _jsx("div", { className: "p-2 border-b border-white/5 mb-1", children:
          _jsx("span", { className: "text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider", children: "Cambiar estado" }) }
        ),
        STATUS_OPTIONS.map((opt) =>
        _jsxs("button", {

          onClick: () => changeStatus(opt.value),
          className: "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-[var(--discord-blurple)] group transition-colors", children: [

          _jsxs("div", { style: { position: "relative", width: 14, height: 14 }, children: [
            _jsx("span", { style: {
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: opt.color,
                boxShadow: opt.value === currentStatus ? `0 0 8px ${opt.color}80` : "none"
              } }),
            opt.value === "idle" && _jsx("div", { className: "absolute -left-1 -top-1 w-2.5 h-2.5 bg-[#111214] rounded-full group-hover:bg-[var(--discord-blurple)] transition-colors" }),
            opt.value === "dnd" && _jsx("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-[#111214] group-hover:bg-[var(--discord-blurple)] transition-colors" }),
            opt.value === "invisible" && _jsx("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#111214] rounded-full group-hover:bg-[var(--discord-blurple)] transition-colors" })] }
          ),
          _jsxs("div", { className: "flex flex-col min-w-0", children: [
            _jsx("span", { className: "text-sm font-medium text-white group-hover:text-white leading-tight", children: opt.label }),
            opt.desc && _jsx("span", { className: "text-[10px] text-[var(--muted-foreground)] group-hover:text-white/70 truncate", children: opt.desc })] }
          )] }, opt.value
        )
        )] }
      ),



      showFullProfile && user &&
      _jsx("div", { className: "fixed inset-0 z-[200] flex items-center justify-center", style: { background: "rgba(0,0,0,0.78)", animation: "usp-fadeIn .15s ease" }, onClick: () => setShowFullProfile(false), children:
        _jsx("div", { style: { padding: 2, borderRadius: 20, background: grad135, animation: "usp-zoomIn .2s ease", width: "min(480px, 94vw)" }, onClick: (e) => e.stopPropagation(), children:
          _jsxs("div", { style: { borderRadius: 18, background: grad135, display: "flex", flexDirection: "column", maxHeight: "88vh", position: "relative" }, children: [
            _jsx("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.50)", borderRadius: 18, zIndex: 0 } }),


            entryEffectSrc && entryVisible &&
            _jsx("div", { style: { position: "absolute", inset: 0, zIndex: 50, borderRadius: 18, overflow: "hidden", pointerEvents: "none", animation: "usp-entryFadeIn .3s ease forwards" }, children:
              entryIsVideo ?
              _jsx("video", { src: entryEffectSrc, autoPlay: true, muted: true, playsInline: true, loop: true, style: { width: "100%", height: "100%" } }) :

              _jsx("img", { src: entryEffectSrc, alt: "", style: { width: "100%", height: "100%" } }) }

            ),


            _jsx("button", { onClick: () => setShowFullProfile(false), style: { position: "absolute", top: 12, right: 12, zIndex: 60, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", border: "none", cursor: "pointer" }, children:
              _jsx(X, { size: 16 }) }
            ),

            _jsxs("div", { style: { height: 130, borderRadius: "18px 18px 0 0", overflow: "hidden", position: "relative", zIndex: 1 }, children: [
              bannerSrc ? _jsx("img", { src: bannerSrc, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : _jsx("div", { style: { width: "100%", height: "100%", background: grad135, opacity: 0.8 } }),
              profileEffectSrc && _jsx("img", { src: profileEffectSrc, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, mixBlendMode: "screen" } })] }
            ),

            _jsx("div", { style: { padding: "0 20px", marginTop: -54, position: "relative", zIndex: 10 }, children:
              _jsx(AvatarWithDeco, { size: 88, bg: "transparent", ringW: 4 }) }
            ),

            _jsxs("div", { style: { overflowY: "auto", flex: 1, position: "relative", zIndex: 1 }, children: [
              _jsxs("div", { style: { display: "flex", gap: 8, padding: "10px 20px 4px" }, children: [
                _jsx("button", { style: { flex: 1, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }, children: "Editar Perfil" }),
                _jsx("button", { onClick: copyId, style: { width: 36, height: 36, borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", cursor: "pointer" }, children:
                  copiedId ? _jsx(Check, { size: 15, style: { color: "#23a559" } }) : _jsx(Copy, { size: 15 }) }
                )] }
              ),

              _jsxs("div", { style: { padding: "4px 20px 8px" }, children: [
                _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 4 }, children: [
                  _jsx("h2", { style: { fontSize: 24, fontWeight: 900, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }, children: user.displayName }),
                  user.badges?.map((badgeUrl, idx) => {
                    const name = badgeUrl.split('/').pop()?.split('.')[0]?.replace(/_/g, ' ') || "Insignia";
                    return (
                      _jsxs("div", { className: "group/badge relative flex items-center justify-center", children: [
                        _jsx("img", {
                          src: badgeUrl.startsWith("http") ? badgeUrl : `${API_BASE}${badgeUrl}`,
                          alt: "",
                          style: { width: 22, height: 22, objectFit: "contain", transition: "transform 0.2s" },
                          className: "group-hover/badge:scale-110" }
                        ),
                        _jsxs("div", { className: "absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/95 text-[11px] text-white rounded-md opacity-0 group-hover/badge:opacity-100 pointer-events-none transition-all duration-300 -translate-y-1 group-hover/badge:translate-y-0 whitespace-nowrap z-[100] border border-white/10 shadow-xl capitalize", children: [
                          _jsx("div", { className: "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/95 border-t border-l border-white/10 rotate-45" }),
                          name] }
                        )] }, idx
                      ));

                  })] }
                ),
                _jsxs("p", { style: { fontSize: 13, color: "rgba(255,255,255,0.6)" }, children: ["@", user.username] }),
                _jsx(Divider, {}),

                _jsxs("div", { style: { marginTop: 10 }, children: [
                  _jsx("h3", { style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 4 }, children: "Sobre m\xED" }),
                  _jsx("p", { style: { fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }, children: user.bio || "Sin bio" })] }
                ),
                _jsx(Divider, {}),


                _jsx("div", { style: { display: "flex", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", marginTop: 12, borderRadius: 8, overflow: "hidden", padding: 2 }, children:
                  ["music", "games", "socials", "cosmeticos"].map((tab) => {
                    const active = activeTab === tab;
                    return (
                      _jsx("button", {

                        onClick: () => setActiveTab(tab),
                        style: {
                          flex: 1, padding: "10px 0", fontSize: 11, fontWeight: 600,
                          color: active ? "#fff" : "rgba(255,255,255,0.4)",
                          background: active ? "rgba(255,255,255,0.1)" : "transparent",
                          border: "none", cursor: "pointer", borderRadius: 6,
                          transition: "all 0.2s ease"
                        }, children:

                        tab === "cosmeticos" ? "Colección" : tab.charAt(0).toUpperCase() + tab.slice(1) }, tab
                      ));

                  }) }
                ),

                _jsxs("div", { style: { padding: "15px 0", minHeight: 120 }, children: [
                  activeTab === "music" && (
                  user.favoriteMusic?.title ?
                  _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
                    _jsx("div", { style: { width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }, children: _jsx(Music, { size: 20 }) }),
                    _jsxs("div", { children: [
                      _jsx("div", { style: { fontSize: 14, fontWeight: 600, color: "#fff" }, children: user.favoriteMusic.title }),
                      _jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.6)" }, children: user.favoriteMusic.artist })] }
                    )] }
                  ) :
                  _jsx("p", { style: { fontSize: 13, color: "rgba(255,255,255,0.5)" }, children: "Sin m\xFAsica favorita" })),


                  activeTab === "socials" &&
                  _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children:
                    Object.entries(user.socialLinks || {}).filter(([, v]) => v).map(([k, v]) =>
                    _jsxs("a", { href: v, target: "_blank", rel: "noopener noreferrer", style: { display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: 99, fontSize: 12, color: "#fff", textDecoration: "none" }, children: [
                      _jsx(Link2, { size: 12 }), " ", k] }, k
                    )
                    ) || _jsx("p", { style: { fontSize: 13, color: "rgba(255,255,255,0.5)" }, children: "Sin redes sociales" }) }
                  ),


                  activeTab === "cosmeticos" &&
                  _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children:
                    user.inventory?.map((item) =>
                    _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "10px" }, children: [
                      _jsxs("div", { style: { flex: 1 }, children: [
                        _jsx("div", { style: { fontSize: 13, fontWeight: 600, color: "#fff" }, children: item.name }),
                        _jsx("div", { style: { fontSize: 11, color: RARITY_COLOR[item.rarity] || "#fff" }, children: item.rarity })] }
                      ),
                      item.equipped && _jsx("span", { style: { fontSize: 10, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 99, color: "#fff", fontWeight: 700 }, children: "Equipado" })] }, item.itemId
                    )
                    ) || _jsx("p", { style: { fontSize: 13, color: "rgba(255,255,255,0.5)" }, children: "Sin cosm\xE9ticos" }) }
                  )] }

                )] }
              )] }
            )] }
          ) }
        ) }
      ),



      _jsxs("div", {
        className: "group/bottombar",
        style: {
          display: "flex", alignItems: "center", gap: 8, padding: "5px 10px",
          margin: "0 8px 8px 8px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(35, 36, 40, 0.95)",
          position: "relative",
          overflow: "hidden",
          minHeight: 52,
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }, children: [

        nameplateSrc &&
        _jsxs("div", { style: { position: "absolute", inset: 0, zIndex: 0, opacity: 0.5, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }, className: "group-hover/bottombar:opacity-100 group-hover/bottombar:brightness-110", children: [
          nameplateIsVideo ?
          _jsx("video", { src: nameplateSrc, autoPlay: true, muted: true, loop: true, playsInline: true, style: { width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.05)" } }) :

          _jsx("img", { src: nameplateSrc, alt: "", style: { width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.05)" } }),

          _jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)" } })] }
        ),


        _jsxs("button", {
          onClick: (e) => {
            if (e.shiftKey) {
              setShowStatusMenu(!showStatusMenu);
              setShowCard(false);
            } else {
              setShowCard(!showCard);
              setShowStatusMenu(false);
            }
            setShowNoteForm(false);
          },
          onContextMenu: (e) => {
            e.preventDefault();
            setShowStatusMenu(!showStatusMenu);
            setShowCard(false);
            setShowNoteForm(false);
          },
          style: {
            display: "flex", flex: 1, alignItems: "center", gap: 10, borderRadius: 6, padding: "4px 8px",
            minWidth: 0, textAlign: "left", background: "rgba(255,255,255,0.02)", border: "none", cursor: "pointer",
            fontFamily: "inherit", position: "relative", zIndex: 1, transition: "all 0.2s",
            backdropFilter: nameplateSrc ? "blur(2px)" : "none"
          },
          onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)",
          onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)", children: [

          _jsxs("div", { style: { position: "relative", width: 34, height: 34, flexShrink: 0, zIndex: 1 }, children: [
            _jsx("div", { style: { position: "absolute", inset: 0, borderRadius: "50%", background: grad135 } }),
            _jsx("div", { style: { position: "absolute", inset: 2, borderRadius: "50%", background: "var(--discord-dark)" } }),
            _jsx("div", { style: { position: "absolute", inset: 3, borderRadius: "50%", overflow: "hidden" }, children:
              _jsxs(Avatar, { style: { width: "100%", height: "100%" }, children: [
                _jsx(AvatarImage, { src: avatarSrc, className: "object-cover" }),
                _jsx(AvatarFallback, { children: user?.displayName?.[0] })] }
              ) }
            ),
            avatarDecoSrc && _jsx("img", { src: avatarDecoSrc, alt: "", style: { position: "absolute", inset: "-15%", width: "130%", height: "130%", objectFit: "contain", pointerEvents: "none", zIndex: 3 } }),
            _jsx("span", { style: { position: "absolute", width: 10, height: 10, bottom: -1, right: -1, background: statusColor, borderRadius: "50%", border: "2px solid var(--discord-dark)", zIndex: 4 } })] }
          ),

          _jsxs("div", { style: { minWidth: 0, flex: 1, position: "relative", zIndex: 1 }, children: [
            _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }, children: [
              _jsx("span", { style: { fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textShadow: nameplateSrc ? "0 1px 3px rgba(0,0,0,0.5)" : "none" }, children: user?.displayName ?? "..." }),
              user?.isOctoPro && _jsx(Crown, { style: { width: 11, height: 11, color: color0 } }),

              currentStatus === "invisible" &&
              _jsx("span", { className: "text-[8px] bg-[#4e5058] text-white px-1 rounded-[3px] font-bold uppercase tracking-tighter border border-white/10 animate-pulse", children: "Invisible" }

              )] }

            ),
            _jsxs("div", { style: { position: "relative", height: 15, overflow: "hidden" }, children: [
              _jsx("span", { className: "group-hover/bottombar:translate-y-[-100%] group-hover/bottombar:opacity-0", style: { display: "block", fontSize: 11, color: nameplateSrc ? "rgba(255,255,255,0.7)" : "#949ba4", transition: "all 0.25s" }, children: user?.customStatus || statusLabel }),
              _jsxs("span", { className: "opacity-0 translate-y-[100%] group-hover/bottombar:translate-y-0 group-hover/bottombar:opacity-100", style: { position: "absolute", top: 0, left: 0, width: "100%", fontSize: 11, color: "#fff", fontWeight: 700, transition: "all 0.25s" }, children: ["@", user?.username] })] }
            )] }
          )] }
        ),

        _jsx("button", { onClick: () => onOverlayOpen?.("settings"), style: { borderRadius: 6, padding: 6, color: "#949ba4", background: "transparent", border: "none", cursor: "pointer", position: "relative", zIndex: 1 }, children:
          _jsx(Settings, { style: { width: 16, height: 16 } }) }
        )] }
      ),

      _jsx("style", { children: `
        @keyframes usp-slideUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes usp-fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes usp-zoomIn { from { opacity:0; transform:scale(.95) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes usp-entryFadeIn { from { opacity:0 } to { opacity:1 } }
      ` })] }
    ));

}