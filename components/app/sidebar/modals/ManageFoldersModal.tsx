"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder as FolderIcon, Plus, Trash2, Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";








const COLOR_PRESETS = [
{ name: 'Blurple', value: '#5865f2' },
{ name: 'Verde', value: '#23a559' },
{ name: 'Amarillo', value: '#f0b232' },
{ name: 'Rojo', value: '#ed4245' },
{ name: 'Rosa', value: '#eb459e' },
{ name: 'Gris', value: '#80848e' },
{ name: 'Cian', value: '#00aff4' }];


export function ManageFoldersModal({ folders, onClose, onRefresh }) {
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].value);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    try {
      await api.post("/folders", {
        name: newFolderName,
        icon: "📁",
        color: selectedColor
      });
      setNewFolderName("");
      setIsCreating(false);
      onRefresh();
      toast.success("Carpeta creada");
    } catch (e) {
      toast.error("Error al crear la carpeta");
    }
  };

  const handleRename = async (id) => {
    if (!editingName.trim()) return;
    try {
      await api.patch(`/folders/${id}`, { name: editingName });
      setEditingId(null);
      onRefresh();
      toast.success("Carpeta renombrada");
    } catch (e) {
      toast.error("No se pudo renombrar");
    }
  };

  const handleUpdateColor = async (id, color) => {
    try {
      await api.patch(`/folders/${id}`, { color });
      onRefresh();
    } catch (e) {
      toast.error("No se pudo cambiar el color");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/folders/${id}`);
      onRefresh();
      toast.success("Carpeta eliminada");
    } catch (e) {
      toast.error("Error al eliminar la carpeta");
    }
  };

  return (
    _jsx(Dialog, { open: true, onOpenChange: onClose, children:
      _jsxs(DialogContent, { className: "bg-[#313338] text-white border-white/10 sm:max-w-[440px] p-0 overflow-hidden", children: [
        _jsxs("div", { className: "p-6", children: [
          _jsx(DialogHeader, { className: "mb-4", children:
            _jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl", children: [
              _jsx(FolderIcon, { className: "h-6 w-6 text-[var(--discord-blurple)]" }), "Gestionar Carpetas"] }

            ) }
          ),

          _jsxs("div", { className: "flex flex-col gap-4", children: [
            _jsx("div", { className: "flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar", children:
              folders.map((folder) =>
              _jsxs("div", { className: "group flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all", children: [
                _jsxs("div", { className: "flex items-center justify-between", children: [
                  _jsxs("div", { className: "flex items-center gap-3", children: [
                    _jsx("div", { className: "h-4 w-4 rounded-full shadow-lg", style: { backgroundColor: folder.color || '#5865f2' } }),

                    editingId === folder.id ?
                    _jsx(Input, {
                      autoFocus: true,
                      value: editingName,
                      onChange: (e) => setEditingName(e.target.value),
                      onBlur: () => handleRename(folder.id),
                      onKeyDown: (e) => {if (e.key === 'Enter') handleRename(folder.id);},
                      className: "h-7 w-[180px] bg-[#1e1f22] border-none text-sm p-1" }
                    ) :

                    _jsxs("div", { className: "flex flex-col", children: [
                      _jsxs("span", { className: "text-sm font-semibold flex items-center gap-2 group-hover:text-[var(--discord-blurple)] transition-colors", children: [
                        folder.name,
                        _jsx(Pencil, {
                          onClick: () => {setEditingId(folder.id);setEditingName(folder.name);},
                          className: "h-3 w-3 opacity-0 group-hover:opacity-60 cursor-pointer hover:opacity-100" }
                        )] }
                      ),
                      _jsxs("span", { className: "text-[10px] text-[var(--muted-foreground)] font-bold", children: [
                        folder.chatIds.length, " CHATS"] }
                      )] }
                    )] }

                  ),

                  _jsx("button", {
                    onClick: () => handleDelete(folder.id),
                    className: "p-1.5 text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-400/10 rounded transition-all", children:

                    _jsx(Trash2, { className: "h-4 w-4" }) }
                  )] }
                ),

                _jsx("div", { className: "flex items-center gap-1.5 pt-1", children:
                  COLOR_PRESETS.map((c) =>
                  _jsx("button", {

                    onClick: () => handleUpdateColor(folder.id, c.value),
                    className: cn(
                      "h-5 w-5 rounded-full border-2 transition-transform hover:scale-110",
                      folder.color === c.value ? "border-white scale-110" : "border-transparent"
                    ),
                    style: { backgroundColor: c.value },
                    title: c.name }, c.value
                  )
                  ) }
                )] }, folder.id
              )
              ) }
            ),

            isCreating ?
            _jsxs("div", { className: "flex flex-col gap-4 p-4 bg-white/5 rounded-xl border border-[var(--discord-blurple)]/30 animate-in fade-in zoom-in-95 duration-200", children: [
              _jsxs("div", { className: "space-y-3", children: [
                _jsx("label", { className: "text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider", children: "Nombre de la carpeta" }),
                _jsx(Input, {
                  autoFocus: true,
                  value: newFolderName,
                  onChange: (e) => setNewFolderName(e.target.value),
                  placeholder: "Ej. Trabajo, Amigos...",
                  className: "h-10 bg-[#1e1f22] border-none text-sm focus-visible:ring-1 focus-visible:ring-[var(--discord-blurple)]",
                  onKeyDown: (e) => {if (e.key === 'Enter') handleCreate();} }
                )] }
              ),

              _jsxs("div", { className: "space-y-2", children: [
                _jsx("label", { className: "text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider", children: "Color de la carpeta" }),
                _jsx("div", { className: "flex items-center gap-2 flex-wrap", children:
                  COLOR_PRESETS.map((c) =>
                  _jsx("button", {

                    onClick: () => setSelectedColor(c.value),
                    className: cn(
                      "h-8 w-8 rounded-lg border-2 transition-all",
                      selectedColor === c.value ? "border-white ring-2 ring-[var(--discord-blurple)] ring-offset-2 ring-offset-[#313338]" : "border-transparent opacity-60 hover:opacity-100"
                    ),
                    style: { backgroundColor: c.value } }, c.value
                  )
                  ) }
                )] }
              ),

              _jsxs("div", { className: "flex items-center gap-2 pt-2", children: [
                _jsx(Button, { onClick: handleCreate, className: "flex-1 bg-[var(--discord-blurple)] hover:bg-[var(--discord-blurple)]/80", children: "Crear Carpeta" }

                ),
                _jsx(Button, { variant: "ghost", onClick: () => setIsCreating(false), className: "px-4", children: "Cancelar" }

                )] }
              )] }
            ) :

            _jsxs(Button, {
              onClick: () => setIsCreating(true),
              className: "w-full h-11 bg-white/5 hover:bg-white/10 border-dashed border border-white/10 text-[var(--muted-foreground)] hover:text-white transition-all group", children: [

              _jsx(Plus, { className: "h-5 w-5 mr-2 group-hover:scale-110 transition-transform" }), "Nueva carpeta"] }

            )] }

          )] }
        ),

        _jsx("div", { className: "bg-[#2b2d31] px-6 py-4 flex justify-end gap-3 mt-4", children:
          _jsx(Button, { onClick: onClose, className: "bg-transparent hover:bg-white/5 text-white", children: "Hecho" }

          ) }
        )] }
      ) }
    ));

}