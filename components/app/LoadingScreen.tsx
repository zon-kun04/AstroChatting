"use client";
import { useEffect, useState } from "react";import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";





const TIPS = [
"Preparando tus servidores…",
"Cargando mensajes…",
"Conectando con tus amigos…",
"Sincronizando datos…",
"Casi listo…"];


export function LoadingScreen({ tip }) {
  const [mounted, setMounted] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {setTimeout(() => setMounted(true), 40);}, []);


  useEffect(() => {
    if (!mounted) return;
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) {clearInterval(iv);return p;}
        return Math.min(92, p + Math.max(0.35, (92 - p) * 0.022));
      });
    }, 60);
    return () => clearInterval(iv);
  }, [mounted]);


  useEffect(() => {
    if (tip) return;
    const iv = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIdx((i) => (i + 1) % TIPS.length);
        setTipVisible(true);
      }, 400);
    }, 3400);
    return () => clearInterval(iv);
  }, [tip]);

  const displayTip = tip ?? TIPS[tipIdx];
  const isWarning = !!tip;

  return (
    _jsxs(_Fragment, { children: [
      _jsx("style", { children: `
        @keyframes ls-breathe {
          0%, 100% { opacity: .18; transform: scale(1)    }
          50%       { opacity: .28; transform: scale(1.06) }
        }
        @keyframes ls-fadein {
          from { opacity: 0; transform: translateY(6px) }
          to   { opacity: 1; transform: translateY(0)   }
        }
        @keyframes ls-shimmer {
          0%   { background-position: -200% center }
          100% { background-position:  200% center }
        }
      ` }),

      _jsxs("div", { style: {
          position: "fixed", inset: 0, zIndex: 99999,
          background: "#25272b",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          opacity: mounted ? 1 : 0,
          transition: "opacity .5s ease",
          overflow: "hidden"
        }, children: [


        _jsx("div", { style: {
            position: "absolute",
            width: 480, height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            animation: "ls-breathe 5s ease-in-out infinite",
            pointerEvents: "none"
          } }),


        _jsx("div", { style: {
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `
            linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)"
          } }),


        _jsxs("div", { style: {
            display: "flex", flexDirection: "column", alignItems: "center",
            animation: "ls-fadein .6s .1s cubic-bezier(.4,0,.2,1) both"
          }, children: [


          _jsxs("div", { style: { textAlign: "center", marginBottom: 52, userSelect: "none" }, children: [
            _jsx("p", { style: {
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-1px",
                color: "rgba(255,255,255,0.9)",
                fontFamily: "'gg sans','Noto Sans',ui-sans-serif,sans-serif",
                lineHeight: 1
              }, children: "Astro Chat" }

            ),
            _jsxs("div", { style: {
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8,
                marginTop: 8
              }, children: [

              _jsx("div", { style: { height: 1, width: 20, background: "rgba(255,255,255,0.12)" } }),
              _jsx("p", { style: {
                  margin: 0, fontSize: 9, fontWeight: 600,
                  letterSpacing: "3.5px", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.18)",
                  fontFamily: "'gg sans','Noto Sans',ui-sans-serif,sans-serif"
                }, children: "Astro Studios" }

              ),
              _jsx("div", { style: { height: 1, width: 20, background: "rgba(255,255,255,0.12)" } })] }
            )] }
          ),


          _jsx("div", { style: {
              width: 160, height: 2, borderRadius: 99,
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden", marginBottom: 20,
              position: "relative"
            }, children:
            _jsx("div", { style: {
                height: "100%", borderRadius: 99,
                width: `${progress}%`,
                background: `linear-gradient(
                90deg,
                rgba(255,255,255,0.0)   0%,
                rgba(255,255,255,0.55) 40%,
                rgba(255,255,255,0.85) 60%,
                rgba(255,255,255,0.55) 80%,
                rgba(255,255,255,0.0) 100%
              )`,
                backgroundSize: "200% 100%",
                animation: "ls-shimmer 2s linear infinite",
                transition: "width .1s linear"
              } }) }
          ),


          _jsx("p", { style: {
              margin: 0,
              fontSize: 11.5,
              fontWeight: isWarning ? 500 : 400,
              color: isWarning ?
              "rgba(255,255,255,0.55)" :
              "rgba(255,255,255,0.22)",
              fontFamily: "'gg sans','Noto Sans',ui-sans-serif,sans-serif",
              letterSpacing: ".3px",
              textAlign: "center",
              maxWidth: 260,
              opacity: tipVisible ? 1 : 0,
              transform: tipVisible ? "translateY(0)" : "translateY(3px)",
              transition: "opacity .4s ease, transform .4s ease"
            }, children:
            displayTip }
          )] }
        ),


        _jsx("p", { style: {
            position: "absolute", bottom: 28,
            margin: 0, fontSize: 10,
            color: "rgba(255,255,255,0.08)",
            fontFamily: "'gg sans','Noto Sans',ui-sans-serif,sans-serif",
            letterSpacing: "1.5px", textTransform: "uppercase",
            userSelect: "none",
            animation: "ls-fadein .6s .5s both"
          }, children: "\xA9 2026 Astro Studios" }

        )] }
      )] }
    ));

}