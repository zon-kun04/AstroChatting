


















































export const API = "http://localhost:3001/api";
export const STORAGE_KEYS = {
  accounts: "auth_accounts",
  activeEmail: "auth_active_email",
  isLoggedIn: "isLoggedIn"
};

export function getAccounts() {
  try {return JSON.parse(localStorage.getItem(STORAGE_KEYS.accounts) || "[]");}
  catch {return [];}
}

export function saveAccount(user, token, refreshToken) {
  const all = getAccounts();
  const acc = {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    banner: user.banner,
    decorations: user.decorations,
    profileColor: user.profileColor,
    token,
    refreshToken,
    role: user.role
  };
  const i = all.findIndex((a) => a.email === user.email);
  if (i >= 0) all[i] = acc;else all.push(acc);
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(all));
  localStorage.setItem(STORAGE_KEYS.activeEmail, user.email);
  localStorage.setItem(STORAGE_KEYS.isLoggedIn, "true");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage"));
  }
}

export function removeAccount(email) {
  const remaining = getAccounts().filter((a) => a.email !== email);
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(remaining));


  if (localStorage.getItem(STORAGE_KEYS.activeEmail) === email) {
    localStorage.removeItem(STORAGE_KEYS.activeEmail);
    localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage"));
  }
}

export function getActiveAccount() {
  const email = localStorage.getItem(STORAGE_KEYS.activeEmail);
  if (!email) return null;
  return getAccounts().find((a) => a.email === email) ?? null;
}

export function setActiveAccount(email) {
  localStorage.setItem(STORAGE_KEYS.activeEmail, email);
  localStorage.setItem(STORAGE_KEYS.isLoggedIn, "true");
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.activeEmail);
  localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
}


async function apiFetch(path, options) {
  const r = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Error en la solicitud");
  return data;
}

function getHWID() {
  try {
    const key = "device_hwid";
    let v = localStorage.getItem(key);
    if (!v) {

      const ua = navigator.userAgent || "unknown";
      const lang = navigator.language || "unknown";
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
      const seed = `${ua}|${lang}|${tz}|${Math.random().toString(36).slice(2)}`;

      let h = 0;for (let i = 0; i < seed.length; i++) {h = (h << 5) - h + seed.charCodeAt(i);h |= 0;}
      v = `hw_${Math.abs(h)}`;
      localStorage.setItem(key, v);
    }
    return v;
  } catch {return null;}
}

function getDeviceInfo() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
  const platform = typeof navigator !== 'undefined' && navigator.userAgentData?.platform || (typeof navigator !== 'undefined' ? navigator.platform : 'unknown');
  const isMobile = typeof navigator !== 'undefined' ? /Mobi|Android/i.test(navigator.userAgent) : false;
  const type = isMobile ? 'mobile' : 'desktop';
  const os = platform || 'unknown';

  const browser = /Chrome\
  return { hwid: getHWID(), name: `${type === 'mobile' ? 'Móvil' : 'Escritorio'} - ${browser}`, type, browser, os };
}

export async function apiLogin(email, password) {
  const device = getDeviceInfo();
  return apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password, device }) });
}

export async function apiRegister(body)

{
  const device = getDeviceInfo();
  return apiFetch("/auth/register", { method: "POST", body: JSON.stringify({ ...body, device }) });
}



export async function apiGetMe(token) {
  return apiFetch("/users/me", { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
}


export const avatarUrl = (seed) =>
`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;