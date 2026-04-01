"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";import { jsx as _jsx } from "react/jsx-runtime";

export function Avatar({ src, name, size = 32 }) {
  return src ?
  _jsx("img", { src: src, className: "flex-shrink-0 object-cover rounded-full", style: { width: size, height: size } }) :

  _jsx("div", {
    className: "flex-shrink-0 rounded-full bg-[var(--discord-blurple)] flex items-center justify-center font-bold text-white",
    style: { width: size, height: size, fontSize: size * 0.38 }, children:

    name[0]?.toUpperCase() }
  );

}

export function Chip({ label, color = "#5865f2" }) {
  return (
    _jsx("span", {
      className: "text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider flex items-center justify-center",
      style: { color: color, backgroundColor: `${color}20`, border: `1px solid ${color}35` }, children:

      label }
    ));

}

export function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    _jsx("button", {
      onClick: () => {
        navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      },
      className: `p-1 rounded transition-colors ${ok ? "text-green-500" : "text-[var(--muted-foreground)] hover:text-white"}`, children:

      ok ? _jsx(Check, { size: 14 }) : _jsx(Copy, { size: 14 }) }
    ));

}

export function Spinner() {
  return (
    _jsx("div", { className: "flex justify-center p-12", children:
      _jsx("div", { className: "w-6 h-6 rounded-full border-2 border-[var(--discord-darker)] border-t-[var(--discord-blurple)] animate-spin" }) }
    ));

}