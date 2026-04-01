





const RAW_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").trim();
const BASE_URL = `${RAW_BASE}${/\/api\/?$/.test(RAW_BASE) ? '' : '/api'}`;

function getToken() {
  if (typeof window === "undefined") return null;
  try {
    const activeEmail = localStorage.getItem("auth_active_email");
    if (!activeEmail) return null;

    const accounts = JSON.parse(localStorage.getItem("auth_accounts") || "[]");
    const account = accounts.find((a) => a.email === activeEmail);
    return account?.token ?? null;
  } catch {
    return null;
  }
}

function isFormData(value) {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

async function req(path, init) {
  const token = getToken();


  const baseHeaders = {};
  if (!isFormData(init?.body)) {

    baseHeaders["Content-Type"] = "application/json";
  }
  if (token) baseHeaders["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...baseHeaders,
      ...init?.headers
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));


    if (err.code === 'USER_BANNED') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('astro:banned', { detail: err.banInfo }));
      }
    }

    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  return res.json();
}

import axios from 'axios';

export const api = {
  get: (path) => req(path),
  post: (path, body, init) =>
  req(path, {
    method: "POST",
    body: isFormData(body) ? body : body !== undefined ? JSON.stringify(body) : undefined,
    ...(init || {})
  }),
  put: (path, body, init) =>
  req(path, {
    method: "PUT",
    body: isFormData(body) ? body : body !== undefined ? JSON.stringify(body) : undefined,
    ...(init || {})
  }),
  delete: (path) => req(path, { method: "DELETE" }),
  patch: (path, body, init) =>
  req(path, {
    method: "PATCH",
    body: isFormData(body) ? body : body !== undefined ? JSON.stringify(body) : undefined,
    ...(init || {})
  }),
  upload: async (path, formData, onProgress) => {
    const token = getToken();
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(`${BASE_URL}${path}`, formData, {
      headers,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  }
};