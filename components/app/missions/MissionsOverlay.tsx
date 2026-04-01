"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { OverlayShell } from "../stories/OverlayShell";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import {
  MessageSquare,
  Heart,
  Camera,
  Compass,
  Gift,
  Upload,
  Trophy,
  Flame,
  Target,
  Zap,
  CheckCircle2,
  Star,
  Loader2,
  AlertCircle } from
"lucide-react";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";


const missionIconMap = {
  MessageSquare,
  Heart,
  Camera,
  Compass,
  Gift,
  Upload,
  Trophy,
  Flame
};



const missionTabs = [
{ key: "daily", label: "Diario" },
{ key: "weekly", label: "Semanal" },
{ key: "special", label: "Especial" }];








function MissionCard({ mission, onClaim, claiming }) {
  const Icon = missionIconMap[mission.icon] || Target;
  const prog = mission.progress || 0;
  const completed = mission.completed || false;
  const claimed = mission.claimed || false;
  const percent = Math.min(prog / mission.goal * 100, 100);


  const rewardText = mission.rewards.map((r) => {
    if (r.type === 'ogrs' || r.type === 'xp') return `${r.amount} ${r.type.toUpperCase()}`;
    if (r.type === 'badge') return `Insignia: ${r.value}`;
    if (r.type === 'item') return r.name || 'Objeto';
    return r.type;
  }).join(", ");

  return (
    _jsx("div", {
      className: cn(
        "rounded-lg border border-[var(--border)] bg-[var(--discord-dark)] p-4 transition-all group",
        completed && !claimed && "border-[var(--discord-green)]/50 shadow-lg shadow-[var(--discord-green)]/10 ring-1 ring-[var(--discord-green)]/20",
        claimed && "opacity-60 bg-[var(--discord-sidebar)]/30"
      ), children:

      _jsxs("div", { className: "flex items-start gap-4", children: [
        _jsx("div", {
          className: cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors",
            completed ? "bg-[var(--discord-green)]/20" : "bg-[var(--discord-blurple)]/20"
          ), children:

          _jsx(Icon, {
            className: cn(
              "h-6 w-6",
              completed ? "text-[var(--discord-green)]" : "text-[var(--discord-blurple)]"
            ) }
          ) }
        ),
        _jsxs("div", { className: "flex-1 min-w-0", children: [
          _jsxs("div", { className: "flex items-center justify-between", children: [
            _jsxs("div", { className: "flex items-center gap-2 overflow-hidden", children: [
              _jsx("h4", { className: "text-[15px] font-bold text-[var(--foreground)] truncate", children: mission.title }),
              completed && _jsx(CheckCircle2, { className: "h-4 w-4 text-[var(--discord-green)] flex-shrink-0" })] }
            ),
            !completed &&
            _jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] px-1.5 py-0.5 rounded bg-[var(--discord-sidebar)]", children: "EN PROGRESO" }

            )] }

          ),
          _jsx("p", { className: "text-[13px] text-[var(--muted-foreground)] mt-1 leading-tight", children: mission.description }),


          _jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
            _jsx("div", { className: "flex-1 h-2 rounded-full bg-[var(--discord-sidebar)] overflow-hidden shadow-inner", children:
              _jsx("div", {
                className: cn(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  completed ? "bg-[var(--discord-green)]" : "bg-[var(--discord-blurple)]"
                ),
                style: { width: `${percent}%` } }
              ) }
            ),
            _jsxs("span", { className: "text-xs font-bold text-[var(--foreground)] tabular-nums", children: [
              prog, " / ", mission.goal] }
            )] }
          ),


          _jsxs("div", { className: "flex items-center justify-between mt-4", children: [
            _jsxs("div", { className: "flex items-center gap-2 overflow-hidden bg-[var(--discord-sidebar)]/50 px-2 py-1 rounded-md", children: [
              _jsx(Star, { className: "h-3.5 w-3.5 text-[var(--discord-yellow)] flex-shrink-0" }),
              _jsx("span", { className: "text-[11px] font-bold text-[var(--discord-yellow)] truncate uppercase", children:
                rewardText }
              )] }
            ),
            completed && !claimed &&
            _jsxs("button", {
              disabled: claiming,
              onClick: () => onClaim(mission.id),
              className: "flex items-center gap-2 rounded-md bg-[var(--discord-green)] px-4 py-1.5 text-xs font-bold text-[#ffffff] hover:brightness-110 active:scale-95 transition-all shadow-sm disabled:opacity-50", children: [

              claiming ? _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : _jsx(Zap, { className: "h-3.5 w-3.5" }), "RECLAMAR"] }

            ),

            claimed &&
            _jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--discord-green)]/10 text-[var(--discord-green)] font-bold text-xs", children: [
              _jsx(CheckCircle2, { className: "h-3.5 w-3.5" }), "RECLAMADO"] }

            )] }

          )] }
        )] }
      ) }
    ));

}












