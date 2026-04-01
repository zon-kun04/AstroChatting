"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  MessageSquare, Hash, Zap, Terminal, PowerOff, Power, Trash2,
  LogOut, Pencil, Upload, Eye, EyeOff, RefreshCw, ExternalLink,
  ShieldCheck, Key, Lock, Copy, Check } from
"lucide-react";


import { Avatar, Chip, CopyBtn, Spinner } from "./ui";
import { BASE, authHeaders, assetUrl } from "./api";
import { cn } from "@/lib/utils";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";


function PasswordGate({
  title,
  description,
  onConfirm,
  onCancel





}) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!pw.trim()) return setError("Password is required.");
    setLoading(true);
    setError("");
    const ok = await onConfirm(pw);
    setLoading(false);
    if (!ok) setError("Incorrect password. Try again.");
  }

  return (
    _jsx("div", {
      className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-150",
      onClick: (e) => e.target === e.currentTarget && onCancel(), children:

      _jsxs("div", { className: "bg-[var(--discord-sidebar)] rounded-xl w-[400px] max-w-[90vw] shadow-[0_24px_50px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-150 overflow-hidden", children: [
        _jsxs("div", { className: "p-6 pb-4 border-b border-white/5 flex items-center gap-3", children: [
          _jsx("div", { className: "w-9 h-9 rounded-full bg-[var(--discord-blurple)]/20 flex items-center justify-center", children:
            _jsx(Lock, { size: 16, className: "text-[var(--discord-blurple)]" }) }
          ),
          _jsxs("div", { children: [
            _jsx("h2", { className: "m-0 text-[15px] font-black text-white", children: title }),
            _jsx("p", { className: "m-0 text-[12px] text-white/40 mt-0.5", children: description })] }
          )] }
        ),
        _jsxs("div", { className: "p-6 flex flex-col gap-4", children: [
          _jsxs("div", { children: [
            _jsx("label", { className: "block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2", children: "Your Password" }

            ),
            _jsxs("div", { className: "relative", children: [
              _jsx("input", {
                type: show ? "text" : "password",
                value: pw,
                onChange: (e) => setPw(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && submit(),
                autoFocus: true,
                placeholder: "Enter your account password...",
                className: "w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 pr-10 text-[14px] text-white outline-none focus:border-[var(--discord-blurple)] transition-colors" }
              ),
              _jsx("button", {
                type: "button",
                onClick: () => setShow(!show),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors", children:

                show ? _jsx(EyeOff, { size: 15 }) : _jsx(Eye, { size: 15 }) }
              )] }
            )] }
          ),
          error &&
          _jsx("p", { className: "m-0 text-[13px] font-bold text-red-400", children: error })] }

        ),
        _jsxs("div", { className: "px-6 py-4 bg-black/20 flex justify-end gap-3 border-t border-white/5", children: [
          _jsx("button", {
            onClick: onCancel,
            className: "px-4 py-2 rounded-lg bg-transparent hover:bg-white/5 text-white font-bold text-[13px] transition-all", children:
            "Cancel" }

          ),
          _jsx("button", {
            onClick: submit,
            disabled: loading,
            className: "px-5 py-2 rounded-lg bg-[var(--discord-blurple)] text-white text-[13px] font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50", children:

            loading ? "Verifying…" : "Confirm" }
          )] }
        )] }
      ) }
    ));

}


