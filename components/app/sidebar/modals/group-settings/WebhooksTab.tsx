"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Webhook, Plus, Trash2, Loader2, Copy, Check, Send, X, ChevronDown, ChevronUp, AlertTriangle, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EmbedMessage } from "@/components/app/chat/EmbedMessage";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";





const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001");

const EMBED_COLORS = ["#5865f2", "#23a55a", "#f0b232", "#ed4245", "#eb459e", "#00b0f4", "#ffffff"];

const defaultEmbed = () => ({
  color: "#5865f2",
  title: "",
  description: "",
  footer: { text: "" },
  image: { url: "" },
  thumbnail: { url: "" },
  fields: []
});

export function WebhooksTab({ groupId }) {
  const [loading, setLoading] = useState(true);
  const [webhooks, setWebhooks] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);


  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [testContent, setTestContent] = useState("");
  const [testUsername, setTestUsername] = useState("");
  const [testAvatar, setTestAvatar] = useState("");
  const [useEmbed, setUseEmbed] = useState(false);
  const [embed, setEmbed] = useState(defaultEmbed());
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {setMounted(true);}, []);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/groups/${groupId}/webhooks`);
      setWebhooks(res.webhooks);
    } catch (e) {
      toast.error("Error al cargar los webhooks");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {load();}, [load]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await api.post(`/groups/${groupId}/webhooks`, {
        name: newName.trim(),
        avatar: newAvatar.trim() || null
      });
      setWebhooks((prev) => [...prev, res.webhook]);
      setNewName("");
      setNewAvatar("");
      setShowCreateForm(false);
      toast.success("Webhook creado");
    } catch (e) {
      toast.error(e.message || "Error al crear webhook");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (webhookId) => {
    try {
      await api.delete(`/groups/${groupId}/webhooks/${webhookId}`);
      setWebhooks((prev) => prev.filter((w) => w.id !== webhookId));
      if (selectedWebhook?.id === webhookId) setSelectedWebhook(null);
      toast.success("Webhook eliminado");
    } catch (e) {
      toast.error(e.message || "Error al eliminar");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleCopyUrl = (token, webhookId) => {
    const url = `${BACKEND}/api/groups/webhooks/${token}/execute`;
    navigator.clipboard.writeText(url);
    setCopiedId(webhookId);
    toast.success("URL copiada");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendTest = async () => {
    if (!selectedWebhook) return;
    if (!testContent.trim() && !useEmbed) {toast.error("Escribe un mensaje o activa el embed.");return;}

    setSending(true);
    try {
      const payload = {
        username: testUsername || selectedWebhook.name,
        avatar_url: testAvatar || selectedWebhook.avatar
      };
      if (testContent.trim()) payload.content = testContent;
      if (useEmbed) {
        const cleanEmbed = { color: embed.color };
        if (embed.title) cleanEmbed.title = embed.title;
        if (embed.description) cleanEmbed.description = embed.description;
        if (embed.footer.text) cleanEmbed.footer = embed.footer;
        if (embed.image.url) cleanEmbed.image = embed.image;
        if (embed.thumbnail.url) cleanEmbed.thumbnail = embed.thumbnail;
        if (embed.fields.length > 0) cleanEmbed.fields = embed.fields.filter((f) => f.name && f.value);
        payload.embed = cleanEmbed;
      }

      await fetch(`${BACKEND}/api/groups/webhooks/${selectedWebhook.token}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then((r) => {if (!r.ok) throw new Error("Error al enviar");});

      toast.success("Mensaje enviado por webhook");
      setTestContent("");
    } catch (e) {
      toast.error(e.message || "Error al enviar");
    } finally {
      setSending(false);
    }
  };

  const previewEmbed = useMemo(() => {
    if (!useEmbed) return null;
    return {
      color: embed.color,
      title: embed.title || undefined,
      description: embed.description || undefined,
      footer: embed.footer.text ? embed.footer : undefined,
      image: embed.image.url ? embed.image : undefined,
      thumbnail: embed.thumbnail.url ? embed.thumbnail : undefined,
      fields: embed.fields.filter((f) => f.name && f.value)
    };
  }, [embed, useEmbed]);

  const addField = () => setEmbed((e) => ({ ...e, fields: [...e.fields, { name: "", value: "", inline: false }] }));
  const removeField = (i) => setEmbed((e) => ({ ...e, fields: e.fields.filter((_, idx) => idx !== i) }));
  const updateField = (i, key, value) =>
  setEmbed((e) => ({ ...e, fields: e.fields.map((f, idx) => idx === i ? { ...f, [key]: value } : f) }));

  if (loading) return (
    _jsx("div", { className: "flex h-40 items-center justify-center", children:
      _jsx(Loader2, { className: "h-6 w-6 animate-spin text-[var(--discord-blurple)]" }) }
    ));


  return (
    _jsxs(_Fragment, { children: [
      _jsxs("div", { className: "space-y-6 animate-in slide-in-from-right-4 duration-300", children: [

        _jsxs("div", { className: "flex items-start justify-between", children: [
          _jsxs("div", { children: [
            _jsx("h2", { className: "text-xl font-bold text-white", children: "Webhooks" }),
            _jsx("p", { className: "text-sm text-[var(--muted-foreground)] max-w-lg", children: "Los webhooks permiten enviar mensajes desde aplicaciones externas o scripts, incluyendo embeds decorados." }

            )] }
          ),
          _jsxs("button", {
            onClick: () => setShowCreateForm((v) => !v),
            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--discord-blurple)] hover:bg-[#4752c4] text-white text-sm font-bold transition-colors", children: [

            _jsx(Plus, { className: "h-4 w-4" }), " Nuevo Webhook"] }
          )] }
        ),


        showCreateForm &&
        _jsxs("div", { className: "rounded-xl bg-[#2b2d31] border border-white/5 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200", children: [
          _jsx("p", { className: "text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]", children: "Nombre del Webhook" }),
          _jsxs("div", { className: "flex gap-2", children: [
            _jsx("input", {
              value: newName,
              onChange: (e) => setNewName(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleCreate(),
              placeholder: "Ej: Bot Notificaciones",
              className: "flex-1 bg-[#1e1f22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)]" }
            ),
            _jsx("button", { onClick: handleCreate, disabled: creating || !newName.trim(),
              className: "px-4 py-2 bg-[var(--discord-blurple)] hover:bg-[#4752c4] text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2", children:
              creating ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Crear" }
            )] }
          ),
          _jsxs("div", { className: "space-y-1.5 pt-1", children: [
            _jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]", children: "URL del Avatar (Opcional)" }),
            _jsx("input", {
              value: newAvatar,
              onChange: (e) => setNewAvatar(e.target.value),
              placeholder: "https://ejemplo.com/avatar.png",
              className: "w-full bg-[#1e1f22] border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)]" }
            )] }
          ),
          _jsx("div", { className: "flex justify-end pt-1", children:
            _jsx("button", { onClick: () => {setShowCreateForm(false);setNewName("");setNewAvatar("");},
              className: "text-xs font-bold text-[var(--muted-foreground)] hover:text-white transition-colors", children: "Cancelar" }

            ) }
          )] }
        ),



        _jsx("div", { className: "space-y-2", children:
          webhooks.length > 0 ? webhooks.map((wh) =>
          _jsxs("div", {
            className: cn(
              "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all",
              selectedWebhook?.id === wh.id ?
              "bg-[var(--discord-blurple)]/10 border-[var(--discord-blurple)]/40" :
              "bg-[#2b2d31] border-white/5 hover:bg-white/[0.02]"
            ),
            onClick: () => setSelectedWebhook(selectedWebhook?.id === wh.id ? null : wh), children: [

            _jsx("div", { className: "h-10 w-10 rounded-full bg-[#1e1f22] flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/5 ring-2 ring-transparent group-hover:ring-[var(--discord-blurple)]/30 transition-all", children:
              wh.avatar ?
              _jsx("img", { src: wh.avatar, className: "h-full w-full object-cover" }) :

              _jsx(Webhook, { className: "h-5 w-5 text-[var(--discord-blurple)]" }) }

            ),
            _jsxs("div", { className: "flex-1 min-w-0", children: [
              _jsx("p", { className: "text-sm font-semibold text-white", children: wh.name }),
              _jsx("p", { className: "text-xs text-[var(--muted-foreground)] font-mono truncate", children: `/webhooks/${wh.token?.slice(0, 20)}...` })] }
            ),
            _jsxs("div", { className: "flex items-center gap-2", children: [
              _jsx("button", {
                onClick: (e) => {e.stopPropagation();handleCopyUrl(wh.token, wh.id);},
                className: "p-2 rounded-lg hover:bg-white/10 text-[var(--muted-foreground)] hover:text-white transition-colors",
                title: "Copiar URL del webhook", children:

                copiedId === wh.id ? _jsx(Check, { className: "h-4 w-4 text-[#23a55a]" }) : _jsx(Copy, { className: "h-4 w-4" }) }
              ),
              _jsx("button", {
                onClick: (e) => {e.stopPropagation();setDeleteConfirm({ id: wh.id, name: wh.name });},
                className: "p-2 rounded-lg hover:bg-red-400/10 text-[var(--muted-foreground)] hover:text-red-400 transition-colors",
                title: "Eliminar webhook", children:

                _jsx(Trash2, { className: "h-4 w-4" }) }
              )] }
            )] }, wh.id
          )
          ) :
          _jsxs("div", { className: "flex flex-col items-center justify-center py-20 rounded-xl border-2 border-dashed border-white/5 text-center", children: [
            _jsx("div", { className: "h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4", children:
              _jsx(Webhook, { className: "h-8 w-8 text-[var(--muted-foreground)] opacity-20" }) }
            ),
            _jsx("p", { className: "text-sm font-semibold text-white", children: "No hay webhooks" }),
            _jsx("p", { className: "text-xs text-[var(--muted-foreground)] mt-1", children: "Crea uno para empezar a enviar mensajes autom\xE1ticos." })] }
          ) }

        ),


        selectedWebhook &&
        _jsxs("div", { className: "rounded-2xl bg-[#1e1f22] border border-white/5 p-6 space-y-5 animate-in slide-in-from-bottom-2 duration-300", children: [
          _jsxs("div", { className: "flex items-center justify-between", children: [
            _jsxs("p", { className: "text-sm font-black text-white uppercase tracking-widest", children: ["Probar: ", selectedWebhook.name] }),
            _jsxs("button", { onClick: () => setShowPreview((v) => !v),
              className: "flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-white transition-colors", children: [
              _jsx(Eye, { className: "h-3.5 w-3.5" }),
              showPreview ? "Ocultar Preview" : "Ver Preview"] }
            )] }
          ),


          _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            _jsxs("div", { className: "space-y-1.5", children: [
              _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "Nombre personalizado" }),
              _jsx("input", {
                value: testUsername,
                onChange: (e) => setTestUsername(e.target.value),
                placeholder: selectedWebhook.name,
                className: "w-full bg-[#2b2d31] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)]" }
              )] }
            ),
            _jsxs("div", { className: "space-y-1.5", children: [
              _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "Avatar personalizado (URL)" }),
              _jsx("input", {
                value: testAvatar,
                onChange: (e) => setTestAvatar(e.target.value),
                placeholder: selectedWebhook.avatar || "URL de imagen...",
                className: "w-full bg-[#2b2d31] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)]" }
              )] }
            )] }
          ),


          _jsxs("div", { className: "space-y-1.5", children: [
            _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "Contenido (Markdown: **bold** *italic* `code` ##t\xEDtulo >quote)" }

            ),
            _jsx("textarea", {
              value: testContent,
              onChange: (e) => setTestContent(e.target.value),
              placeholder: "Escribe el mensaje aqu\xED... Puedes usar **negrita**, *cursiva*, `c\xF3digo`, ### T\xEDtulos, > citas...",
              rows: 3,
              className: "w-full bg-[#2b2d31] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)] resize-none" }
            )] }
          ),


          _jsx("div", { className: "flex items-center gap-3", children:
            _jsxs("button", {
              onClick: () => setUseEmbed((v) => !v),
              className: cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                useEmbed ? "bg-[var(--discord-blurple)] text-white" : "bg-white/5 text-[var(--muted-foreground)] hover:bg-white/10"
              ), children: [

              useEmbed ? _jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : _jsx(ChevronDown, { className: "h-3.5 w-3.5" }), "Embed enriquecido"] }

            ) }
          ),


          useEmbed &&
          _jsxs("div", { className: "space-y-4 rounded-xl bg-[#2b2d31] border border-white/5 p-4", children: [

            _jsxs("div", { className: "space-y-2", children: [
              _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "Color del Embed" }),
              _jsxs("div", { className: "flex gap-2 flex-wrap", children: [
                EMBED_COLORS.map((c) =>
                _jsx("button", { onClick: () => setEmbed((e) => ({ ...e, color: c })),
                  className: cn("h-6 w-6 rounded-full ring-2 transition-all hover:scale-110",
                  embed.color === c ? "ring-white scale-110" : "ring-transparent"),
                  style: { backgroundColor: c } }, c)
                ),
                _jsx("input", { type: "color", value: embed.color, onChange: (e) => setEmbed((em) => ({ ...em, color: e.target.value })),
                  className: "h-6 w-6 rounded-full cursor-pointer border-0 bg-transparent", title: "Color personalizado" })] }
              )] }
            ),


            _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
              _jsxs("div", { className: "space-y-1", children: [
                _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "T\xEDtulo" }),
                _jsx("input", { value: embed.title, onChange: (e) => setEmbed((em) => ({ ...em, title: e.target.value })),
                  placeholder: "T\xEDtulo del embed",
                  className: "w-full bg-[#1e1f22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)]" })] }
              ),
              _jsxs("div", { className: "space-y-1", children: [
                _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "Descripci\xF3n (Markdown soportado)" }),
                _jsx("textarea", { value: embed.description, onChange: (e) => setEmbed((em) => ({ ...em, description: e.target.value })),
                  placeholder: "Descripci\xF3n con **negrita**, *cursiva*, `c\xF3digo`, ### T\xEDtulos...",
                  rows: 3,
                  className: "w-full bg-[#1e1f22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)] resize-none" })] }
              )] }
            ),

            _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              _jsxs("div", { className: "space-y-1", children: [
                _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "URL de Imagen" }),
                _jsx("input", { value: embed.image.url, onChange: (e) => setEmbed((em) => ({ ...em, image: { url: e.target.value } })),
                  placeholder: "https://...",
                  className: "w-full bg-[#1e1f22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)]" })] }
              ),
              _jsxs("div", { className: "space-y-1", children: [
                _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "URL Miniatura" }),
                _jsx("input", { value: embed.thumbnail.url, onChange: (e) => setEmbed((em) => ({ ...em, thumbnail: { url: e.target.value } })),
                  placeholder: "https://...",
                  className: "w-full bg-[#1e1f22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)]" })] }
              )] }
            ),


            _jsxs("div", { className: "space-y-1", children: [
              _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "Pie de Embed" }),
              _jsx("input", { value: embed.footer.text, onChange: (e) => setEmbed((em) => ({ ...em, footer: { text: e.target.value } })),
                placeholder: "Texto del footer...",
                className: "w-full bg-[#1e1f22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[var(--discord-blurple)]" })] }
            ),


            _jsxs("div", { className: "space-y-2", children: [
              _jsxs("div", { className: "flex items-center justify-between", children: [
                _jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]", children: "Campos" }),
                _jsx("button", { onClick: addField, className: "text-xs text-[var(--discord-blurple)] hover:underline font-bold", children: "+ A\xF1adir Campo" })] }
              ),
              embed.fields.map((f, i) =>
              _jsxs("div", { className: "flex gap-2 items-start", children: [
                _jsx("input", { value: f.name, onChange: (e) => updateField(i, "name", e.target.value),
                  placeholder: "Nombre", className: "flex-1 bg-[#1e1f22] border border-white/5 rounded-lg px-2 py-1.5 text-xs text-white outline-none" }),
                _jsx("input", { value: f.value, onChange: (e) => updateField(i, "value", e.target.value),
                  placeholder: "Valor", className: "flex-[2] bg-[#1e1f22] border border-white/5 rounded-lg px-2 py-1.5 text-xs text-white outline-none" }),
                _jsx("button", { onClick: () => removeField(i), className: "p-1.5 rounded hover:bg-red-400/10 text-[var(--muted-foreground)] hover:text-red-400 transition-colors mt-0.5", children:
                  _jsx(X, { className: "h-3.5 w-3.5" }) }
                )] }, i
              )
              )] }
            )] }
          ),



          showPreview && previewEmbed &&
          _jsxs("div", { className: "rounded-xl bg-[#2b2d31] border border-white/5 p-4", children: [
            _jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-3", children: "Vista Previa del Embed" }),
            _jsx(EmbedMessage, { embed: previewEmbed })] }
          ),



          _jsxs("button", {
            onClick: handleSendTest,
            disabled: sending || !testContent.trim() && !useEmbed,
            className: "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--discord-blurple)] hover:bg-[#4752c4] text-white font-bold text-sm transition-all disabled:opacity-50 active:scale-[0.98]", children: [

            sending ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : _jsx(Send, { className: "h-4 w-4" }),
            sending ? "Enviando..." : "Enviar mensaje del Webhook"] }
          )] }
        )] }

      ),


      deleteConfirm && mounted && createPortal(
        _jsx("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200", children:
          _jsxs("div", { className: "bg-[#313338] w-full max-w-sm rounded-xl shadow-2xl border border-white/5 p-6 animate-in zoom-in-95 duration-200", children: [
            _jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              _jsx("div", { className: "p-2.5 rounded-xl bg-red-400/10 text-red-400", children:
                _jsx(AlertTriangle, { className: "h-5 w-5" }) }
              ),
              _jsxs("h3", { className: "text-lg font-bold text-white", children: ["\xBFEliminar \"", deleteConfirm.name, "\"?"] })] }
            ),
            _jsx("p", { className: "text-sm text-[#dbdee1] mb-6 leading-relaxed", children: "Esta acci\xF3n eliminar\xE1 el webhook permanentemente. Cualquier integraci\xF3n que use esta URL dejar\xE1 de funcionar." }

            ),
            _jsxs("div", { className: "flex justify-end gap-3", children: [
              _jsx("button", { onClick: () => setDeleteConfirm(null), className: "px-4 py-2 text-sm font-medium text-white hover:underline", children: "Cancelar" }),
              _jsx("button", { onClick: () => handleDelete(deleteConfirm.id),
                className: "px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors", children: "Eliminar" }

              )] }
            )] }
          ) }
        ),
        document.body
      )] }
    ));

}