"use client";



import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MonitorOff,
  Volume2, VolumeX, Settings, Minimize2, Users, ChevronDown,
  Wifi, WifiOff, Maximize2, Minimize, X, Signal, GripHorizontal } from
"lucide-react";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";




const GLOBAL_STYLES = `
  @keyframes co-slide-down {
    from { opacity:0; transform:translateY(-8px) scale(0.97); }
    to   { opacity:1; transform:translateY(0)    scale(1);    }
  }
  @keyframes co-slide-up {
    from { opacity:0; transform:translateY(8px)  scale(0.97); }
    to   { opacity:1; transform:translateY(0)    scale(1);    }
  }
  @keyframes co-fade-in {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes co-pop-in {
    0%   { opacity:0; transform:scale(0.88) translateY(6px);  }
    60%  { opacity:1; transform:scale(1.03) translateY(-1px); }
    100% { transform:scale(1)   translateY(0);                }
  }
  @keyframes co-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes co-breathe {
    0%,100% { opacity:.06; }
    50%      { opacity:.14; }
  }
  @keyframes co-ring-pulse {
    0%   { transform:scale(1);    opacity:.5; }
    100% { transform:scale(1.55); opacity:0;  }
  }
  @keyframes co-status-pulse {
    0%,100% { opacity:1; }
    50%      { opacity:.4; }
  }
  .co-slide-down  { animation: co-slide-down  .28s cubic-bezier(.32,1.2,.5,1) both; }
  .co-slide-up    { animation: co-slide-up    .28s cubic-bezier(.32,1.2,.5,1) both; }
  .co-fade-in     { animation: co-fade-in     .22s ease both; }
  .co-pop-in      { animation: co-pop-in      .34s cubic-bezier(.32,1.2,.5,1) both; }
  .co-status-pulse{ animation: co-status-pulse 2s ease-in-out infinite; }
`;

function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById("co-styles")) return;
    const el = document.createElement("style");
    el.id = "co-styles";el.textContent = GLOBAL_STYLES;
    document.head.appendChild(el);
  }, []);
}




const glass = (opacity = 0.72, blur = 28, extra = "") => ({
  background: `rgba(15,15,18,${opacity})`,
  backdropFilter: `blur(${blur}px) saturate(180%)`,
  WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
  ...(extra ? {} : {})
});




function useDraggable(initial, clamp = { w: 320, h: 220 }) {
  const [pos, setPos] = useState(initial);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef(false);
  const start = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const onMouseDown = useCallback((e) => {
    drag.current = true;setIsDragging(true);
    start.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    e.preventDefault();e.stopPropagation();
  }, [pos]);

  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - clamp.w, start.current.px + (e.clientX - start.current.mx))),
        y: Math.max(0, Math.min(window.innerHeight - clamp.h, start.current.py + (e.clientY - start.current.my)))
      });
    };
    const onUp = () => {drag.current = false;setIsDragging(false);};
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {window.removeEventListener("mousemove", onMove);window.removeEventListener("mouseup", onUp);};
  }, [clamp.w, clamp.h]);

  return { pos, onMouseDown, isDragging };
}




function GlassBtn({
  onClick, active = false, label, icon, activeColor = "red",
  size = "md", className = ""




}) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const colorMap = {
    red: { bg: "rgba(239,68,68,.18)", ring: "rgba(239,68,68,.35)", text: "#f87171" },
    blue: { bg: "rgba(88,101,242,.18)", ring: "rgba(88,101,242,.35)", text: "#818cf8" },
    green: { bg: "rgba(52,211,153,.18)", ring: "rgba(52,211,153,.35)", text: "#6ee7b7" },
    white: { bg: "rgba(255,255,255,.12)", ring: "rgba(255,255,255,.25)", text: "#fff" }
  };
  const c = colorMap[active ? activeColor : "white"];
  const sz = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-10 w-10";

  return (
    _jsxs("button", {
      onClick: onClick,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onMouseDown: () => setPressed(true),
      onMouseUp: () => setPressed(false),
      title: label,
      style: {
        ...glass(active ? 0.22 : hovered ? 0.18 : 0.10, 20),
        border: `1px solid ${active ? c.ring : hovered ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.07)"}`,
        boxShadow: active ?
        `0 0 0 1px ${c.ring}, inset 0 1px 0 rgba(255,255,255,.08)` :
        hovered ? "inset 0 1px 0 rgba(255,255,255,.1), 0 2px 8px rgba(0,0,0,.3)" :
        "inset 0 1px 0 rgba(255,255,255,.05)",
        transform: pressed ? "scale(0.91)" : hovered ? "scale(1.06)" : "scale(1)",
        transition: "all .18s cubic-bezier(.32,1.2,.5,1)",
        color: active ? c.text : hovered ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.5)",
        background: active ? c.bg : undefined
      },
      className: cn(
        "relative flex items-center justify-center rounded-2xl overflow-hidden select-none",
        sz, className
      ), children: [


      hovered && !active &&
      _jsx("span", {
        className: "pointer-events-none absolute inset-0 rounded-2xl",
        style: {
          background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,.07) 50%,transparent 60%)",
          backgroundSize: "400px 100%",
          animation: "co-shimmer .6s linear"
        } }
      ),


      _jsx("span", { className: "pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl",
        style: { background: "linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)" } }),
      icon] }
    ));

}




