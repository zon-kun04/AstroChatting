import { useEffect, useState } from "react";


const API_BASE = "http://localhost:3001";

function getActiveToken() {
  try {
    const activeEmail = localStorage.getItem("auth_active_email");
    const accounts = JSON.parse(localStorage.getItem("auth_accounts") || "[]");
    const account = accounts.find((a) => a.email === activeEmail);
    return account?.token ?? null;
  } catch {
    return null;
  }
}







export function useCurrentUser() {
  const [state, setState] = useState({
    user: null,
    email: "",
    loading: true
  });

  useEffect(() => {
    const token = getActiveToken();
    if (!token) {setState((s) => ({ ...s, loading: false }));return;}

    fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).
    then((r) => r.json()).
    then((data) => {
      const u = data.user;

      setState({
        email: u.email ?? "",
        loading: false,
        user: {
          id: u.id,
          username: u.username,
          displayName: u.displayName,


          avatar: u.avatar ? `${API_BASE}${u.avatar}` : undefined,
          banner: u.banner ? `${API_BASE}${u.banner}` : undefined,


          decorations: u.decorations ? {
            nameplate: u.decorations.nameplate ?? "default",
            avatarDecoration: u.decorations.avatarDecoration !== "none" ?
            `${API_BASE}${u.decorations.avatarDecoration}` :
            undefined,
            profileEffect: u.decorations.profileEffect !== "none" ?
            u.decorations.profileEffect :
            undefined,
            entryEffect: u.decorations.entryEffect !== "none" ?
            `${API_BASE}${u.decorations.entryEffect}` :
            undefined
          } : undefined,


          bio: u.bio ?? "",
          status: u.status ?? "offline",
          customStatus: u.customStatus ?? "",


          badges: u.badges?.map((icon, i) => ({
            id: `b${i}`,
            name: "",
            icon: `${API_BASE}${icon}`,
            color: "#fff"
          })) ?? [],


          cardColor: u.profileColor ?? "#5865F2",
          isOctoPro: false,
          ogrs: u.ogrs ?? 0,
          xp: 0,
          level: 0,
          createdAt: u.createdAt,


          socialLinks: u.socialLinks ?? {},
          favoriteMusic: u.favoriteMusic ?? null
        }
      });
    }).
    catch(console.error);
  }, []);

  return state;
}