function TokenSection({ botId }) {
  const [token, setToken] = useState(null);
  const [showToken, setShowToken] = useState(false);
  const [gate, setGate] = useState(null);
  const [regenConfirm, setRegenConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  async function verifyPassword(pw) {
    try {

      const r = await fetch(`${BASE}/auth/verify-password`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ password: pw })
      });
      return r.ok;
    } catch {
      return false;
    }
  }

  async function fetchToken(pw) {
    const ok = await verifyPassword(pw);
    if (!ok) return false;
    const r = await fetch(`${BASE}/bots/${botId}/token`, { headers: authHeaders() });
    const d = await r.json();
    if (d.token) {
      setToken(d.token);
      setShowToken(true);
      setGate(null);
    }
    return true;
  }

  async function regenToken(pw) {
    const ok = await verifyPassword(pw);
    if (!ok) return false;
    const r = await fetch(`${BASE}/bots/${botId}/token/regenerate`, {
      method: "POST",
      headers: authHeaders()
    });
    const d = await r.json();
    if (d.token) {
      setToken(d.token);
      setShowToken(true);
      setGate(null);
      setRegenConfirm(false);
    }
    return true;
  }

  function copyToken() {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    _jsxs(_Fragment, { children: [
      gate === "reveal" &&
      _jsx(PasswordGate, {
        title: "Reveal Token",
        description: "Confirm your identity before viewing the secret token.",
        onConfirm: fetchToken,
        onCancel: () => setGate(null) }
      ),

      gate === "regen" &&
      _jsx(PasswordGate, {
        title: "Regenerate Token",
        description: "This will invalidate the current token. This action is irreversible.",
        onConfirm: regenToken,
        onCancel: () => setGate(null) }
      ),


      _jsxs("div", { className: "flex flex-col gap-3", children: [
        _jsxs("div", { className: "bg-black/30 border border-white/5 rounded-xl p-4 flex items-center gap-3 group", children: [
          _jsx(Key, { size: 16, className: "text-white/30 flex-shrink-0" }),
          _jsx("div", { className: "flex-1 min-w-0", children:
            showToken && token ?
            _jsx("code", { className: "text-[13px] text-white/90 font-mono break-all leading-relaxed select-all", children:
              token }
            ) :

            _jsx("span", { className: "text-[13px] text-white/30 font-mono tracking-[0.25em] select-none", children:
              "•".repeat(40) }
            ) }

          ),
          _jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
            showToken && token &&
            _jsx("button", {
              onClick: copyToken,
              className: cn(
                "p-1.5 rounded-md transition-colors",
                copied ? "text-green-500" : "text-white/40 hover:text-white"
              ),
              title: "Copy token", children:

              copied ? _jsx(Check, { size: 14 }) : _jsx(Copy, { size: 14 }) }
            ),

            _jsx("button", {
              onClick: () => {
                if (showToken) {
                  setShowToken(false);
                  setToken(null);
                } else {
                  setGate("reveal");
                }
              },
              className: "p-1.5 rounded-md text-white/40 hover:text-white transition-colors",
              title: showToken ? "Hide token" : "Reveal token", children:

              showToken ? _jsx(EyeOff, { size: 14 }) : _jsx(Eye, { size: 14 }) }
            )] }
          )] }
        ),

        _jsxs("div", { className: "flex items-start gap-3 p-3 bg-yellow-500/5 border border-yellow-500/15 rounded-lg", children: [
          _jsx(ShieldCheck, { size: 14, className: "text-yellow-500/70 mt-0.5 flex-shrink-0" }),
          _jsx("p", { className: "m-0 text-[12px] text-yellow-500/70 leading-relaxed", children: "Keep your token secret. Anyone with this token can control your bot. Never share it publicly." }

          )] }
        ),

        _jsxs("button", {
          onClick: () => setGate("regen"),
          className: "self-start flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[13px] font-bold hover:bg-orange-500/20 active:scale-95 transition-all", children: [

          _jsx(RefreshCw, { size: 13, strokeWidth: 3 }), "Regenerate Token"] }

        )] }
      )] }
    ));

}


function InlineEditField({
  label,
  value,
  mono = false,
  onSave,
  maxLength = 100,
  placeholder = ""







}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  async function save() {
    if (draft === value) {setEditing(false);return;}
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      _jsxs("div", { className: "flex flex-col gap-1.5", children: [
        _jsx("label", { className: "text-[11px] font-bold text-white/40 uppercase tracking-wider", children: label }),
        _jsxs("div", { className: "flex items-center gap-2", children: [
          _jsx("input", {
            ref: inputRef,
            value: draft,
            onChange: (e) => setDraft(e.target.value.slice(0, maxLength)),
            onKeyDown: (e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            },
            placeholder: placeholder,
            className: cn(
              "flex-1 bg-black/30 border border-[var(--discord-blurple)] rounded-lg px-3 py-2 text-[14px] text-white outline-none transition-colors",
              mono && "font-mono"
            ) }
          ),
          _jsx("button", {
            onClick: save,
            disabled: saving,
            className: "px-3 py-2 rounded-lg bg-[var(--discord-blurple)] text-white text-[12px] font-bold hover:brightness-110 disabled:opacity-50 transition-all active:scale-95", children:

            saving ? "…" : "Save" }
          ),
          _jsx("button", {
            onClick: cancel,
            className: "px-3 py-2 rounded-lg bg-white/5 text-white/60 text-[12px] font-bold hover:bg-white/10 transition-all", children:
            "Cancel" }

          )] }
        ),
        _jsxs("p", { className: "m-0 text-[11px] text-white/25 text-right", children: [draft.length, "/", maxLength] })] }
      ));

  }

  return (
    _jsxs("div", {
      className: "group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors",
      onClick: () => {setDraft(value);setEditing(true);}, children: [

      _jsxs("div", { className: "flex flex-col gap-0.5", children: [
        _jsx("span", { className: "text-[11px] font-bold text-white/30 uppercase tracking-wider", children: label }),
        _jsx("span", { className: cn("text-[14px] text-white/90", mono && "font-mono"), children:
          value || _jsx("span", { className: "text-white/30 italic", children: placeholder || "Not set" }) }
        )] }
      ),
      _jsx(Pencil, { size: 13, className: "text-white/0 group-hover:text-white/40 transition-colors" })] }
    ));

}


