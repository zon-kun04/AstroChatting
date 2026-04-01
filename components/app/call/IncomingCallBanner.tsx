"use client";
import { Phone, PhoneOff, PhoneIncoming } from "lucide-react";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";



if (typeof document !== "undefined" && !document.getElementById("co-styles-page")) {
  const s = document.createElement("style");
  s.id = "co-styles-page";
  s.textContent = `
    @keyframes co-slide-down { from{opacity:0;transform:translateY(-10px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes co-ring-pulse  { 0%{transform:scale(var(--s,1));opacity:.5} 100%{transform:scale(calc(var(--s,1)*1.6));opacity:0} }
  `;
  document.head.appendChild(s);
}







function RingCircle({ delay }) {
  return (
    _jsx("div", {
      style: {
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: "2px solid rgba(88,101,242,.3)",
        animation: `co-ring-pulse 2s ease-out ${delay}s infinite`
      } }
    ));

}

function ActionButton({
  onClick,
  color,
  children




}) {
  const base =
  color === "red" ?
  { bg: "rgba(239,68,68,.85)", border: "rgba(239,68,68,.3)", shadow: "rgba(239,68,68,.3)" } :
  { bg: "rgba(52,211,153,.85)", border: "rgba(52,211,153,.3)", shadow: "rgba(52,211,153,.3)" };

  return (
    _jsx("button", {
      onClick: onClick,
      onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)",
      onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)",
      onMouseDown: (e) => e.currentTarget.style.transform = "scale(0.92)",
      style: {
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: base.bg,
        border: `1px solid ${base.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: `0 4px 14px ${base.shadow}`,
        transition: "all .18s cubic-bezier(.32,1.2,.5,1)",
        flexShrink: 0
      }, children:

      children }
    ));

}

export function IncomingCallBanner({ call, onAccept, onReject }) {
  return (
    _jsx("div", {
      className: "fixed top-5 left-1/2 -translate-x-1/2 z-[9999] min-w-[360px]",
      style: { animation: "co-slide-down .32s cubic-bezier(.32,1.2,.5,1) both" }, children:

      _jsxs("div", {
        style: {
          background: "rgba(15,15,18,0.82)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 22,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          position: "relative",
          overflow: "hidden"
        }, children: [


        _jsx("div", {
          style: {
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            background: "linear-gradient(135deg,rgba(255,255,255,.06) 0%,transparent 50%)"
          } }
        ),


        _jsxs("div", { style: { position: "relative", flexShrink: 0 }, children: [
          _jsx("div", {
            style: {
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(88,101,242,.18)",
              border: "1px solid rgba(88,101,242,.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(88,101,242,.2)"
            }, children:

            _jsx(PhoneIncoming, { className: "h-5 w-5 text-[var(--discord-blurple)]" }) }
          ),
          _jsx(RingCircle, { delay: 0 }),
          _jsx(RingCircle, { delay: 0.5 })] }
        ),


        _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          _jsx("p", {
            style: {
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.8,
              color: "rgba(255,255,255,.3)",
              textTransform: "uppercase",
              margin: "0 0 2px"
            }, children:
            "Llamada entrante" }

          ),
          _jsx("p", {
            style: {
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 1px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }, children:

            call.callerUsername }
          ),
          _jsx("p", { style: { fontSize: 12, color: "rgba(255,255,255,.4)", margin: 0 }, children:
            call.mediaType === "video" ? "📹 Videollamada" : "🎙️ Llamada de voz" }
          )] }
        ),


        _jsxs("div", { style: { display: "flex", gap: 8, flexShrink: 0 }, children: [
          _jsx(ActionButton, { onClick: onReject, color: "red", children:
            _jsx(PhoneOff, { className: "h-4 w-4 text-white" }) }
          ),
          _jsx(ActionButton, { onClick: onAccept, color: "green", children:
            _jsx(Phone, { className: "h-4 w-4 text-white" }) }
          )] }
        )] }
      ) }
    ));

}