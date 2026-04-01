class WebSocketClient {
  ws = null;
  listeners = new Map();
  token = null;
  reconnectTimer = null;
  isConnected = false;



  constructor() {
    if (typeof window !== "undefined") {
      this.initFromStorage();
      window.addEventListener("storage", this.initFromStorage.bind(this));
    }
  }

  static getInstance() {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  initFromStorage() {
    try {
      const email = localStorage.getItem("auth_active_email");
      if (!email) return this.disconnect();
      const accounts = JSON.parse(localStorage.getItem("auth_accounts") || "[]");
      const activeAccount = accounts.find((a) => a.email === email);
      if (activeAccount?.token) {
        this.connect(activeAccount.token);
      } else {
        this.disconnect();
      }
    } catch {}
  }

  connect(token) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      if (this.token === token) return;
      this.disconnect();
    }

    this.token = token;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    const wsUrl = baseUrl.replace(/^http/, "ws") + "/ws";

    this.ws = new WebSocket(`${wsUrl}?token=${token}`);

    this.ws.onopen = () => {
      console.log("[WS] Connected");
      this.isConnected = true;
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      this.emit("connected", { connected: true });
      this.send("sync:fetch");
    };

    this.ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { event: evName, data } = payload;
        this.emit(evName, data);
      } catch (e) {
        console.error("[WS] Parse error", e);
      }
    };

    this.ws.onclose = () => {
      console.log("[WS] Disconnected, reconnecting...");
      this.isConnected = false;
      this.emit("disconnected", { connected: false });
      if (!this.reconnectTimer && this.token) {
        this.reconnectTimer = setTimeout(() => this.connect(this.token), 3000);
      }
    };

    this.ws.onerror = (e) => {
      console.error("[WS] Error", e);
    };
  }

  disconnect() {
    this.token = null;
    this.isConnected = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.emit("disconnected", { connected: false });
  }

  emit(event, data) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const h of handlers) h(data);
    }
  }

  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(handler);
  }

  off(event, handler) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  send(event, data = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    } else {
      console.warn("[WS] Cannot send, not connected", event, data);
    }
  }
}

export const wsClient = WebSocketClient.getInstance();