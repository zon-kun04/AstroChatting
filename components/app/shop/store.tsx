



import { createContext, useContext, useReducer, useCallback, useEffect } from "react";import { jsx as _jsx } from "react/jsx-runtime";


export const API_BASE =
typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL ?
process.env.NEXT_PUBLIC_API_URL :
"http://localhost:3001";

function getActiveToken() {
  try {
    const activeEmail = localStorage.getItem("auth_active_email");
    const raw = localStorage.getItem("auth_accounts");
    if (!activeEmail || !raw) return null;
    const accounts = JSON.parse(raw);
    return accounts.find((a) => a.email === activeEmail)?.token ?? null;
  } catch {
    return null;
  }
}

async function apiFetch(url, init = {}) {
  const token = getActiveToken();
  return fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
      "Content-Type": "application/json"
    }
  });
}


export const DC = {
  bgBase: "#1e1f22",
  bgSidebar: "#2b2d31",
  bgCard: "#232428",
  bgModal: "#313338",
  bgInput: "#1e1f22",

  blurple: "#5865f2",
  blurpleHover: "#4752c4",
  green: "#23a55a",
  red: "#f23f42",
  yellow: "#f0b232",
  pink: "#eb459e",

  textPrimary: "#f2f3f5",
  textSecondary: "#b5bac1",
  textMuted: "#80848e",

  border: "rgba(255,255,255,0.06)",
  borderSoft: "rgba(255,255,255,0.03)"
};




export const RARITY_META = {
  common: { label: "Común", color: "#b5bac1", glow: "rgba(181,186,193,0.1)" },
  uncommon: { label: "Poco común", color: "#23a55a", glow: "rgba(35,165,90,0.15)" },
  rare: { label: "Raro", color: "#00a8fc", glow: "rgba(0,168,252,0.2)" },
  epic: { label: "Épico", color: "#9b59b6", glow: "rgba(155,89,182,0.25)" },
  legendary: { label: "Legendario", color: "#f0b232", glow: "rgba(240,178,50,0.3)" },
  special: { label: "Especial", color: "#eb459e", glow: "rgba(235,69,158,0.3)" },
  exclusive: { label: "Exclusivo", color: "#f47fff", glow: "rgba(244,127,255,0.3)" }
};




































































export const fmt = (n) => n?.toLocaleString("es-ES") ?? "0";

export function resolveUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function mapItemToProduct(item) {
  const rawImage = item.value || "";
  const imageUrl = resolveUrl(rawImage);
  return {
    id: item.id,
    name: item.name,
    type: item.category || "unknown",
    rarity: item.rarity || "common",
    price: item.price ?? 0,
    description: item.description || "",
    imageUrl,
    featured: item.featured || false,
    stock: item.stock,
    maxStock: item.maxStock
  };
}


const initialState = {
  fullUser: null,
  products: [],
  loading: false,
  activeTab: "Explorar",
  notification: null,
  transactions: []
};

function storeReducer(state, action) {
  switch (action.type) {
    case "SET_FULL_USER":return { ...state, fullUser: action.payload };
    case "SET_PRODUCTS":return { ...state, products: action.payload };
    case "SET_LOADING":return { ...state, loading: action.loading };
    case "SET_TAB":return { ...state, activeTab: action.payload };
    case "SET_NOTIFICATION":return { ...state, notification: action.payload };
    case "UPDATE_BALANCE":return state.fullUser ? { ...state, fullUser: { ...state.fullUser, ogrs: action.payload } } : state;
    case "SET_TRANSACTIONS":return { ...state, transactions: action.payload };
    default:return state;
  }
}

const StoreCtx = createContext(null);

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const fetchUser = useCallback(async () => {
    try {
      const res = await apiFetch(`${API_BASE}/api/users/me`);
      if (!res.ok) return;
      const data = await res.json();
      dispatch({ type: "SET_FULL_USER", payload: data.user });
    } catch {}
  }, []);

  const fetchProducts = useCallback(async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const res = await apiFetch(`${API_BASE}/api/shop/items`);
      if (!res.ok) return;
      const data = await res.json();
      dispatch({ type: "SET_PRODUCTS", payload: (data.items || []).map(mapItemToProduct) });
    } catch {
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await apiFetch(`${API_BASE}/api/shop/transactions`);
      if (!res.ok) return;
      const data = await res.json();
      dispatch({ type: "SET_TRANSACTIONS", payload: data.transactions || [] });
    } catch {}
  }, []);

  const purchase = useCallback(async (productId) => {
    try {
      const res = await apiFetch(`${API_BASE}/api/shop/buy`, {
        method: "POST",
        body: JSON.stringify({ itemId: productId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al comprar");

      dispatch({ type: "UPDATE_BALANCE", payload: data.newBalance });
      dispatch({ type: "SET_NOTIFICATION", payload: { type: "success", msg: "¡Objeto adquirido!" } });
      await fetchUser();
      return true;
    } catch (err) {
      dispatch({ type: "SET_NOTIFICATION", payload: { type: "error", msg: err.message } });
      return false;
    }
  }, [fetchUser]);

  const gift = useCallback(async (productId, targetUserId, message = "") => {
    try {
      const res = await apiFetch(`${API_BASE}/api/shop/gift`, {
        method: "POST",
        body: JSON.stringify({ itemId: productId, targetUserId, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al regalar");

      dispatch({ type: "UPDATE_BALANCE", payload: data.newBalance });
      dispatch({ type: "SET_NOTIFICATION", payload: { type: "success", msg: "¡Regalo enviado con éxito!" } });
      await fetchUser();
      return true;
    } catch (err) {
      dispatch({ type: "SET_NOTIFICATION", payload: { type: "error", msg: err.message } });
      return false;
    }
  }, [fetchUser]);

  const equipItem = useCallback(async (itemId, equipped) => {
    try {
      const res = await apiFetch(`${API_BASE}/api/shop/equip`, {
        method: "PUT",
        body: JSON.stringify({ itemId, equipped })
      });
      if (!res.ok) throw new Error("Error al equipar");
      dispatch({ type: "SET_NOTIFICATION", payload: { type: "success", msg: "Perfil actualizado" } });
      await fetchUser();
      return true;
    } catch (err) {
      dispatch({ type: "SET_NOTIFICATION", payload: { type: "error", msg: err.message } });
      return false;
    }
  }, [fetchUser]);

  const sellItem = useCallback(async (itemId) => {
    try {
      const res = await apiFetch(`${API_BASE}/api/shop/sell`, {
        method: "POST",
        body: JSON.stringify({ itemId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al vender");

      dispatch({ type: "UPDATE_BALANCE", payload: data.newBalance });
      dispatch({ type: "SET_NOTIFICATION", payload: { type: "info", msg: data.message } });
      await fetchUser();
      return true;
    } catch (err) {
      dispatch({ type: "SET_NOTIFICATION", payload: { type: "error", msg: err.message } });
      return false;
    }
  }, [fetchUser]);

  useEffect(() => {
    fetchUser();
    fetchProducts();
    fetchTransactions();
  }, [fetchUser, fetchProducts, fetchTransactions]);

  useEffect(() => {
    if (!state.notification) return;
    const t = setTimeout(() => dispatch({ type: "SET_NOTIFICATION", payload: null }), 3000);
    return () => clearTimeout(t);
  }, [state.notification]);

  return (
    _jsx(StoreCtx.Provider, { value: { state, dispatch, purchase, gift, equipItem, sellItem, fetchUser, fetchProducts, fetchTransactions }, children:
      children }
    ));

}