function ControlBtn({ onClick, active = false, label, children, activeColor = "red"


}) {
  const [hovered, setHovered] = useState(false);
  const colorMap = {
    red: "#f87171", blue: "#818cf8", green: "#6ee7b7", white: "#fff"
  };
  return (
    _jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [
      _jsx(GlassBtn, { onClick: onClick, active: active, label: label,
        icon: children, activeColor: activeColor, size: "md" }),
      _jsx("span", { style: {
          fontSize: 10, lineHeight: 1, letterSpacing: .5,
          color: active ? colorMap[activeColor] : hovered ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.3)",
          transition: "color .15s",
          fontWeight: 500
        },
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false), children:
        label }
      )] }
    ));

}























function VideoTile({ p, stream, muted = false, contain = false, onClick


}) {
  const videoRef = useRef(null);
  const [, bump] = useState(0);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const el = videoRef.current;if (!el || !stream) return;
    el.srcObject = stream;el.play().catch(() => {});
    const fn = () => {bump((n) => n + 1);el.srcObject = stream;el.play().catch(() => {});};
    stream.addEventListener("addtrack", fn);
    return () => {stream.removeEventListener("addtrack", fn);el.srcObject = null;};
  }, [stream]);

  const hasVideo = !!stream &&
  stream.getVideoTracks().some((t) => t.readyState !== "ended" && t.enabled) && (
  !p.isCameraOff || p.isScreenSharing);

  return (
    _jsxs("div", {
      onClick: onClick,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        borderRadius: 20, overflow: "hidden", position: "relative",
        width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#111113",
        boxShadow: p.isSpeaking ? "0 0 0 2px #5865f2, 0 0 24px rgba(88,101,242,.3)" : "none",
        transition: "box-shadow .2s",
        cursor: onClick ? "pointer" : "default"
      }, children: [

      _jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: muted,
        style: {
          width: "100%", height: "100%",
          objectFit: contain ? "contain" : "cover",
          display: hasVideo ? "block" : "none",
          transition: "opacity .3s"
        } }),


      onClick && hasVideo && hov &&
      _jsx("div", { className: "co-fade-in", style: {
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,.22)"
        }, children:
        _jsxs("div", { style: {
            ...glass(0.65, 20),
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 14, padding: "6px 14px",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.1)"
          }, children: [
          _jsx(Maximize2, { size: 14, style: { color: "rgba(255,255,255,.8)" } }),
          _jsx("span", { style: { fontSize: 12, color: "rgba(255,255,255,.8)", fontWeight: 500 }, children: "Pantalla completa" })] }
        ) }
      ),


      !hasVideo &&
      _jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }, children: [
        _jsxs("div", { style: { position: "relative" }, children: [
          _jsxs(Avatar, { className: "h-24 w-24", children: [
            _jsx(AvatarImage, { src: p.avatar ?? undefined }),
            _jsx(AvatarFallback, { style: { background: "#5865f2", color: "#fff", fontSize: 32 }, children:
              p.displayName[0]?.toUpperCase() }
            )] }
          ),
          p.avatarDecoration &&
          _jsx("img", { src: p.avatarDecoration, alt: "", draggable: false,
            style: { position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "contain", transform: "scale(1.4)", zIndex: 10, pointerEvents: "none" } })] }

        ),
        _jsx("span", { style: { fontSize: 13, color: "rgba(255,255,255,.5)", fontWeight: 500 }, children: p.displayName })] }
      ),



      _jsxs("div", { style: {
          position: "absolute", bottom: 10, left: 10,
          display: "flex", alignItems: "center", gap: 6, zIndex: 20
        }, children: [
        _jsx("div", { style: {
            ...glass(0.7, 12),
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 8, width: 20, height: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: p.isMuted ? "rgba(239,68,68,.7)" : undefined
          }, children:
          p.isMuted ?
          _jsx(MicOff, { size: 11, style: { color: "#fff" } }) :
          _jsx(Mic, { size: 11, style: { color: "rgba(255,255,255,.7)" } }) }
        ),
        _jsx("span", { style: {
            fontSize: 11, fontWeight: 600, color: "#fff",
            textShadow: "0 1px 4px rgba(0,0,0,.8)", letterSpacing: .2
          }, children: p.displayName }),
        p.isScreenSharing &&
        _jsx("span", { style: {
            ...glass(0.7, 10),
            border: "1px solid rgba(88,101,242,.3)",
            borderRadius: 6, padding: "1px 7px",
            fontSize: 10, color: "#818cf8", fontWeight: 600
          }, children: "Pantalla" })] }

      ),

      p.isSpeaking &&
      _jsx("div", { style: {
          position: "absolute", inset: 0, borderRadius: 20,
          boxShadow: "inset 0 0 0 2px rgba(88,101,242,.7)",
          animation: "co-status-pulse 1.2s ease-in-out infinite",
          pointerEvents: "none"
        } })] }

    ));

}




