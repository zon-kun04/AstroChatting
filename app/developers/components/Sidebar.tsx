"use client";

import { getActiveAccount } from "../../../lib/auth";
import { Cpu, Plus } from "lucide-react";

import { Avatar } from "./ui";
import { assetUrl } from "./api";
import { cn } from "@/lib/utils";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";








export function Sidebar({ bots, selected, onSelect, onNew }) {
  const account = getActiveAccount();
  const decoration = account?.decorations?.avatarDecoration;
  const decorationUrl = decoration ? assetUrl(decoration) : null;

  return (
    _jsxs("div", { className: "w-[232px] flex-shrink-0 bg-[var(--discord-sidebar)] border-r border-white/5 flex flex-col h-full", children: [

      _jsx("div", { className: "p-4 border-b border-white/5", children:
        _jsxs("div", { className: "flex items-center gap-3", children: [
          _jsxs("div", { className: "relative flex-shrink-0", children: [
            _jsx(Avatar, { src: assetUrl(account?.avatar), name: account?.displayName || "?", size: 34 }),
            decorationUrl &&
            _jsx("img", {
              src: decorationUrl,
              className: "absolute inset-[-7px] w-[calc(100%+14px)] h-[calc(100%+14px)] pointer-events-none object-contain z-10",
              alt: "" }
            )] }

          ),
          _jsxs("div", { className: "min-w-0", children: [
            _jsx("p", { className: "m-0 text-[13px] font-bold text-[var(--foreground)] truncate", children:
              account?.displayName || "Developer" }
            ),
            _jsx("p", { className: "m-0 text-[11px] text-[var(--muted-foreground)]", children: "Developer Portal" })] }
          )] }
        ) }
      ),


      _jsxs("div", { className: "px-1.5 py-2", children: [
        _jsx("p", { className: "px-2 mb-1 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest", children: "Applications" }

        ),
        _jsx(NavRow, {
          icon: _jsx(Cpu, { size: 15 }),
          label: "My Bots",
          active: !selected,
          onClick: () => onSelect(null),
          count: bots.length }
        )] }
      ),

      bots.length > 0 &&
      _jsxs(_Fragment, { children: [
        _jsx("div", { className: "mx-2 my-1 border-t border-white/5" }),
        _jsxs("div", { className: "px-1.5 flex-1 overflow-y-auto custom-scrollbar", children: [
          _jsx("p", { className: "px-2 mt-2 mb-1 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest", children: "Your Bots" }

          ),
          bots.map((b) =>
          _jsx(NavRow, {

            icon: _jsx(Avatar, { src: assetUrl(b.avatar), name: b.name, size: 22 }),
            label: b.name,
            active: selected?.id === b.id,
            onClick: () => onSelect(b),
            dot: b.active }, b.id
          )
          )] }
        )] }
      ),



      _jsx("div", { className: "p-2 border-t border-white/5 mt-auto", children:
        _jsxs("button", {
          onClick: onNew,
          className: "w-full flex items-center justify-center gap-2 p-2 rounded-md bg-[var(--discord-blurple)] hover:bg-[var(--discord-blurple)]/80 text-white text-[13px] font-bold transition-colors shadow-sm", children: [

          _jsx(Plus, { size: 15 }), " New Application"] }
        ) }
      )] }
    ));

}

function NavRow({ icon, label, active, onClick, count, dot }) {
  return (
    _jsxs("button", {
      onClick: onClick,
      className: cn(
        "w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-left transition-colors mb-0.5 group",
        active ?
        "bg-white/10 text-[var(--foreground)] font-medium" :
        "bg-transparent text-[var(--muted-foreground)] hover:bg-white/5 hover:text-[var(--foreground)]"
      ), children: [

      _jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        _jsxs("span", { className: "flex-shrink-0 flex items-center relative", children: [
          icon,
          dot !== undefined &&
          _jsx("span", {
            className: cn(
              "absolute -bottom-[1px] -right-[1px] w-2 h-2 rounded-full border border-[var(--discord-sidebar)]",
              dot ? "bg-green-500" : "bg-gray-500"
            ) }
          )] }

        ),
        _jsx("span", { className: "truncate text-[13px] leading-tight flex-1", children: label })] }
      ),
      count !== undefined &&
      _jsx("span", { className: "text-[11px] text-[var(--muted-foreground)] font-semibold", children: count })] }

    ));

}