export function BotDetailPage({
  bot,
  onUpdate,
  onBack




}) {
  const [tab, setTab] = useState("general");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/bots/${bot.id}/chats`, { headers: authHeaders() }).
    then((r) => r.json()).
    then((d) => {
      const chatsList = d.chats || [];
      const botMsgs = chatsList.reduce((acc, c) => acc + (c.botMessageCount || 0), 0);
      setStats({
        totalMessages: botMsgs,
        activeChats: chatsList.length,
        totalReactions: 0,
        commandsRun: 0
      });
    }).
    catch(() => {});
  }, [bot.id]);

  async function toggle() {
    await fetch(`${BASE}/bots/${bot.id}/${bot.active ? "stop" : "start"}`, {
      method: "POST",
      headers: authHeaders()
    });
    onUpdate();
  }

  async function del() {
    if (!confirm(`Delete "${bot.name}"? This cannot be undone.`)) return;
    await fetch(`${BASE}/bots/${bot.id}`, { method: "DELETE", headers: authHeaders() });
    onBack();
  }

  const TABS = [
  { id: "general", label: "General" },
  { id: "token", label: "Bot Token" },
  { id: "chats", label: "Chats" },
  { id: "activity", label: "Activity" },
  { id: "whitelist", label: "Whitelist" }];


  return (
    _jsxs("div", { className: "flex flex-col h-full bg-[var(--discord-background)]", children: [
      _jsx("div", { className: "flex items-end gap-6 px-10 border-b border-white/5 flex-shrink-0 pt-4 bg-[var(--discord-sidebar)]", children:
        TABS.map((t) =>
        _jsxs("button", {

          onClick: () => setTab(t.id),
          className: cn(
            "px-1 pb-3 text-[14px] font-bold transition-all border-b-2 tracking-wide -mb-[1px] flex items-center gap-1.5",
            tab === t.id ?
            "border-[var(--discord-blurple)] text-[var(--foreground)]" :
            "border-transparent text-[var(--muted-foreground)] hover:text-white/80"
          ), children: [

          t.id === "token" && _jsx(Key, { size: 13 }),
          t.label] }, t.id
        )
        ) }
      ),

      _jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-10 animate-in fade-in duration-200", children: [
        tab === "general" &&
        _jsx(GeneralTab, { bot: bot, stats: stats, onToggle: toggle, onDelete: del, onUpdate: onUpdate }),

        tab === "token" &&
        _jsxs("div", { className: "max-w-[760px] mx-auto w-full flex flex-col gap-6", children: [
          _jsx(Section, { title: "Bot Token", children:
            _jsx(TokenSection, { botId: bot.id }) }
          ),
          _jsx(Section, { title: "API Usage", children:
            _jsxs("div", { className: "flex flex-col gap-3 text-[13px] text-white/60 leading-relaxed", children: [
              _jsxs("p", { className: "m-0", children: ["Use your token in the ", _jsx("code", { className: "bg-white/10 px-1.5 py-0.5 rounded text-[12px] font-mono text-white/80", children: "Authorization" }), " header:"] }),
              _jsx("pre", { className: "bg-black/30 rounded-lg p-4 font-mono text-[12px] text-white/80 overflow-x-auto border border-white/5 leading-relaxed", children:
                `Authorization: Bearer <your_token>

// Connect
POST ${BASE}/bots/connect

// Send message
POST ${BASE}/bots/message
{ "chatId": "...", "content": "Hello!" }

// Get messages
GET ${BASE}/bots/chats/:chatId/messages` }
              )] }
            ) }
          )] }
        ),

        tab === "chats" && _jsx(ChatsTab, { botId: bot.id }),
        tab === "activity" && _jsx(ActivityTab, { botId: bot.id }),
        tab === "whitelist" && _jsx(WhitelistTab, { botId: bot.id })] }
      )] }
    ));

}


function GeneralTab({ bot, stats, onToggle, onDelete, onUpdate }) {
  const [desc, setDesc] = useState(bot.description || "");
  const [savingDesc, setSavingDesc] = useState(false);
  const avatarFileRef = useRef(null);
  const bannerFileRef = useRef(null);

  async function patchBot(fields) {
    await fetch(`${BASE}/bots/${bot.id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(fields)
    });
    if (onUpdate) onUpdate();
  }

  async function handleDescSave() {
    setSavingDesc(true);
    await patchBot({ description: desc });
    setSavingDesc(false);
  }

  async function uploadImage(e, type) {
    if (!e.target.files?.[0]) return;
    const body = new FormData();
    body.append(type, e.target.files[0]);
    const hdrs = authHeaders();
    delete hdrs["Content-Type"];
    await fetch(`${BASE}/bots/${bot.id}/${type}`, { method: "POST", headers: hdrs, body });
    if (onUpdate) onUpdate();
  }

  return (
    _jsxs("div", { className: "flex flex-col gap-8 max-w-[760px] mx-auto w-full", children: [

      _jsxs(Section, { title: "Bot Profile", children: [
        _jsxs("div", { className: "rounded-xl overflow-hidden relative shadow-lg group/banner", children: [

          bot.banner ?
          _jsx("img", { src: assetUrl(bot.banner), className: "w-full h-32 object-cover block" }) :

          _jsx("div", { className: "h-32 bg-gradient-to-r from-[#1e2157] to-[#2d1f4a]" }),

          _jsx("button", {
            onClick: () => bannerFileRef.current?.click(),
            className: "absolute top-3 right-3 bg-black/60 p-2 rounded-[6px] opacity-0 group-hover/banner:opacity-100 hover:bg-black/90 transition-all text-white shadow-md",
            title: "Change banner", children:

            _jsx(Pencil, { size: 15 }) }
          ),


          _jsx("div", { className: "absolute left-6 -bottom-11 z-10", children:
            _jsxs("div", {
              className: "border-[5px] border-[var(--discord-sidebar)] rounded-full w-[84px] h-[84px] overflow-hidden bg-[var(--discord-sidebar)] relative group/avatar cursor-pointer shadow-lg",
              onClick: () => avatarFileRef.current?.click(), children: [

              _jsx(Avatar, { src: assetUrl(bot.avatar), name: bot.name, size: 74 }),
              _jsx("div", { className: "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-full", children:
                _jsx(Upload, { size: 20, className: "text-white" }) }
              )] }
            ) }
          ),

          _jsx("input", { type: "file", hidden: true, ref: bannerFileRef, accept: "image/*", onChange: (e) => uploadImage(e, "banner") }),
          _jsx("input", { type: "file", hidden: true, ref: avatarFileRef, accept: "image/*", onChange: (e) => uploadImage(e, "avatar") })] }
        ),


        _jsxs("div", { className: "pt-14 flex flex-col gap-4", children: [
          _jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            _jsx("h2", { className: "text-2xl font-black text-white m-0 tracking-tight", children: bot.name }),
            _jsx(Chip, { label: "BOT" }),
            _jsx(Chip, {
              label: bot.active ? "Online" : "Offline",
              color: bot.active ? "#23a55a" : "#ed4245" }
            ),
            _jsxs("div", { className: "ml-auto flex gap-2", children: [
              _jsx(DangerBtn, {
                label: bot.active ? "Stop" : "Start",
                onClick: onToggle,
                danger: bot.active,
                icon: bot.active ? _jsx(PowerOff, { size: 13, strokeWidth: 3 }) : _jsx(Power, { size: 13, strokeWidth: 3 }) }
              ),
              _jsx(DangerBtn, {
                label: "Delete",
                onClick: onDelete,
                danger: true,
                icon: _jsx(Trash2, { size: 13, strokeWidth: 3 }) }
              )] }
            )] }
          ),


          _jsxs("div", { className: "flex flex-col gap-1 relative", children: [
            _jsx("label", { className: "text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1", children: "About Me" }),
            _jsx("textarea", {
              value: desc,
              onChange: (e) => setDesc(e.target.value),
              className: "bg-black/20 border border-white/5 rounded-lg p-3 text-[14px] text-white/90 outline-none focus:border-[var(--discord-blurple)] transition-colors resize-none leading-relaxed",
              rows: 3,
              placeholder: "Write a cool description for your bot..." }
            ),
            desc !== (bot.description || "") &&
            _jsx("button", {
              onClick: handleDescSave,
              disabled: savingDesc,
              className: "absolute bottom-3 right-3 bg-[var(--discord-blurple)] text-white text-[12px] font-bold px-3 py-1.5 rounded-md shadow-md hover:brightness-110 disabled:opacity-50 transition-all active:scale-95", children:

              savingDesc ? "Saving…" : "Save Changes" }
            )] }

          ),


          _jsxs("div", { className: "flex items-center gap-2 bg-black/20 self-start px-3 py-1.5 rounded-lg border border-white/5", children: [
            _jsx("span", { className: "text-[11px] font-bold text-white/40 uppercase tracking-wider", children: "Client ID" }),
            _jsx("code", { className: "text-[12px] text-white/90 font-mono", children: bot.id }),
            _jsx(CopyBtn, { text: bot.id })] }
          )] }
        )] }
      ),


      _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        _jsx(Section, { title: "Statistics", children:
          _jsx("div", { className: "grid grid-cols-2 gap-3", children:
            [
            { label: "Messages", value: stats?.totalMessages, icon: _jsx(MessageSquare, { size: 16, className: "text-[var(--discord-blurple)]" }) },
            { label: "Chats", value: stats?.activeChats, icon: _jsx(Hash, { size: 16, className: "text-[#23a55a]" }) },
            { label: "Reactions", value: stats?.totalReactions, icon: _jsx(Zap, { size: 16, className: "text-[#f0b232]" }) },
            { label: "Commands", value: stats?.commandsRun, icon: _jsx(Terminal, { size: 16, className: "text-[#eb459e]" }) }].
            map(({ label, value, icon }) =>
            _jsxs("div", { className: "bg-black/20 rounded-xl p-4 border border-white/5", children: [
              _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [icon, _jsx("span", { className: "text-[11px] uppercase tracking-wider font-bold text-white/50", children: label })] }),
              _jsx("span", { className: "text-2xl font-black text-white", children: value ?? "—" })] }, label
            )
            ) }
          ) }
        ),

        _jsx(Section, { title: "Details", children:
          _jsxs("div", { className: "flex flex-col divide-y divide-white/5", children: [
            _jsx(InfoRow, { label: "Username", value: `@${bot.username}` }),
            _jsx(InfoRow, { label: "Privacy", value: _jsx("span", { className: "capitalize", children: bot.privacy }) }),
            _jsx(InfoRow, {
              label: "Created",
              value: new Date(bot.createdAt).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric"
              }) }
            )] }
          ) }
        )] }
      ),


      _jsx(Section, { title: "Settings", children:
        _jsxs("div", { className: "flex flex-col divide-y divide-white/5", children: [
          _jsx(InlineEditField, {
            label: "Display Name",
            value: bot.name,
            placeholder: "My Awesome Bot",
            maxLength: 32,
            onSave: (v) => patchBot({ name: v }) }
          ),
          _jsx(InlineEditField, {
            label: "Command Prefix",
            value: bot.prefix,
            placeholder: "!",
            mono: true,
            maxLength: 8,
            onSave: (v) => patchBot({ prefix: v }) }
          )] }
        ) }
      ),


      _jsx(Section, { title: "Privacy", children:
        _jsx("div", { className: "flex flex-col gap-3", children:
          ["public", "owner", "whitelist"].map((opt) =>
          _jsxs("label", {

            className: cn(
              "flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all",
              bot.privacy === opt ?
              "border-[var(--discord-blurple)]/50 bg-[var(--discord-blurple)]/10" :
              "border-white/5 hover:bg-white/5"
            ), children: [

            _jsx("input", {
              type: "radio",
              name: "privacy",
              value: opt,
              checked: bot.privacy === opt,
              onChange: () => patchBot({ privacy: opt }),
              className: "accent-[var(--discord-blurple)]" }
            ),
            _jsxs("div", { children: [
              _jsx("p", { className: "m-0 text-[13px] font-bold text-white capitalize", children: opt }),
              _jsxs("p", { className: "m-0 text-[12px] text-white/40", children: [
                opt === "public" && "Anyone can interact with your bot",
                opt === "owner" && "Only you can interact with your bot",
                opt === "whitelist" && "Only whitelisted users can interact"] }
              )] }
            )] }, opt
          )
          ) }
        ) }
      )] }
    ));

}


