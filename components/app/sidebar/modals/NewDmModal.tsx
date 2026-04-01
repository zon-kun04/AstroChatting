"use client";



import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Search, MessageCircle, Loader2, Users } from "lucide-react";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";










function statusDot(status) {
  if (status === "online") return "bg-emerald-500";
  if (status === "idle") return "bg-yellow-400";
  if (status === "dnd") return "bg-red-500";
  return null;
}






export function NewDmModal({ onClose, onCreated }) {
  const [query, setQuery] = useState("");
  const [friends, setFriends] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api.get("/friends").
    then((d) => setFriends(d.friends)).
    catch(() => setFriends([])).
    finally(() => setLoading(false));
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {setResults([]);setSearching(false);return;}
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const d = await api.get(`/users?q=${encodeURIComponent(query.trim())}`);
        setResults(d.users);
      } catch {setResults([]);} finally
      {setSearching(false);}
    }, 350);
  }, [query]);

  const handleSelect = useCallback(async (userId) => {
    if (creating) return;
    setCreating(userId);
    setError(null);
    try {
      const d = await api.post("/chats", { userId });
      onCreated(d.chat.id);
      onClose();
    } catch (e) {
      setError(e?.message || "No se pudo abrir el chat");
      setCreating(null);
    }
  }, [creating, onCreated, onClose]);

  const showSearch = query.trim().length >= 2;
  const displayList = showSearch ? results : friends;
  const isLoading = showSearch ? searching : loading;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    _jsxs("div", { className: "fixed inset-0 z-[99999] flex items-center justify-center",
      onKeyDown: (e) => e.key === "Escape" && onClose(), children: [


      _jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-[2px]", onClick: onClose }),


      _jsxs("div", { className: "relative z-10 w-full max-w-md mx-4 flex flex-col max-h-[85vh] rounded-xl shadow-2xl",
        style: { background: "#313338" }, children: [


        _jsxs("div", { className: "flex items-center justify-between px-5 pt-5 pb-3", children: [
          _jsxs("div", { children: [
            _jsx("h2", { className: "text-[15px] font-semibold text-white", children: "Nuevo mensaje directo" }),
            _jsx("p", { className: "text-[12px] text-[var(--muted-foreground)] mt-0.5", children: "Busca un amigo o usuario para chatear" }

            )] }
          ),
          _jsx("button", { onClick: onClose,
            className: "flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-white/10 hover:text-white transition-colors", children:
            _jsx(X, { className: "h-4 w-4" }) }
          )] }
        ),


        _jsx("div", { className: "px-5 pb-3", children:
          _jsxs("div", { className: "relative flex items-center", children: [
            _jsx(Search, { className: "absolute left-3 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" }),
            _jsx("input", {
              ref: inputRef,
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Buscar usuario o @username...",
              className: "h-10 w-full rounded-lg pl-9 pr-4 text-sm text-white bg-[#1e1f22] border border-white/5 outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--discord-blurple)] transition-all" }
            )] }
          ) }
        ),


        _jsx("div", { className: "px-5 pb-2", children:
          _jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]", children:
            showSearch ? "Resultados" : "Amigos" }
          ) }
        ),


        _jsxs("div", { className: "mx-2 mb-3 max-h-72 overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-[var(--discord-dark)] scrollbar-track-transparent", children: [
          isLoading &&
          _jsx("div", { className: "flex items-center justify-center py-8", children:
            _jsx(Loader2, { className: "h-5 w-5 animate-spin text-[var(--muted-foreground)]" }) }
          ),


          !isLoading && displayList.length === 0 &&
          _jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
            _jsx(Users, { className: "h-8 w-8 text-[var(--muted-foreground)] mb-2 opacity-40" }),
            _jsx("p", { className: "text-sm text-[var(--muted-foreground)]", children:
              showSearch ? "Sin resultados" : "No tienes amigos aún" }
            )] }
          ),


          !isLoading && displayList.map((user) => {
            const dot = statusDot(user.status);
            const isCreating = creating === user.id;
            return (
              _jsxs("button", { onClick: () => handleSelect(user.id),
                disabled: !!creating,
                className: "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 active:bg-white/10 disabled:opacity-60 disabled:pointer-events-none transition-colors", children: [
                _jsxs("div", { className: "relative flex-shrink-0", children: [
                  _jsxs(Avatar, { className: "h-9 w-9", children: [
                    _jsx(AvatarImage, { src: user.avatar ?? undefined }),
                    _jsx(AvatarFallback, { className: "bg-[var(--discord-blurple)] text-white text-xs font-semibold", children:
                      (user.displayName?.[0] || user.username?.[0] || "?").toUpperCase() }
                    )] }
                  ),
                  dot &&
                  _jsx("span", { className: cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-[#313338]", dot) })] }

                ),

                _jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
                  _jsxs("div", { className: "flex items-center gap-1.5", children: [
                    _jsx("span", { className: "truncate text-[13px] font-medium text-white", children: user.displayName }),
                    user.isOctoPro &&
                    _jsx("span", { className: "flex-shrink-0 rounded px-1 py-0.5 text-[9px] font-bold bg-[var(--discord-blurple)] text-white", children: "PRO" })] }

                  ),
                  _jsxs("span", { className: "truncate text-[11px] text-[var(--muted-foreground)]", children: ["@", user.username] })] }
                ),

                _jsx("div", { className: "flex-shrink-0", children:
                  isCreating ?
                  _jsx(Loader2, { className: "h-4 w-4 animate-spin text-[var(--discord-blurple)]" }) :
                  _jsx(MessageCircle, { className: "h-4 w-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" }) }

                )] }, user.id
              ));

          })] }
        ),

        error &&
        _jsx("div", { className: "mx-5 mb-3 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2", children:
          _jsx("p", { className: "text-[12px] text-red-400", children: error }) }
        ),


        _jsx("div", { className: "flex justify-end border-t border-white/5 px-5 py-4", children:
          _jsx("button", { onClick: onClose,
            className: "rounded-md px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-white hover:bg-white/5 transition-colors", children: "Cancelar" }

          ) }
        )] }
      )] }
    ),
    document.body
  );
}