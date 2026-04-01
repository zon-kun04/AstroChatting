"use client";

import { Bot, ChevronRight, Plus } from "lucide-react";

import { Avatar, Chip } from "./ui";
import { assetUrl } from "./api";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export function BotListPage({
  bots,
  onSelect,
  onNew




}) {
  return (
    _jsxs("div", { className: "p-8 max-w-[860px] mx-auto w-full animate-in fade-in zoom-in-95 duration-200", children: [
      _jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        _jsxs("div", { children: [
          _jsx("h1", { className: "text-2xl font-black text-[var(--foreground)] m-0", children: "Applications" }),
          _jsx("p", { className: "text-[13px] text-[var(--muted-foreground)] mt-1", children: "Manage your custom bots and backend integrations" }

          )] }
        ),
        _jsxs("button", {
          onClick: onNew,
          className: "flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--discord-blurple)] hover:bg-[var(--discord-blurple)]/80 text-white text-[13px] font-bold transition-all shadow-sm active:scale-95", children: [

          _jsx(Plus, { size: 16, strokeWidth: 3 }), " New Application"] }
        )] }
      ),

      bots.length === 0 ?
      _jsxs("div", { className: "text-center py-24 flex flex-col items-center justify-center bg-black/10 rounded-2xl border border-white/5 shadow-inner", children: [
        _jsx(Bot, { size: 56, className: "mb-4 text-white/20", strokeWidth: 1.5 }),
        _jsx("p", { className: "text-lg font-bold text-[var(--foreground)] mb-1", children: "No applications" }),
        _jsx("p", { className: "text-[13px] text-[var(--muted-foreground)] mb-6 max-w-sm", children: "Create your first bot application to start interacting with the API and building integrations." }


        ),
        _jsx("button", {
          onClick: onNew,
          className: "px-6 py-2.5 rounded-full bg-white text-black font-bold text-[13px] hover:bg-white/90 active:scale-95 transition-all shadow-lg", children:
          "Create New App" }

        )] }
      ) :

      _jsx("div", { className: "flex flex-col gap-3", children:
        bots.map((b) =>
        _jsxs("button", {

          onClick: () => onSelect(b),
          className: "flex items-center gap-4 bg-[var(--discord-sidebar)] border border-white/5 p-4 rounded-xl text-left hover:bg-white/5 transition-all shadow-sm group", children: [

          _jsx(Avatar, { src: assetUrl(b.avatar), name: b.name, size: 48 }),
          _jsxs("div", { className: "flex-1 min-w-0", children: [
            _jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              _jsx("span", { className: "text-[15px] font-bold text-[var(--foreground)]", children: b.name }),
              _jsx(Chip, { label: "BOT" }),
              _jsx(Chip, {
                label: b.active ? "Online" : "Offline",
                color: b.active ? "#23a55a" : "#949ba4" }
              )] }
            ),
            _jsx("p", { className: "text-[13px] text-[var(--muted-foreground)] truncate max-w-lg", children:
              b.description || `@${b.username}` }
            )] }
          ),
          _jsx(ChevronRight, {
            size: 20,
            className: "text-white/20 group-hover:text-white/50 transition-colors" }
          )] }, b.id
        )
        ) }
      )] }

    ));

}