function ChatsTab({ botId }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/bots/${botId}/chats`, { headers: authHeaders() }).
    then((r) => r.json()).
    then((d) => setChats(d.chats || [])).
    finally(() => setLoading(false));
  }, [botId]);

  if (loading) return _jsx(Spinner, {});

  return (
    _jsx("div", { className: "max-w-[760px] mx-auto w-full", children:
      _jsx(Section, { title: `Active Chats (${chats.length})`, children:
        chats.length === 0 ?
        _jsx(Empty, { label: "No active chats right now." }) :

        _jsx("div", { className: "flex flex-col gap-2", children:
          chats.map((c) =>
          _jsxs("div", {

            className: "flex items-center gap-4 p-4 rounded-xl bg-black/10 border border-white/5 hover:bg-white/5 transition-colors group", children: [

            _jsx("div", { className: "h-10 w-10 bg-[var(--discord-blurple)]/15 rounded-full flex items-center justify-center flex-shrink-0", children:
              _jsx(Hash, { size: 18, className: "text-[var(--discord-blurple)]" }) }
            ),
            _jsxs("div", { className: "flex-1 min-w-0", children: [
              _jsx("p", { className: "m-0 text-[13px] font-bold text-white truncate font-mono", children: c.id }),
              _jsxs("p", { className: "m-0 text-[12px] text-white/40 mt-0.5", children: [
                c.participants.length, " participants \u2022 ", c.botMessageCount, " bot messages"] }
              ),
              c.lastMessage &&
              _jsxs("p", { className: "m-0 text-[12px] text-white/30 truncate mt-0.5 italic", children: ["\"",
                c.lastMessage.content, "\""] }
              )] }

            ),
            _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
              _jsx(Chip, { label: c.type, color: "#949ba4" }),
              _jsxs("a", {
                href: `/chat/${c.id}`,
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--discord-blurple)]/15 text-[var(--discord-blurple)] text-[12px] font-bold hover:bg-[var(--discord-blurple)]/30 transition-colors opacity-0 group-hover:opacity-100",
                title: "Open chat", children: [

                _jsx(ExternalLink, { size: 12 }), "Open"] }

              )] }
            )] }, c.id
          )
          ) }
        ) }

      ) }
    ));

}


const A_COLOR = {
  message_sent: "#5865f2",
  file_sent: "#5865f2",
  bot_start: "#23a55a",
  bot_stop: "#ed4245",
  joined_chat: "#f0b232",
  bot_created: "#eb459e",
  token_regenerated: "#ff7b00",
  bot_updated: "#00b0f4",
  whitelist_add: "#23a55a",
  whitelist_remove: "#ed4245",
  bot_connect: "#23a55a",
  bot_deleted: "#ed4245"
};

function ActivityTab({ botId }) {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/bots/${botId}/activity?limit=50`, { headers: authHeaders() }).
    then((r) => r.json()).
    then((d) => setLog(d.activity || [])).
    finally(() => setLoading(false));
  }, [botId]);

  if (loading) return _jsx(Spinner, {});

  return (
    _jsx("div", { className: "max-w-[760px] mx-auto w-full", children:
      _jsx(Section, { title: "Recent Activity", children:
        log.length === 0 ?
        _jsx(Empty, { label: "No activity found yet." }) :

        _jsx("div", { className: "flex flex-col", children:
          log.map((item, i) =>
          _jsxs("div", {

            className: cn(
              "flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors",
              i < log.length - 1 ? "border-b border-white/5" : ""
            ), children: [

            _jsx("div", {
              className: "w-2 h-2 rounded-full flex-shrink-0",
              style: { backgroundColor: A_COLOR[item.action] || "#63686e", boxShadow: `0 0 6px ${A_COLOR[item.action] || "#63686e"}60` } }
            ),
            _jsx("code", {
              className: "text-[11px] font-bold min-w-[150px] uppercase tracking-wider",
              style: { color: A_COLOR[item.action] || "#949ba4" }, children:

              item.action }
            ),
            _jsx("span", { className: "text-[13px] text-white/60 flex-1 truncate", children:
              item.detail || item.chatId || _jsx("span", { className: "italic text-white/25", children: "No details" }) }
            ),
            _jsx("span", { className: "text-[11px] text-white/25 font-bold whitespace-nowrap", children:
              new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
            )] }, i
          )
          ) }
        ) }

      ) }
    ));

}


