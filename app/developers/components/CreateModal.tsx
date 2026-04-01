"use client";

import { useState } from "react";
import { BASE, authHeaders } from "./api";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";



export function CreateModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [prefix, setPrefix] = useState("!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim()) return setError("Name is required.");
    setLoading(true);
    try {
      const r = await fetch(`${BASE}/bots`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name, description: desc, prefix })
      });
      const d = await r.json();
      if (!r.ok) return setError(d.error || "Failed context create app.");
      onCreate();
      onClose();
    } catch {
      setError("Network error occurred with backend connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    _jsx("div", {
      className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200",
      onClick: (e) => e.target === e.currentTarget && onClose(), children:

      _jsxs("div", { className: "bg-[var(--discord-sidebar)] rounded-xl w-[460px] max-w-[90vw] shadow-[0_24px_50px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col", children: [
        _jsxs("div", { className: "p-6 pb-4 border-b border-white/5 relative", children: [
          _jsx("h2", { className: "m-0 text-xl font-black text-white tracking-tight", children: "Create an application" }),
          _jsx("p", { className: "m-0 mt-2 text-[13px] text-white/50 leading-relaxed max-w-[90%]", children: "Get your backend tokens and webhook capabilities immediately." }

          )] }
        ),
        _jsxs("div", { className: "p-6 flex flex-col gap-5 flex-1", children: [
          _jsxs("div", { children: [
            _jsxs("label", { className: "block text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2", children: ["Name ",
              _jsx("span", { className: "text-red-500", children: "*" })] }
            ),
            _jsx("input", {
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "e.g. My Premium Bot",
              className: "w-full bg-[var(--discord-darker)] border border-white/5 rounded-lg px-3 py-2.5 text-[14px] text-white outline-none focus:border-[var(--discord-blurple)] transition-colors" }
            )] }
          ),
          _jsxs("div", { children: [
            _jsx("label", { className: "block text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2", children: "Description" }

            ),
            _jsx("textarea", {
              value: desc,
              onChange: (e) => setDesc(e.target.value),
              rows: 3,
              placeholder: "What does it do?",
              className: "w-full bg-[var(--discord-darker)] border border-white/5 rounded-lg px-3 py-2.5 text-[14px] text-white outline-none focus:border-[var(--discord-blurple)] transition-colors resize-none" }
            )] }
          ),
          _jsxs("div", { children: [
            _jsx("label", { className: "block text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2", children: "Prefix" }

            ),
            _jsx("input", {
              value: prefix,
              onChange: (e) => setPrefix(e.target.value),
              placeholder: "!",
              className: "w-24 bg-[var(--discord-darker)] border border-white/5 rounded-lg px-3 py-2.5 text-[14px] text-white font-mono text-center outline-none focus:border-[var(--discord-blurple)] transition-colors" }
            )] }
          ),
          error && _jsx("p", { className: "m-0 text-[13px] font-bold text-red-400 mt-2", children: error })] }
        ),
        _jsxs("div", { className: "px-6 py-4 bg-black/20 flex justify-end gap-3 border-t border-white/5", children: [
          _jsx("button", {
            onClick: onClose,
            className: "px-5 py-2 rounded-[8px] border-none bg-transparent hover:bg-white/5 hover:underline text-white font-bold text-[13px] cursor-pointer transition-all", children:
            "Cancel" }

          ),
          _jsx("button", {
            onClick: submit,
            disabled: loading,
            className: "px-5 py-2 rounded-[8px] bg-[var(--discord-blurple)] text-white text-[13px] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50", children:

            loading ? "Creating…" : "Create App" }
          )] }
        )] }
      ) }
    ));

}