function FullscreenViewer({ stream, p, onClose }) {
  const videoRef = useRef(null);
  const [showUI, setShowUI] = useState(true);
  const timer = useRef();

  useEffect(() => {
    const el = videoRef.current;if (!el) return;
    el.srcObject = stream;el.play().catch(() => {});
    return () => {el.srcObject = null;};
  }, [stream]);

  const resetTimer = () => {
    setShowUI(true);clearTimeout(timer.current);
    timer.current = setTimeout(() => setShowUI(false), 2800);
  };
  useEffect(() => {resetTimer();return () => clearTimeout(timer.current);}, []);
  useEffect(() => {
    const fn = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    _jsxs("div", { className: "co-fade-in",
      style: { position: "fixed", inset: 0, zIndex: 9998, background: "#000" },
      onMouseMove: resetTimer, children: [
      _jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: false,
        style: { width: "100%", height: "100%", objectFit: "contain" } }),


      _jsxs("div", { style: {
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "18px 20px",
          background: "linear-gradient(to bottom,rgba(0,0,0,.7),transparent)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "opacity .3s, transform .3s",
          opacity: showUI ? 1 : 0,
          transform: showUI ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: showUI ? "auto" : "none"
        }, children: [
        _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          _jsxs("div", { style: { position: "relative" }, children: [
            _jsxs(Avatar, { className: "h-9 w-9", children: [
              _jsx(AvatarImage, { src: p.avatar ?? undefined }),
              _jsx(AvatarFallback, { style: { background: "#5865f2", color: "#fff", fontSize: 14 }, children:
                p.displayName[0]?.toUpperCase() }
              )] }
            ),
            p.avatarDecoration &&
            _jsx("img", { src: p.avatarDecoration, alt: "", draggable: false,
              style: { position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "contain", transform: "scale(1.4)", zIndex: 10, pointerEvents: "none" } })] }

          ),
          _jsxs("div", { children: [
            _jsx("p", { style: { fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }, children: p.displayName }),
            _jsx("p", { style: { fontSize: 11, color: "rgba(255,255,255,.4)", margin: 0 }, children: "Compartiendo pantalla" })] }
          )] }
        ),
        _jsxs("button", { onClick: onClose, style: {
            ...glass(0.55, 20),
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 12, padding: "6px 14px",
            display: "flex", alignItems: "center", gap: 6,
            color: "rgba(255,255,255,.8)", fontSize: 12, fontWeight: 500,
            cursor: "pointer",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.1)",
            transition: "all .15s"
          }, children: [
          _jsx(Minimize, { size: 13 }), " Salir"] }
        )] }
      ),


      _jsx("div", { style: {
          position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          transition: "opacity .3s", opacity: showUI ? 1 : 0
        }, children:
        _jsx("div", { style: {
            ...glass(0.5, 16),
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 10, padding: "5px 14px"
          }, children:
          _jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: .3 }, children: "ESC para salir" }) }
        ) }
      )] }
    ));

}





function GlassPip({ stream, label, onExpand, onClose


}) {
  const videoRef = useRef(null);
  const { pos, onMouseDown, isDragging } = useDraggable({ x: 24, y: 88 }, { w: 310, h: 200 });
  const [hov, setHov] = useState(false);
  const [alive, setAlive] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const el = videoRef.current;if (!el || !stream) return;
    el.srcObject = stream;el.play().catch(() => {});
    return () => {el.srcObject = null;};
  }, [stream]);

  const dismiss = (cb) => {
    setLeaving(true);
    setTimeout(() => {setAlive(false);cb?.();}, 220);
  };

  if (!alive) return null;
  const hasVid = !!stream && stream.getVideoTracks().length > 0;

  return (
    _jsx("div", {
      className: "co-pop-in",
      style: {
        position: "fixed", zIndex: 9995,
        left: pos.x, top: pos.y,
        width: 300, height: hasVid ? 180 : 56,
        transition: leaving ?
        "opacity .22s ease, transform .22s cubic-bezier(.4,0,1,1)" :
        isDragging ? "none" : "width .25s, height .25s",
        opacity: leaving ? 0 : 1,
        transform: leaving ? "scale(0.88) translateY(6px)" : "scale(1)",
        userSelect: "none"
      },
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false), children:


      _jsxs("div", { style: {
          ...glass(0.76, 32),
          border: `1px solid ${hov ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.08)"}`,
          borderRadius: 18, overflow: "hidden",
          width: "100%", height: "100%", position: "relative",
          boxShadow: `0 8px 32px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.08)`,
          transition: "border-color .2s, box-shadow .2s"
        }, children: [

        hasVid &&
        _jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true,
          style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: "#000" } }),



        _jsxs("div", {
          style: {
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "7px 10px",
            background: hasVid ? "linear-gradient(to bottom,rgba(0,0,0,.55),transparent)" : "transparent",
            cursor: "move"
          },
          onMouseDown: onMouseDown, children: [

          _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
            _jsx(GripHorizontal, { size: 13, style: { color: "rgba(255,255,255,.25)" } }),
            _jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 500 }, children: label })] }
          ),


          _jsxs("div", { style: {
              display: "flex", gap: 4,
              opacity: hov ? 1 : 0,
              transition: "opacity .18s"
            }, children: [
            onExpand &&
            _jsx("button", {
              onMouseDown: (e) => e.stopPropagation(),
              onClick: () => dismiss(onExpand),
              style: {
                ...glass(0.5, 12),
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 8, width: 24, height: 24,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(255,255,255,.7)",
                transition: "all .15s"
              }, children:
              _jsx(Maximize2, { size: 11 }) }
            ),

            onClose &&
            _jsx("button", {
              onMouseDown: (e) => e.stopPropagation(),
              onClick: () => dismiss(onClose),
              style: {
                background: "rgba(239,68,68,.7)",
                border: "1px solid rgba(239,68,68,.3)",
                borderRadius: 8, width: 24, height: 24,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#fff",
                transition: "all .15s"
              }, children:
              _jsx(X, { size: 11 }) }
            )] }

          )] }
        ),


        _jsx("div", { style: {
            pointerEvents: "none", position: "absolute", inset: 0, borderRadius: 18,
            background: "linear-gradient(135deg,rgba(255,255,255,.07) 0%,transparent 45%)",
            animation: "co-breathe 4s ease-in-out infinite"
          } })] }
      ) }
    ));

}




