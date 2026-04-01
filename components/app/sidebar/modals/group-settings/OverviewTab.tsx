"use client";

import { Camera, Trash2, X, Users, Activity, ShieldCheck, Share2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/components/app/chat/hooks";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";






























export function OverviewTab({
  name, setName,
  description, setDescription,
  accentColor, setAccentColor,
  avatarPreview, bannerPreview,
  group,
  handleAvatarChange,
  handleBannerChange,
  removeAvatar, setRemoveAvatar,
  removeBanner, setRemoveBanner,
  setAvatarFile, setAvatarPreview,
  setBannerFile, setBannerPreview,
  requireJoinRequest, setRequireJoinRequest,
  joinQuestion, setJoinQuestion,
  vanityUrl, setVanityUrl
}) {

  const memberCount = group?.members?.length || 0;
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    _jsxs("div", { className: "space-y-10 animate-in slide-in-from-right-4 duration-500 pb-20", children: [
      _jsx("div", { className: "flex items-center justify-between", children:
        _jsxs("div", { children: [
          _jsx("h2", { className: "text-2xl font-black text-white px-2", children: "Vista General" }),
          _jsx("p", { className: "text-xs text-[#949ba4] font-medium tracking-wide mt-1 px-2", children: "Personaliza la identidad visual y visualiza el estado de tu grupo." })] }
        ) }
      ),

      _jsxs("div", { className: "grid grid-cols-2 gap-10 px-2 items-start", children: [

        _jsxs("div", { className: "space-y-8", children: [
          _jsxs("div", { className: "space-y-4", children: [
            _jsxs("label", { className: "text-[11px] font-black uppercase tracking-widest text-[#949ba4] flex items-center gap-2", children: [
              _jsx(Camera, { className: "h-3.5 w-3.5" }), " Identidad Visual"] }
            ),

            _jsxs("div", { className: "relative group/banner w-full h-[140px] rounded-2xl bg-[#1e1f22] overflow-hidden border border-white/5 shadow-inner", children: [
              bannerPreview || group?.banner ?
              _jsx("img", {
                src: bannerPreview || assetUrl(group?.banner),
                className: "h-full w-full object-cover" }
              ) :

              _jsx("div", { className: "h-full w-full", style: { backgroundColor: accentColor } }),

              _jsxs("label", { className: "absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 opacity-0 transition-all group-hover/banner:opacity-100 backdrop-blur-[2px]", children: [
                _jsx(Camera, { className: "h-8 w-8 text-white mb-2" }),
                _jsx("span", { className: "text-xs font-bold text-white uppercase tracking-wider", children: "Cambiar Banner" }),
                _jsx("input", { type: "file", className: "hidden", accept: "image/*", onChange: handleBannerChange })] }
              ),
              (group?.banner || bannerPreview) && !removeBanner &&
              _jsx("button", {
                onClick: () => {setRemoveBanner(true);setBannerFile(null);setBannerPreview(null);},
                className: "absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-red-400 opacity-0 group-hover/banner:opacity-100 transition-opacity hover:bg-red-400/20 shadow-xl",
                title: "Eliminar Banner", children:

                _jsx(Trash2, { className: "h-4 w-4" }) }
              ),

              removeBanner &&
              _jsxs("div", { className: "absolute inset-0 bg-[#1e1f22]/90 flex flex-col items-center justify-center backdrop-blur-md", children: [
                _jsx("span", { className: "text-xs font-bold text-[#949ba4] uppercase tracking-widest", children: "Banner eliminado" }),
                _jsx("button", { onClick: () => setRemoveBanner(false), className: "mt-2 text-xs font-bold text-[var(--discord-blurple)] hover:underline", children: "DESHACER" })] }
              )] }

            ),

            _jsxs("div", { className: "flex gap-8 items-center bg-[#2b2d31] p-4 rounded-2xl border border-white/5", children: [
              _jsxs("div", { className: "group relative h-[100px] w-[100px] flex-shrink-0", children: [
                _jsx("div", { className: "h-full w-full overflow-hidden rounded-[32px] bg-[#1e1f22] ring-8 ring-[#2b2d31] shadow-2xl transition-transform group-hover:scale-105", children:
                  (avatarPreview || group?.avatar) && !removeAvatar ?
                  _jsx("img", {
                    src: avatarPreview || assetUrl(group?.avatar),
                    className: "h-full w-full object-cover" }
                  ) :

                  _jsx("div", { className: "flex h-full w-full items-center justify-center text-3xl font-black text-white bg-gradient-to-br from-[#5865f2] to-[#404eed]", children:
                    initials }
                  ) }

                ),
                _jsxs("label", { className: "absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-[32px] bg-black/60 opacity-0 transition-all group-hover:opacity-100 backdrop-blur-sm z-20", children: [
                  _jsx(Camera, { className: "h-6 w-6 text-white mb-1" }),
                  _jsx("span", { className: "text-[10px] font-bold text-white uppercase text-center px-1", children: "Cambiar" }),
                  _jsx("input", { type: "file", className: "hidden", accept: "image/*", onChange: handleAvatarChange })] }
                ),
                (group?.avatar || avatarPreview) && !removeAvatar &&
                _jsx("button", {
                  onClick: () => {setRemoveAvatar(true);setAvatarFile(null);setAvatarPreview(null);},
                  className: "absolute -top-1 -right-1 p-1.5 rounded-full bg-[#111214] text-red-500 border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 shadow-2xl z-30",
                  title: "Eliminar Icono", children:

                  _jsx(X, { className: "h-3.5 w-3.5" }) }
                )] }

              ),
              _jsxs("div", { className: "flex-1 space-y-2", children: [
                _jsx("p", { className: "text-xs font-medium text-[#949ba4] leading-relaxed", children: "Los iconos personalizados ayudan a identificar r\xE1pidamente tu grupo en la barra lateral." }

                ),
                _jsx("div", { className: "h-px bg-white/5 w-full" }),
                _jsxs("div", { className: "flex items-center gap-3", children: [
                  _jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[#4e5058]", children: "Color" }),
                  _jsx("div", { className: "flex gap-1.5", children:
                    ["#5865f2", "#23a55a", "#f0b232", "#ed4245", "#eb459e", "#949ba4"].map((c) =>
                    _jsx("button", {

                      onClick: () => setAccentColor(c),
                      className: cn(
                        "h-5 w-5 rounded-full ring-2 transition-all hover:scale-125",
                        accentColor === c ? "ring-white scale-125 shadow-lg" : "ring-transparent"
                      ),
                      style: { backgroundColor: c } }, c
                    )
                    ) }
                  )] }
                )] }
              )] }
            )] }
          ),

          _jsxs("div", { className: "space-y-6", children: [
            _jsxs("div", { className: "space-y-3", children: [
              _jsx("label", { className: "text-[11px] font-black uppercase tracking-widest text-[#949ba4]", children: "Nombre del Grupo" }),
              _jsx("input", {
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "Escribe el nombre aqu\xED...",
                className: "w-full rounded-xl bg-[#1e1f22] p-3 text-sm text-white border border-white/5 outline-none focus:ring-2 focus:ring-[var(--discord-blurple)]/40 focus:border-[var(--discord-blurple)]/50 transition-all shadow-inner" }
              )] }
            ),
            _jsxs("div", { className: "space-y-3", children: [
              _jsx("label", { className: "text-[11px] font-black uppercase tracking-widest text-[#949ba4]", children: "Descripci\xF3n" }),
              _jsx("textarea", {
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Describe de qu\xE9 trata este grupo...",
                rows: 4,
                className: "w-full rounded-xl bg-[#1e1f22] p-3 text-sm text-white border border-white/5 outline-none focus:ring-2 focus:ring-[var(--discord-blurple)]/40 focus:border-[var(--discord-blurple)]/50 resize-none transition-all shadow-inner" }
              )] }
            )] }
          ),


          _jsxs("div", { className: "space-y-4 pt-4 border-t border-white/5", children: [
            _jsxs("label", { className: "text-[11px] font-black uppercase tracking-widest text-[#949ba4] flex items-center gap-2", children: [
              _jsx(Share2, { className: "h-3.5 w-3.5" }), " Enlace Personalizado (Vanity URL)"] }
            ),
            _jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-[#1e1f22] border border-white/5 p-1 px-3 shadow-inner group/vanity focus-within:ring-2 focus-within:ring-[var(--discord-blurple)]/40", children: [
              _jsx("span", { className: "text-sm font-bold text-[#4e5058]", children: "astro/invite/" }),
              _jsx("input", {
                value: vanityUrl,
                onChange: (e) => setVanityUrl(e.target.value),
                placeholder: "mi-grupo-pro",
                className: "flex-1 bg-transparent py-2 text-sm text-white outline-none" }
              )] }
            ),
            _jsx("p", { className: "text-[10px] text-[#949ba4] italic", children: "Crea un enlace corto y memorable para tu grupo (solo letras, n\xFAmeros y guiones)." })] }
          ),


          _jsxs("div", { className: "space-y-6 pt-4 border-t border-white/5", children: [
            _jsxs("div", { className: "flex items-center justify-between", children: [
              _jsxs("div", { children: [
                _jsxs("label", { className: "text-[11px] font-black uppercase tracking-widest text-[#949ba4] flex items-center gap-2", children: [
                  _jsx(Lock, { className: "h-3.5 w-3.5" }), " Sistema de Uni\xF3n"] }
                ),
                _jsx("p", { className: "text-[10px] text-[#4e5058] font-bold mt-1", children: "Controla c\xF3mo se unen los nuevos miembros." })] }
              ),
              _jsx("button", {
                onClick: () => setRequireJoinRequest(!requireJoinRequest),
                className: cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none",
                  requireJoinRequest ? "bg-[#23a55a]" : "bg-[#4e5058]"
                ), children:

                _jsx("span", { className: cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    requireJoinRequest ? "translate-x-6" : "translate-x-1"
                  ) }) }
              )] }
            ),

            _jsx("div", { className: cn(
                "space-y-4 rounded-2xl bg-black/10 border border-white/5 p-4 transition-all overflow-hidden",
                requireJoinRequest ? "max-h-60 opacity-100" : "max-h-0 opacity-0 pt-0 pb-0 border-none"
              ), children:
              _jsxs("div", { className: "space-y-2", children: [
                _jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[#949ba4]", children: "Pregunta de Solicitud" }),
                _jsx("textarea", {
                  value: joinQuestion,
                  onChange: (e) => setJoinQuestion(e.target.value),
                  placeholder: "Ej: \xBFPor qu\xE9 quieres unirte a este grupo?",
                  rows: 2,
                  className: "w-full rounded-xl bg-[#1e1f22] p-3 text-xs text-white border border-white/5 outline-none focus:ring-1 focus:ring-[var(--discord-blurple)] resize-none" }
                ),
                _jsx("p", { className: "text-[9px] text-[#4e5058] italic font-medium", children: "Los usuarios deber\xE1n responder a esta pregunta para que su solicitud sea revisada por un administrador." })] }
              ) }
            ),

            !requireJoinRequest &&
            _jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-[#23a55a]/5 border border-[#23a55a]/20", children: [
              _jsx(ShieldCheck, { className: "h-4 w-4 text-[#23a55a]" }),
              _jsx("p", { className: "text-xs text-[#dbdee1] font-medium", children: "Cualquier persona con una invitaci\xF3n podr\xE1 unirse directamente." })] }
            )] }

          )] }
        ),


        _jsxs("div", { className: "space-y-6", children: [
          _jsxs("label", { className: "text-[11px] font-black uppercase tracking-widest text-[#949ba4] flex items-center gap-2", children: [
            _jsx(Share2, { className: "h-3.5 w-3.5" }), " Vista Previa de Invitaci\xF3n"] }
          ),

          _jsxs("div", { className: "bg-[#1e1f22] rounded-3xl p-8 border border-white/5 relative overflow-hidden group/preview shadow-inner", children: [
            _jsx("div", { className: "absolute top-0 right-0 p-3 opacity-10 group-hover/preview:opacity-30 transition-opacity", children:
              _jsx(Share2, { className: "h-20 w-20 text-[var(--discord-blurple)]" }) }
            ),

            _jsx("p", { className: "text-[10px] font-black text-[#4e5058] uppercase tracking-[0.2em] mb-6", children: "Vista en el Chat" }),


            _jsxs("div", { className: "mx-auto w-full max-w-[430px] overflow-hidden rounded-lg border border-white/5 bg-[#2b2d31] shadow-2xl ring-1 ring-white/10 transition-all hover:ring-white/20 text-left", children: [
              _jsx("div", { className: "px-4 pt-3 pb-2 text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--muted-foreground)] opacity-80", children: "Te han invitado a unirte a un grupo" }

              ),


              _jsxs("div", { className: "h-16 w-full bg-[#1e1f22] relative overflow-hidden", children: [
                bannerPreview || group?.banner ?
                _jsx("img", {
                  src: bannerPreview || assetUrl(group?.banner),
                  className: "h-full w-full object-cover opacity-60" }
                ) :

                _jsx("div", { className: "h-full w-full opacity-30", style: { backgroundColor: accentColor } }),

                _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#2b2d31] to-transparent" })] }
              ),

              _jsx("div", { className: "px-4 pb-4 pt-1", children:
                _jsxs("div", { className: "flex items-center gap-4", children: [

                  _jsx("div", { className: "relative h-14 w-14 flex-shrink-0 -mt-8 z-10", children:
                    _jsx("div", { className: "h-full w-full overflow-hidden rounded-2xl bg-[#1e1f22] shadow-xl ring-4 ring-[#2b2d31] flex items-center justify-center", children:
                      avatarPreview || group?.avatar ?
                      _jsx("img", {
                        src: avatarPreview || assetUrl(group?.avatar),
                        className: "h-full w-full object-cover text-[0]" }
                      ) :

                      _jsx("div", { className: "flex h-full w-full items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-[#5865f2] to-[#404eed]", children:
                        initials }
                      ) }

                    ) }
                  ),


                  _jsxs("div", { className: "flex min-w-0 flex-1 flex-col justify-center", children: [
                    _jsx("span", { className: "truncate text-[16px] font-bold text-white leading-tight mb-0.5", children: name || "Nombre del Grupo" }),
                    _jsxs("div", { className: "flex items-center gap-1.5 text-[12px] text-[var(--muted-foreground)] font-medium", children: [
                      _jsx(Users, { className: "h-3.5 w-3.5 mr-0.5 text-[var(--muted-foreground)]" }),
                      _jsx("span", { className: "text-[#dbdee1]", children: memberCount }),
                      _jsx("span", { className: "ml-0.5", children: "Miembros" })] }
                    )] }
                  ),

                  _jsx("div", {
                    className: "ml-2 rounded-[4px] px-5 py-2 text-[14px] font-semibold text-white shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all",
                    style: { backgroundColor: accentColor }, children:

                    requireJoinRequest ? "Solicitar Unión" : "Unirse" }
                  )] }
                ) }
              )] }
            ),

            _jsx("div", { className: "mt-8 p-4 rounded-xl bg-black/10 border border-white/5", children:
              _jsx("p", { className: "text-[10px] text-[#949ba4] font-medium leading-relaxed italic text-center", children: "Esta es una simulaci\xF3n exacta de c\xF3mo los usuarios ver\xE1n tu grupo cuando compartas un enlace de invitaci\xF3n." }

              ) }
            )] }
          )] }
        )] }
      ),


      _jsxs("div", { className: "space-y-4 px-2", children: [
        _jsxs("label", { className: "text-[11px] font-black uppercase tracking-widest text-[#949ba4] flex items-center gap-2", children: [
          _jsx(Activity, { className: "h-3.5 w-3.5" }), " Estad\xEDsticas y Estado"] }
        ),
        _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          _jsxs("div", { className: "bg-[#1e1f22] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative", children: [
            _jsx("div", { className: "absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity", children:
              _jsx(Users, { className: "h-24 w-24" }) }
            ),
            _jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              _jsx("div", { className: "p-2 rounded-xl bg-[var(--discord-blurple)]/10 text-[var(--discord-blurple)]", children:
                _jsx(Users, { className: "h-5 w-5" }) }
              ),
              _jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[#949ba4]", children: "Total Miembros" })] }
            ),
            _jsx("div", { className: "text-3xl font-black text-white", children: memberCount }),
            _jsx("div", { className: "text-[10px] text-[#4e5058] mt-1 font-bold italic uppercase", children: "Usuarios en el grupo" })] }
          ),

          _jsxs("div", { className: "bg-[#1e1f22] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative", children: [
            _jsx("div", { className: "absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity", children:
              _jsx(ShieldCheck, { className: "h-24 w-24" }) }
            ),
            _jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              _jsx("div", { className: "p-2 rounded-xl bg-[#23a55a]/10 text-[#23a55a]", children:
                _jsx(ShieldCheck, { className: "h-5 w-5" }) }
              ),
              _jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[#949ba4]", children: "Roles Totales" })] }
            ),
            _jsx("div", { className: "text-3xl font-black text-white", children: group?.roles?.length || 0 }),
            _jsx("div", { className: "text-[10px] text-[#4e5058] mt-1 font-bold italic uppercase", children: "Configurados para gesti\xF3n" })] }
          ),

          _jsxs("div", { className: "bg-[#1e1f22] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative", children: [
            _jsx("div", { className: "absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity", children:
              _jsx(Activity, { className: "h-24 w-24" }) }
            ),
            _jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              _jsx("div", { className: "p-2 rounded-xl bg-[#f2a134]/10 text-[#f2a134]", children:
                _jsx(Activity, { className: "h-5 w-5" }) }
              ),
              _jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[#949ba4]", children: "Antig\xFCedad" })] }
            ),
            _jsx("div", { className: "text-xl font-black text-white leading-tight mt-1.5", children:
              group?.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'N/A' }
            ),
            _jsx("div", { className: "text-[10px] text-[#4e5058] mt-1 font-bold italic uppercase", children: "Fecha de creaci\xF3n" })] }
          )] }
        )] }
      )] }

    ));

}