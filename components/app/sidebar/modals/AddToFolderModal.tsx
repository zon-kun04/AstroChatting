"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Folder as FolderIcon, Check } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { cn } from "@/lib/utils";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";









export function AddToFolderModal({ chatId, chatName, folders, onClose, onRefresh }) {
  const [loadingId, setLoadingId] = useState(null);

  const toggleChatInFolder = async (folder) => {
    const isInside = folder.chatIds.includes(chatId);
    const action = isInside ? 'remove' : 'add';

    setLoadingId(folder.id);
    try {
      await api.patch(`/folders/${folder.id}/chats`, { chatId, action });
      onRefresh();
      toast.success(isInside ? "Eliminado de la carpeta" : "Añadido a la carpeta");
    } catch (e) {
      toast.error("Error al procesar");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    _jsx(Dialog, { open: true, onOpenChange: onClose, children:
      _jsxs(DialogContent, { className: "bg-[#313338] text-white border-white/10 sm:max-w-[340px] p-0 overflow-hidden", children: [
        _jsx(DialogHeader, { className: "p-4 bg-[#2b2d31]", children:
          _jsxs(DialogTitle, { className: "text-base flex items-center gap-2", children: [
            _jsx(FolderIcon, { className: "h-4 w-4 text-[var(--discord-blurple)]" }), "Organizar \"",
            chatName, "\""] }
          ) }
        ),

        _jsx("div", { className: "flex flex-col p-2 max-h-[400px] overflow-y-auto", children:
          folders.length === 0 ?
          _jsx("div", { className: "p-8 text-center", children:
            _jsx("p", { className: "text-xs text-[var(--muted-foreground)]", children: "No tienes ninguna carpeta creada." }) }
          ) :

          folders.map((folder) => {
            const isActive = folder.chatIds.includes(chatId);
            return (
              _jsxs("button", {

                disabled: !!loadingId,
                onClick: () => toggleChatInFolder(folder),
                className: cn(
                  "flex items-center justify-between p-3 rounded-md transition-all mb-1 group text-left",
                  isActive ? "bg-[var(--discord-blurple)]/10 text-[var(--discord-blurple)]" : "hover:bg-white/5 text-[var(--muted-foreground)] hover:text-white"
                ), children: [

                _jsxs("div", { className: "flex items-center gap-3", children: [
                  _jsx("span", { className: "text-lg", children: folder.icon }),
                  _jsx("span", { className: "text-sm font-medium", children: folder.name })] }
                ),
                isActive && _jsx(Check, { className: "h-4 w-4" }),
                loadingId === folder.id && _jsx("div", { className: "h-4 w-4 border-2 border-[var(--discord-blurple)] border-t-transparent rounded-full animate-spin" })] }, folder.id
              ));

          }) }

        ),

        _jsx("div", { className: "p-3 bg-[#2b2d31] flex justify-end", children:
          _jsx("button", {
            onClick: onClose,
            className: "text-xs font-semibold text-white hover:underline px-2 py-1", children:
            "Cerrar" }

          ) }
        )] }
      ) }
    ));

}