function MinimizedPill({ status, remoteStream, screenStream, onExpand, onEnd


}) {
  const initX = typeof window !== "undefined" ? window.innerWidth - 280 : 900;
  const { pos, onMouseDown, isDragging } = useDraggable({ x: initX, y: 88 }, { w: 270, h: 60 });
  const [secs, setSecs] = useState(0);
  const [alive, setAlive] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (status !== "connected") return;setSecs(0);
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  const m = Math.floor(secs / 60),s = secs % 60;
  const timeStr = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const label = status === "connected" ? timeStr : status === "calling" ? "Llamando…" : "Sonando…";

  const pipStream = screenStream || remoteStream;

  if (!alive) return null;

  return (
    _jsxs(_Fragment, { children: [
      pipStream &&
      _jsx(GlassPip, {
        stream: pipStream,
        label: screenStream ? "Pantalla compartida" : "En llamada",
        onExpand: onExpand }
      ),


      _jsx("div", { style: {
          position: "fixed", zIndex: 9994,
          left: pos.x, top: pos.y,
          userSelect: "none",
          transition: isDragging ? "none" : "transform .0s"
        }, children:
        _jsxs("div", {
          className: "co-slide-down",
          style: {
            ...glass(0.84, 32),
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 20, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            minWidth: 240, cursor: "move",
            boxShadow: "0 8px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.09)"
          },
          onMouseDown: onMouseDown, children: [

          _jsx("div", { style: {
              pointerEvents: "none", position: "absolute", inset: 0, borderRadius: 20,
              background: "linear-gradient(135deg,rgba(255,255,255,.07) 0%,transparent 55%)"
            } }),
          _jsx(GripHorizontal, { size: 13, style: { color: "rgba(255,255,255,.15)", flexShrink: 0 } }),
          _jsx("div", { style: {
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: status === "connected" ? "#34d399" : "#fbbf24",
              boxShadow: `0 0 8px ${status === "connected" ? "rgba(52,211,153,.6)" : "rgba(251,191,36,.6)"}`,
              animation: "co-status-pulse 2s ease-in-out infinite"
            } }),
          _jsx("span", { style: { fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.88)", flex: 1,
              fontVariantNumeric: "tabular-nums", letterSpacing: -.2 }, children: label }),
          _jsx("button", {
            onMouseDown: (e) => e.stopPropagation(),
            onClick: onExpand,
            style: {
              ...glass(0.3, 10),
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 10, padding: "5px 8px",
              color: "rgba(255,255,255,.5)", cursor: "pointer",
              transition: "all .15s", display: "flex", alignItems: "center", gap: 4,
              fontSize: 11
            }, children:
            _jsx(Maximize2, { size: 12 }) }
          ),
          _jsx("button", {
            onMouseDown: (e) => e.stopPropagation(),
            onClick: onEnd,
            style: {
              background: "rgba(239,68,68,.85)",
              border: "1px solid rgba(239,68,68,.3)",
              borderRadius: 10, padding: "6px 9px",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center",
              transition: "all .15s",
              boxShadow: "0 2px 8px rgba(239,68,68,.3)"
            }, children:
            _jsx(PhoneOff, { size: 13 }) }
          )] }
        ) }
      )] }
    ));

}





function RemoteAudio({ stream, muted }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;if (!el || !stream) return;
    el.srcObject = stream;el.play().catch(() => {});
    return () => {el.srcObject = null;};
  }, [stream]);
  return _jsx("audio", { ref: ref, autoPlay: true, muted: muted, style: { display: "none" } });
}