function WhitelistTab({ botId }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState("");

  const load = useCallback(() => {
    fetch(`${BASE}/bots/${botId}/whitelist`, { headers: authHeaders() }).
    then((r) => r.json()).
    then((d) => setList(d.whitelist || [])).
    finally(() => setLoading(false));
  }, [botId]);

  useEffect(() => {load();}, [load]);

  async function add(e) {
    if (e) e.preventDefault();
    if (!newId.trim()) return;
    await fetch(`${BASE}/bots/${botId}/whitelist/${newId.trim()}`, { method: "POST", headers: authHeaders() });
    setNewId("");
    load();
  }

  async function remove(uid) {
    await fetch(`${BASE}/bots/${botId}/whitelist/${uid}`, { method: "DELETE", headers: authHeaders() });
    load();
  }

  if (loading) return _jsx(Spinner, {});

  return (
    _jsxs("div", { className: "max-w-[760px] mx-auto w-full flex flex-col gap-6", children: [
      _jsx(Section, { title: "Add to Whitelist", children:
        _jsxs("form", { onSubmit: add, className: "flex gap-3", children: [
          _jsx("input", {
            value: newId,
            onChange: (e) => setNewId(e.target.value),
            placeholder: "Paste User ID here...",
            className: "flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white placeholder:text-white/30 outline-none focus:border-[var(--discord-blurple)] transition-colors font-mono" }
          ),
          _jsx("button", {
            type: "submit",
            className: "px-6 py-2.5 rounded-lg bg-[var(--discord-blurple)] text-white font-bold text-[14px] hover:brightness-110 active:scale-95 transition-all shadow-md", children:
            "Add" }

          )] }
        ) }
      ),

      _jsx(Section, { title: `Whitelisted Users (${list.length})`, children:
        list.length === 0 ?
        _jsx(Empty, { label: "No users in the whitelist yet." }) :

        _jsx("div", { className: "flex flex-col gap-2", children:
          list.map((u) =>
          _jsxs("div", {

            className: "flex items-center gap-4 px-4 py-3 bg-black/10 border border-white/5 rounded-xl hover:bg-white/5 transition-colors", children: [

            _jsx(Avatar, { src: assetUrl(u.avatar), name: u.displayName || u.id, size: 36 }),
            _jsxs("div", { className: "flex-1 min-w-0", children: [
              _jsx("p", { className: "m-0 text-[14px] text-white font-bold", children: u.displayName || u.id }),
              u.username && _jsxs("p", { className: "m-0 text-[12px] text-white/40", children: ["@", u.username] })] }
            ),
            _jsx("button", {
              onClick: () => remove(u.id),
              className: "p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors",
              title: "Remove", children:

              _jsx(LogOut, { size: 15 }) }
            )] }, u.id
          )
          ) }
        ) }

      )] }
    ));

}


function Section({ title, children }) {
  return (
    _jsxs("div", { className: "flex flex-col", children: [
      _jsx("h2", { className: "m-0 mb-3 px-1 text-[12px] font-black text-white/40 uppercase tracking-[0.1em]", children:
        title }
      ),
      _jsx("div", { className: "bg-[var(--discord-sidebar)] rounded-2xl border border-white/5 p-6 shadow-sm", children:
        children }
      )] }
    ));

}

function InfoRow({ label, value }) {
  return (
    _jsxs("div", { className: "flex justify-between items-center py-2.5", children: [
      _jsx("span", { className: "text-[13px] font-bold text-white/40 tracking-wide uppercase", children: label }),
      _jsx("span", { className: "text-[14px] text-white/90 font-medium", children: value })] }
    ));

}

function DangerBtn({ label, onClick, danger, icon }) {
  return (
    _jsxs("button", {
      onClick: onClick,
      className: cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all shadow-sm active:scale-95",
        danger ?
        "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" :
        "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white"
      ), children: [

      icon,
      label] }
    ));

}

function Empty({ label }) {
  return (
    _jsx("p", { className: "text-center py-10 m-0 text-[13px] font-medium text-white/30 italic", children: label }));

}