"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { BotListPage } from "./components/BotList";
import { BotDetailPage } from "./components/BotDetail";
import { CreateModal } from "./components/CreateModal";
import { Spinner } from "./components/ui";


import { BASE, authHeaders } from "./components/api";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

export default function DevelopersPage() {
  const [bots, setBots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadBots = useCallback(async () => {
    try {
      const r = await fetch(`${BASE}/bots`, { headers: authHeaders() });
      const d = await r.json();
      const list = d.bots || [];
      setBots(list);
      setSelected((prev) => prev ? list.find((b) => b.id === prev.id) ?? null : null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBots();
  }, [loadBots]);

  return (
    _jsxs(_Fragment, { children: [
      _jsx("style", { children: `
        body { margin: 0; padding: 0; background: #313338; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
      ` }),

      _jsxs("div", {
        className: "flex h-screen font-sans overflow-hidden",
        style: { '--discord-background': '#313338', '--discord-sidebar': '#2b2d31', '--discord-darker': '#1e1f22' }, children: [

        _jsx(Sidebar, {
          bots: bots,
          selected: selected,
          onSelect: setSelected,
          onNew: () => setShowCreate(true) }
        ),
        _jsx("main", { className: "flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-[var(--discord-background)]", children:
          loading ?
          _jsx("div", { className: "flex-1 flex items-center justify-center", children:
            _jsx(Spinner, {}) }
          ) :
          selected ?
          _jsx(BotDetailPage, {
            bot: selected,
            onUpdate: loadBots,
            onBack: () => setSelected(null) }
          ) :

          _jsx(BotListPage, {
            bots: bots,
            onSelect: setSelected,
            onNew: () => setShowCreate(true) }
          ) }

        )] }
      ),

      showCreate && _jsx(CreateModal, { onClose: () => setShowCreate(false), onCreate: loadBots })] }
    ));

}