export function MissionsOverlay({ onClose }) {
  const [activeTab, setActiveTab] = useState("daily");
  const [missions, setMissions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [ogrsMultiplier, setOgrsMultiplier] = useState(1);
  const { toast } = useToast();

  const fetchMissions = useCallback(async () => {
    try {
      const data = await api.get("/missions");
      setMissions(data.missions);
      setStreak(data.streak);
      setOgrsMultiplier(data.ogrsMultiplier);
    } catch (err) {
      console.error("Error fetching missions:", err);
      toast({
        title: "Error de conexión",
        description: "No se pudieron obtener los datos reales del servidor.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const handleClaim = useCallback(async (missionId) => {
    setClaimingId(missionId);
    try {
      const res = await api.post(`/missions/claim/${missionId}`);
      toast({
        title: "¡Misión Reclamada!",
        description: res.message || "Has recibido tus recompensas en tu cuenta."
      });

      await fetchMissions();
    } catch (err) {
      toast({
        title: "Error al reclamar",
        description: err.message || "Hubo un problema al procesar tu recompensa.",
        variant: "destructive"
      });
    } finally {
      setClaimingId(null);
    }
  }, [fetchMissions, toast]);

  const filteredMissions = missions.filter((m) => m.type === activeTab);

  return (
    _jsx(OverlayShell, { title: "Sistema de Misiones", onClose: onClose, variant: "panel", children:
      _jsx("div", { className: "max-h-[80vh] overflow-y-auto custom-scrollbar", children:
        _jsxs("div", { className: "p-6 space-y-6", children: [

          _jsx("div", { className: "relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--discord-blurple)] to-[var(--discord-nitro)] p-1", children:
            _jsx("div", { className: "bg-[var(--discord-dark)] rounded-[10px] p-5", children:
              _jsxs("div", { className: "flex items-center justify-between relative z-10", children: [
                _jsxs("div", { className: "flex items-center gap-4", children: [
                  _jsxs("div", { className: "relative", children: [
                    _jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--discord-blurple)]/10", children:
                      _jsx(Flame, { className: "h-8 w-8 text-[var(--discord-blurple)] animate-pulse" }) }
                    ),
                    _jsx("div", { className: "absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--discord-yellow)] text-[var(--discord-dark)] text-[10px] font-black shadow-lg", children:
                      streak }
                    )] }
                  ),
                  _jsxs("div", { children: [
                    _jsxs("h3", { className: "text-xl font-black text-[var(--foreground)] tracking-tight", children: ["RACHA DE ",
                      streak, " ", streak === 1 ? 'DÍA' : 'DÍAS'] }
                    ),
                    _jsx("p", { className: "text-[13px] text-[var(--muted-foreground)] font-medium", children: "Completa misiones diarias para multiplicar tus ganancias." }

                    )] }
                  )] }
                ),
                _jsxs("div", { className: "flex flex-col items-center justify-center bg-[var(--discord-sidebar)] px-4 py-2 rounded-xl border border-[var(--border)]", children: [
                  _jsxs("div", { className: "flex items-center gap-1.5", children: [
                    _jsx(Zap, { className: "h-5 w-5 text-[var(--discord-yellow)] fill-[var(--discord-yellow)]" }),
                    _jsxs("span", { className: "text-2xl font-black text-[var(--discord-yellow)]", children: ["x", ogrsMultiplier.toFixed(1)] })] }
                  ),
                  _jsx("span", { className: "text-[10px] font-bold text-[var(--muted-foreground)] uppercase", children: "Recompensas" })] }
                )] }
              ) }
            ) }
          ),


          _jsx("div", { className: "flex gap-1 rounded-xl bg-[var(--discord-darker)] p-1.5 shadow-inner", children:
            missionTabs.map((tab) =>
            _jsx("button", {

              onClick: () => setActiveTab(tab.key),
              className: cn(
                "flex-1 rounded-lg px-3 py-2 text-[13px] font-bold transition-all uppercase tracking-wide",
                activeTab === tab.key ?
                "bg-[var(--discord-blurple)] text-[#ffffff] shadow-md shadow-[var(--discord-blurple)]/20" :
                "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5"
              ), children:

              tab.label }, tab.key
            )
            ) }
          ),


          _jsx("div", { className: "space-y-4", children:
            loading ?
            _jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-[var(--muted-foreground)] bg-[var(--discord-dark)] rounded-xl border border-dashed border-[var(--border)]", children: [
              _jsx(Loader2, { className: "h-10 w-10 animate-spin mb-4 text-[var(--discord-blurple)]" }),
              _jsx("p", { className: "font-bold text-sm", children: "Sincronizando con la API Real..." })] }
            ) :
            filteredMissions.length > 0 ?
            filteredMissions.map((mission) =>
            _jsx(MissionCard, {

              mission: mission,
              onClaim: handleClaim,
              claiming: claimingId === mission.id }, mission.id
            )
            ) :

            _jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center bg-[var(--discord-dark)] rounded-xl border border-dashed border-[var(--border)]", children: [
              _jsx(Target, { className: "h-12 w-12 text-[var(--muted-foreground)] mb-4 opacity-10" }),
              _jsx("p", { className: "text-[var(--muted-foreground)] font-bold", children: "No hay misiones reales cargadas en esta categor\xEDa." }),
              _jsx("button", {
                onClick: fetchMissions,
                className: "mt-4 text-xs font-bold text-[var(--discord-blurple)] hover:underline", children:
                "REINTENTAR CARGA" }

              )] }
            ) }

          ),


          _jsxs("div", { className: "flex items-start gap-2 p-4 rounded-lg bg-[var(--discord-blurple)]/5 border border-[var(--discord-blurple)]/20", children: [
            _jsx(AlertCircle, { className: "h-4 w-4 text-[var(--discord-blurple)] flex-shrink-0 mt-0.5" }),
            _jsxs("p", { className: "text-[11px] text-[var(--muted-foreground)] leading-normal", children: ["Las misiones se actualizan en tiempo real. Si no ves tu progreso inmediatamente, intenta enviar otro mensaje o reaccionar de nuevo. Todas las recompensas se a\xF1aden directamente a tu moneda ",
              ogrsMultiplier > 1 ? `(con un bono de x${ogrsMultiplier.toFixed(1)})` : 'base', "."] }
            )] }
          )] }
        ) }
      ) }
    ));

}