function CallTimer() {
  const [s, setS] = useState(0);
  useEffect(() => {const id = setInterval(() => setS((n) => n + 1), 1000);return () => clearInterval(id);}, []);
  const h = Math.floor(s / 3600),m = Math.floor(s % 3600 / 60),ss = s % 60;
  return _jsx("span", { style: { fontSize: 12, color: "rgba(255,255,255,.35)", fontVariantNumeric: "tabular-nums", letterSpacing: .2 }, children:
    h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}` }
  );
}




function GlassDropdown({ children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => {if (!ref.current?.contains(e.target)) onClose();};
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);
  return (
    _jsxs("div", { ref: ref, className: "co-slide-up", style: {
        position: "absolute", bottom: 76, left: "50%", transform: "translateX(-50%)",
        zIndex: 60, borderRadius: 18, overflow: "hidden", minWidth: 220,
        ...glass(0.88, 36),
        border: "1px solid rgba(255,255,255,.1)",
        boxShadow: "0 16px 48px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.1)"
      }, children: [
      _jsx("div", { style: {
          pointerEvents: "none", position: "absolute", inset: 0,
          background: "linear-gradient(135deg,rgba(255,255,255,.06) 0%,transparent 50%)"
        } }),
      children] }
    ));

}


const QLTS = [
{ v: "auto", label: "Auto", sub: "Adaptativo" },
{ v: "480p", label: "480p", sub: "854×480 · 30fps" },
{ v: "720p", label: "720p", sub: "1280×720 · 30fps" },
{ v: "1080p", label: "1080p", sub: "1920×1080 · 60fps" },
{ v: "1440p", label: "1440p", sub: "2560×1440 · 60fps" }];

const BPS = { auto: undefined, ["480p"]: 800_000, ["720p"]: 2_000_000, ["1080p"]: 4_000_000, ["1440p"]: 8_000_000 };

function QualityPicker({ value, onChange, onClose, sender

}) {
  const apply = async (q) => {
    onChange(q);onClose();
    if (!sender) return;
    try {
      const p = sender.getParameters();
      if (!p.encodings?.length) p.encodings = [{}];
      p.encodings[0].maxBitrate = BPS[q];
      await sender.setParameters(p);
    } catch {}
  };
  return (
    _jsxs(GlassDropdown, { onClose: onClose, children: [
      _jsx("div", { style: { padding: "10px 6px 6px", borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: 2 }, children:
        _jsx("span", { style: { fontSize: 10, fontWeight: 700, letterSpacing: .8, color: "rgba(255,255,255,.25)", padding: "0 10px", textTransform: "uppercase" }, children: "Calidad de transmisi\xF3n" }) }
      ),
      QLTS.map((q) =>
      _jsxs("button", { onClick: () => apply(q.v),
        style: {
          display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "9px 14px",
          background: value === q.v ? "rgba(255,255,255,.07)" : "transparent",
          border: "none", cursor: "pointer", transition: "background .12s"
        }, children: [
        _jsx("span", { style: { fontSize: 13, fontWeight: 600, color: value === q.v ? "#fff" : "rgba(255,255,255,.6)", width: 38, textAlign: "left" }, children: q.label }),
        _jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,.25)", flex: 1, textAlign: "left" }, children: q.sub }),
        value === q.v && _jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.5)" } })] }, q.v
      )
      )] }
    ));

}

function MicPicker({ mics, selectedId, onSelect, onClose

}) {
  return (
    _jsxs(GlassDropdown, { onClose: onClose, children: [
      _jsx("div", { style: { padding: "10px 6px 6px", borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: 2 }, children:
        _jsx("span", { style: { fontSize: 10, fontWeight: 700, letterSpacing: .8, color: "rgba(255,255,255,.25)", padding: "0 10px", textTransform: "uppercase" }, children: "Micr\xF3fono" }) }
      ),
      mics.map((m) =>
      _jsxs("button", { onClick: () => {onSelect(m.deviceId);onClose();},
        style: {
          display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "9px 14px",
          background: selectedId === m.deviceId ? "rgba(255,255,255,.07)" : "transparent",
          border: "none", cursor: "pointer", transition: "background .12s"
        }, children: [
        _jsx(Mic, { size: 12, style: { color: "rgba(255,255,255,.4)", flexShrink: 0 } }),
        _jsx("span", { style: { fontSize: 12, color: selectedId === m.deviceId ? "#fff" : "rgba(255,255,255,.55)", flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children:
          m.label || `Micrófono ${m.deviceId.slice(0, 6)}` }
        ),
        selectedId === m.deviceId && _jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.5)", flexShrink: 0 } })] }, m.deviceId
      )
      )] }
    ));

}





export function CallOverlay({
  callType, status, participants, currentUserId,
  localStream, remoteStream, screenStream,
  isMuted, isCameraOff, isDeafened, isScreenSharing,
  availableMics = [], selectedMicId = null,
  onEnd, onToggleMute, onToggleCamera, onToggleDeafen, onToggleScreen,
  onSelectMic, onMinimize
}) {
  useGlobalStyles();
  const [minimized, setMinimized] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showMic, setShowMic] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [quality, setQuality] = useState("auto");
  const [connOk, setConnOk] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const screenSender = useRef(null);

  useEffect(() => {
    if (status !== "connected") return;
    const id = setInterval(() => setConnOk(Math.random() > .05), 10000);
    return () => clearInterval(id);
  }, [status]);

  const me = participants.find((p) => p.id === currentUserId);
  const others = participants.filter((p) => p.id !== currentUserId);
  const peerSharing = others.some((o) => o.isScreenSharing);

  const STATUS = {
    calling: "Llamando…", ringing: "Sonando…", connected: "En llamada", ended: "Llamada finalizada"
  };

  if (minimized) return (
    _jsx(MinimizedPill, {
      status: status,
      remoteStream: remoteStream,
      screenStream: peerSharing ? remoteStream : isScreenSharing ? screenStream : null,
      onExpand: () => setMinimized(false),
      onEnd: onEnd }
    ));


  if (fullscreen && remoteStream && others[0]) return (
    _jsxs(_Fragment, { children: [
      _jsx(RemoteAudio, { stream: remoteStream, muted: isDeafened }),
      _jsx(FullscreenViewer, { stream: remoteStream, p: others[0], onClose: () => setFullscreen(false) }),

      _jsxs("div", { className: "co-slide-up", style: {
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, display: "flex", alignItems: "center", gap: 8,
          ...glass(0.82, 28),
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 22, padding: "10px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.09)"
        }, children: [
        _jsx(GlassBtn, { onClick: onToggleMute, active: isMuted, activeColor: "red", label: isMuted ? "Mic off" : "Mic", icon: isMuted ? _jsx(MicOff, { size: 16 }) : _jsx(Mic, { size: 16 }) }),
        _jsx(GlassBtn, { onClick: onToggleDeafen, active: isDeafened, activeColor: "red", label: "Audio", icon: isDeafened ? _jsx(VolumeX, { size: 16 }) : _jsx(Volume2, { size: 16 }) }),
        _jsx(GlassBtn, { onClick: onToggleScreen, active: isScreenSharing, activeColor: "blue", label: "Pantalla", icon: isScreenSharing ? _jsx(MonitorOff, { size: 16 }) : _jsx(Monitor, { size: 16 }) }),
        _jsxs("button", { onClick: () => setFullscreen(false), style: {
            ...glass(0.3, 12),
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 12, padding: "6px 12px",
            color: "rgba(255,255,255,.6)", fontSize: 12, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5, transition: "all .15s"
          }, children: [
          _jsx(Minimize, { size: 12 }), " Ventana"] }
        ),
        _jsxs("button", { onClick: onEnd, style: {
            background: "rgba(239,68,68,.85)",
            border: "1px solid rgba(239,68,68,.3)",
            borderRadius: 12, padding: "7px 14px",
            color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
            boxShadow: "0 2px 12px rgba(239,68,68,.3)", transition: "all .15s"
          }, children: [
          _jsx(PhoneOff, { size: 13 }), " Colgar"] }
        )] }
      )] }
    ));


  return (
    _jsxs(_Fragment, { children: [
      _jsxs("div", { className: "co-fade-in", style: {
          position: "fixed", inset: 0, zIndex: 9990,
          display: "flex", flexDirection: "column",
          background: "#0a0a0c"
        }, children: [
        _jsx(RemoteAudio, { stream: remoteStream, muted: isDeafened }),


        _jsxs("div", { style: {
            ...glass(0.78, 24),
            borderBottom: "1px solid rgba(255,255,255,.05)",
            height: 56, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px"
          }, children: [
          _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
            _jsx("div", { style: {
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: status === "connected" ? "#34d399" : "#fbbf24",
                boxShadow: `0 0 6px ${status === "connected" ? "rgba(52,211,153,.7)" : "rgba(251,191,36,.6)"}`,
                animation: "co-status-pulse 2s ease-in-out infinite"
              } }),
            _jsx("span", { style: { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)" }, children: STATUS[status] }),
            status === "connected" && _jsx(CallTimer, {}),
            _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4, marginLeft: 4 }, children: [
              connOk ?
              _jsx(Wifi, { size: 13, style: { color: "rgba(52,211,153,.6)" } }) :
              _jsx(WifiOff, { size: 13, style: { color: "#f87171" } }),
              _jsx("span", { style: { fontSize: 11, color: connOk ? "rgba(52,211,153,.6)" : "#f87171" }, children:
                connOk ? "Buena" : "Inestable" }
              )] }
            )] }
          ),

          _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
            peerSharing &&
            _jsxs("button", { onClick: () => setFullscreen(true),
              className: "co-pop-in",
              style: {
                ...glass(0.4, 14),
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 12, padding: "5px 12px",
                display: "flex", alignItems: "center", gap: 6,
                color: "rgba(255,255,255,.7)", fontSize: 12, fontWeight: 500,
                cursor: "pointer", marginRight: 6,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.08)",
                transition: "all .15s"
              }, children: [
              _jsx(Maximize2, { size: 12 }), " Pantalla completa"] }
            ),

            _jsx(GlassBtn, { onClick: () => setShowMembers((v) => !v), active: showMembers, activeColor: "white",
              label: "Participantes", icon: _jsx(Users, { size: 15 }), size: "sm" }),
            _jsx(GlassBtn, { onClick: () => {setMinimized(true);onMinimize?.();}, activeColor: "white",
              label: "Minimizar", icon: _jsx(Minimize2, { size: 15 }), size: "sm" })] }
          )] }
        ),


        _jsxs("div", { style: { flex: 1, display: "flex", overflow: "hidden" }, children: [
          _jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [


            (status === "calling" || status === "ringing") &&
            _jsxs("div", { className: "co-fade-in", style: {
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 24
              }, children: [
              _jsxs("div", { style: { position: "relative" }, children: [
                _jsxs("div", { style: { position: "relative" }, children: [
                  _jsxs(Avatar, { className: "h-32 w-32", children: [
                    _jsx(AvatarImage, { src: others[0]?.avatar ?? undefined }),
                    _jsx(AvatarFallback, { style: { background: "#5865f2", color: "#fff", fontSize: 40 }, children:
                      (others[0]?.displayName || "?")[0]?.toUpperCase() }
                    )] }
                  ),
                  others[0]?.avatarDecoration &&
                  _jsx("img", { src: others[0].avatarDecoration, alt: "", draggable: false,
                    style: { position: "absolute", inset: 0, width: "100%", height: "100%",
                      objectFit: "contain", transform: "scale(1.4)", zIndex: 10, pointerEvents: "none" } })] }

                ),
                [1, 1.4, 1.8].map((scale, i) =>
                _jsx("div", { style: {
                    position: "absolute", inset: 0, borderRadius: "50%",
                    border: "2px solid rgba(88,101,242,.3)",
                    transform: `scale(${scale})`,
                    animation: `co-ring-pulse 2s ease-out ${i * .4}s infinite`
                  } }, i)
                )] }
              ),
              _jsxs("div", { style: { textAlign: "center" }, children: [
                _jsx("h2", { style: { fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 4px" }, children: others[0]?.displayName || "Usuario" }),
                _jsx("p", { style: { fontSize: 13, color: "rgba(255,255,255,.35)", margin: 0 }, children: STATUS[status] })] }
              )] }
            ),



            status === "connected" &&
            _jsxs("div", { style: {
                flex: 1, padding: 16,
                display: participants.length <= 2 ? "flex" : "grid",
                alignItems: participants.length <= 2 ? "center" : undefined,
                justifyContent: participants.length <= 2 ? "center" : undefined,
                gridTemplateColumns: participants.length > 2 ? "1fr 1fr" : undefined,
                gap: 12
              }, children: [
              participants.length === 1 && me &&
              _jsx(VideoTile, { p: me, stream: localStream, muted: true }),

              participants.length === 2 &&
              _jsxs("div", { style: { display: "flex", gap: 12, width: "100%", maxWidth: 1100, height: "64vh" }, children: [
                _jsx("div", { style: { flex: 1, borderRadius: 20, overflow: "hidden" }, children:
                  _jsx(VideoTile, {
                    p: others[0],
                    stream: remoteStream,
                    contain: peerSharing,
                    onClick: peerSharing ? () => setFullscreen(true) : undefined }
                  ) }
                ),
                me &&
                _jsx("div", { style: { width: 200, borderRadius: 20, overflow: "hidden", flexShrink: 0 }, children:
                  _jsx(VideoTile, { p: me, stream: localStream, muted: true }) }
                )] }

              ),

              participants.length > 2 && participants.map((p) =>
              _jsx("div", { style: { borderRadius: 20, overflow: "hidden", height: 200 }, children:
                _jsx(VideoTile, {
                  p: p,
                  stream: p.id === currentUserId ? localStream : remoteStream,
                  muted: p.id === currentUserId,
                  contain: p.isScreenSharing,
                  onClick: p.isScreenSharing && p.id !== currentUserId ? () => setFullscreen(true) : undefined }
                ) }, p.id
              )
              )] }
            )] }

          ),


          showMembers &&
          _jsx("div", { className: "co-slide-down", style: {
              width: 220, flexShrink: 0,
              borderLeft: "1px solid rgba(255,255,255,.05)",
              overflowY: "auto",
              ...glass(0.65, 20)
            }, children:
            _jsxs("div", { style: { padding: 12 }, children: [
              _jsxs("p", { style: { fontSize: 10, fontWeight: 700, letterSpacing: .8,
                  color: "rgba(255,255,255,.2)", textTransform: "uppercase", marginBottom: 8 }, children: ["En llamada \xB7 ",
                participants.length] }
              ),
              participants.map((p) =>
              _jsxs("div", { style: {
                  display: "flex", alignItems: "center", gap: 8,
                  borderRadius: 12, padding: "6px 8px",
                  transition: "background .15s", cursor: "default"
                },
                onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,.05)",
                onMouseLeave: (e) => e.currentTarget.style.background = "transparent", children: [
                _jsxs("div", { style: { position: "relative", flexShrink: 0 }, children: [
                  _jsxs(Avatar, { className: "h-7 w-7", children: [
                    _jsx(AvatarImage, { src: p.avatar ?? undefined }),
                    _jsx(AvatarFallback, { style: { background: "#5865f2", color: "#fff", fontSize: 12 }, children:
                      p.displayName[0]?.toUpperCase() }
                    )] }
                  ),
                  p.avatarDecoration &&
                  _jsx("img", { src: p.avatarDecoration, alt: "", draggable: false,
                    style: { position: "absolute", inset: 0, width: "100%", height: "100%",
                      objectFit: "contain", transform: "scale(1.4)", zIndex: 10, pointerEvents: "none" } })] }

                ),
                _jsx("span", { style: { flex: 1, fontSize: 13, color: "rgba(255,255,255,.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p.displayName }),
                _jsxs("div", { style: { display: "flex", gap: 4 }, children: [
                  p.isMuted && _jsx(MicOff, { size: 11, style: { color: "rgba(248,113,113,.7)" } }),
                  p.isSpeaking && _jsx(Signal, { size: 11, style: { color: "#34d399", animation: "co-status-pulse 1s ease-in-out infinite" } })] }
                )] }, p.id
              )
              )] }
            ) }
          )] }

        ),


        _jsxs("div", { style: {
            ...glass(0.88, 32),
            borderTop: "1px solid rgba(255,255,255,.05)",
            height: 80, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 6, padding: "0 24px", position: "relative"
          }, children: [

          _jsx("div", { style: {
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)"
            } }),

          _jsx(ControlBtn, { onClick: onToggleMute, active: isMuted, activeColor: "red", label: isMuted ? "Mic off" : "Silenciar", children:
            isMuted ? _jsx(MicOff, { size: 18 }) : _jsx(Mic, { size: 18 }) }
          ),
          callType === "video" &&
          _jsx(ControlBtn, { onClick: onToggleCamera, active: isCameraOff, activeColor: "red", label: isCameraOff ? "Cám off" : "Cámara", children:
            isCameraOff ? _jsx(VideoOff, { size: 18 }) : _jsx(Video, { size: 18 }) }
          ),

          _jsx(ControlBtn, { onClick: onToggleScreen, active: isScreenSharing, activeColor: "blue", label: isScreenSharing ? "Detener" : "Pantalla", children:
            isScreenSharing ? _jsx(MonitorOff, { size: 18 }) : _jsx(Monitor, { size: 18 }) }
          ),
          _jsx(ControlBtn, { onClick: onToggleDeafen, active: isDeafened, activeColor: "red", label: isDeafened ? "Sordo" : "Audio", children:
            isDeafened ? _jsx(VolumeX, { size: 18 }) : _jsx(Volume2, { size: 18 }) }
          ),

          availableMics.length > 0 && onSelectMic &&
          _jsxs("div", { style: { position: "relative" }, children: [
            showMic &&
            _jsx(MicPicker, { mics: availableMics, selectedId: selectedMicId,
              onSelect: onSelectMic, onClose: () => setShowMic(false) }),

            _jsx(ControlBtn, { onClick: () => {setShowMic((v) => !v);setShowQuality(false);},
              active: showMic, activeColor: "white", label: "Micro", children:
              _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 2 }, children: [
                _jsx(Settings, { size: 16 }), _jsx(ChevronDown, { size: 11, style: { opacity: .5 } })] }
              ) }
            )] }
          ),


          _jsxs("div", { style: { position: "relative" }, children: [
            showQuality &&
            _jsx(QualityPicker, { value: quality, onChange: setQuality,
              onClose: () => setShowQuality(false), sender: screenSender.current }),

            _jsx(ControlBtn, { onClick: () => {setShowQuality((v) => !v);setShowMic(false);},
              active: showQuality, activeColor: "white", label: quality === "auto" ? "Calidad" : quality, children:
              _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 2 }, children: [
                _jsx(Wifi, { size: 16 }), _jsx(ChevronDown, { size: 11, style: { opacity: .5 } })] }
              ) }
            )] }
          ),


          _jsxs("button", { onClick: onEnd, style: {
              background: "rgba(239,68,68,.9)",
              border: "1px solid rgba(239,68,68,.4)",
              borderRadius: 16, padding: "10px 22px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              cursor: "pointer", marginLeft: 8,
              boxShadow: "0 4px 16px rgba(239,68,68,.35),inset 0 1px 0 rgba(255,255,255,.1)",
              transition: "all .18s cubic-bezier(.32,1.2,.5,1)"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(239,68,68,.45),inset 0 1px 0 rgba(255,255,255,.15)";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(239,68,68,.35),inset 0 1px 0 rgba(255,255,255,.1)";
            },
            onMouseDown: (e) => e.currentTarget.style.transform = "scale(0.94)",
            onMouseUp: (e) => e.currentTarget.style.transform = "scale(1.06)", children: [

            _jsx(PhoneOff, { size: 18, style: { color: "#fff" } }),
            _jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,.85)", fontWeight: 600, letterSpacing: .3 }, children: "Colgar" })] }
          )] }
        )] }
      ),


      isScreenSharing && screenStream &&
      _jsx(GlassPip, {
        stream: screenStream,
        label: "Tu pantalla",
        onClose: onToggleScreen }
      )] }

    ));

}