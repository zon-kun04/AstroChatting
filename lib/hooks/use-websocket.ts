import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const RECONNECT_MS = 3500;
const HEALTH_TIMEOUT_MS = 4000;

let globalWs = null;
export function getWsRef() {return globalWs;}
export function wsSend(event, data) {
  if (globalWs?.readyState === WebSocket.OPEN) {
    globalWs.send(JSON.stringify({ event, data }));
  }
}

function getToken() {
  try {
    const accountsRaw = localStorage.getItem("auth_accounts");
    const activeEmail = localStorage.getItem("auth_active_email");
    if (!accountsRaw || !activeEmail) return null;
    const accounts = JSON.parse(accountsRaw);
    return accounts.find((a) => a.email === activeEmail)?.token ?? null;
  } catch {return null;}
}










async function diagnoseDisconnect(token) {
  if (token) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), HEALTH_TIMEOUT_MS);
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: ctrl.signal
      });
      clearTimeout(timer);

      const body = await res.json().catch(() => ({}));
      const msg = (body?.error ?? "").toLowerCase();
      if (msg.includes("expired") || msg.includes("token")) return "token_expired";


      return "server";
    } catch {

      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 3000);
        await fetch(`${API_URL}/api/health`, {
          method: "GET", cache: "no-store", signal: ctrl.signal
        });
        clearTimeout(timer);
        return "server";
      } catch {
        return "network";
      }
    }
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), HEALTH_TIMEOUT_MS);
    await fetch(`${API_URL}/api/health`, {
      method: "GET", cache: "no-store", signal: ctrl.signal
    });
    clearTimeout(timer);
    return "server";
  } catch {
    return "network";
  }
}








export function useWebSocket(options = {}) {
  const { autoReconnect = true } = options;
  const router = useRouter();

  const [status, setStatus] = useState("connecting");
  const [disconnectReason, setDisconnectReason] = useState(null);

  const wsRef = useRef(null);
  const optionsRef = useRef(options);
  const reconnectTimer = useRef(null);
  const redirectingRef = useRef(false);



  const hasConnectedRef = useRef(false);

  optionsRef.current = options;

  const clearReconnect = () => {
    if (reconnectTimer.current) {clearTimeout(reconnectTimer.current);reconnectTimer.current = null;}
  };

  const connect = useCallback(() => {
    if (redirectingRef.current) return;

    const token = getToken();
    if (!token) {
      redirectingRef.current = true;
      setStatus("disconnected");
      setDisconnectReason("token_expired");
      setTimeout(() => router.replace("/auth"), 3500);
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setStatus("connecting");



    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = ws;
    globalWs = ws;

    ws.onopen = () => {
      hasConnectedRef.current = true;
      setStatus("connected");
      setDisconnectReason(null);
      clearReconnect();
      optionsRef.current.onConnected?.(null);
    };

    ws.onmessage = (e) => {
      try {
        const { event: ev, data } = JSON.parse(e.data);
        if (ev === "connection:established") optionsRef.current.onConnected?.(data);
        optionsRef.current.onEvent?.[ev]?.(data);
      } catch {}
    };

    ws.onclose = async () => {
      globalWs = null;
      if (redirectingRef.current) return;



      if (!hasConnectedRef.current) {
        setStatus("disconnected");
        setDisconnectReason("server");
        if (autoReconnect) {
          reconnectTimer.current = setTimeout(() => connect(), RECONNECT_MS);
        }
        return;
      }


      setStatus("disconnected");
      optionsRef.current.onDisconnected?.();

      const reason = await diagnoseDisconnect(getToken());
      if (redirectingRef.current) return;

      setDisconnectReason(reason);

      if (reason === "token_expired") {
        redirectingRef.current = true;
        console.warn("[WS] Token expirado → /auth");
        setTimeout(() => router.replace("/auth"), 3500);
        return;
      }

      if (autoReconnect) {
        reconnectTimer.current = setTimeout(() => connect(), RECONNECT_MS);
      }
    };

    ws.onerror = (err) => console.error("[WS] Error", err);

  }, [autoReconnect, router]);

  const disconnect = useCallback(() => {
    clearReconnect();
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const send = useCallback((event, data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event, data }));
    }
  }, []);

  useEffect(() => {
    redirectingRef.current = false;
    hasConnectedRef.current = false;
    connect();
    return () => {clearReconnect();disconnect();};

  }, []);

  return { send, disconnect, reconnect: connect, status, disconnectReason };
}