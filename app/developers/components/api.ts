import { getActiveAccount } from "../../../lib/auth";

export const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001");
export const BASE = `${BACKEND}/api`;

export function authHeaders() {
  const acc = getActiveAccount();
  return acc ?
  { Authorization: `Bearer ${acc.token}`, "Content-Type": "application/json" } :
  { "Content-Type": "application/json" };
}

export function assetUrl(p) {
  if (!p) return null;
  return p.startsWith("http") ? p : `${BACKEND}${p.startsWith("/") ? "" : "/"}${p}`;
}