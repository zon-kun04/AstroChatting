

export const currentUser = {
  id: "me",
  username: "Astro",
  displayName: "AstroA",
  avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=astroking&backgroundColor=5865f2",
  banner: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&h=200&fit=crop",
  bio: "Building the next big thing. Full-stack dev & gamer.",
  status: "online",
  customStatus: "Coding Astro",
  badges: [
  { id: "b1", name: "OctoPRO", icon: "Crown", color: "#f47fff" },
  { id: "b2", name: "Early Adopter", icon: "Zap", color: "#fee75c" },
  { id: "b3", name: "Bug Hunter", icon: "Bug", color: "#57f287" }],

  isOctoPro: true,
  ogrs: 15420,
  xp: 84200,
  level: 42,
  createdAt: "2024-01-15T00:00:00Z",
  cardColor: "#5865f2",
  favoriteMusic: "Lofi Hip Hop",
  favoriteGames: ["Valorant", "Minecraft", "Elden Ring"],
  profileEffect: "sparkle"
};

export const mockUsers = [
{
  id: "u1",
  username: "XD",
  displayName: "XD",
  avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=shadow&backgroundColor=23a559",
  bio: "Ethical hacker & CTF player",
  status: "online",
  customStatus: "Playing CTF",
  badges: [{ id: "b1", name: "Hacker", icon: "Shield", color: "#ed4245" }],
  isOctoPro: false,
  ogrs: 3200,
  xp: 12000,
  level: 15,
  createdAt: "2024-03-10T00:00:00Z",
  cardColor: "#23a559"
},
{
  id: "u2",
  username: "pixel_artist",
  displayName: "PixelArtist",
  avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=pixel&backgroundColor=eb459e",
  bio: "Digital artist & animator. Commissions open!",
  status: "idle",
  customStatus: "Drawing...",
  badges: [
  { id: "b1", name: "OctoPRO", icon: "Crown", color: "#f47fff" },
  { id: "b2", name: "Artist", icon: "Palette", color: "#eb459e" }],

  isOctoPro: true,
  ogrs: 8900,
  xp: 45000,
  level: 30,
  createdAt: "2024-02-20T00:00:00Z",
  cardColor: "#eb459e"
},
{
  id: "u3",
  username: "code_ninja",
  displayName: "CodeNinja",
  avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ninja&backgroundColor=fee75c",
  bio: "TypeScript enthusiast. Open source contributor.",
  status: "dnd",
  customStatus: "Deep focus mode",
  badges: [{ id: "b1", name: "Contributor", icon: "GitBranch", color: "#57f287" }],
  isOctoPro: false,
  ogrs: 1500,
  xp: 28000,
  level: 22,
  createdAt: "2024-04-05T00:00:00Z",
  cardColor: "#fee75c"
},
{
  id: "u4",
  username: "luna_gamer",
  displayName: "LunaGamer",
  avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=luna&backgroundColor=f47fff",
  bio: "Pro gamer & streamer. Valorant addict.",
  status: "online",
  badges: [
  { id: "b1", name: "OctoPRO", icon: "Crown", color: "#f47fff" },
  { id: "b2", name: "Streamer", icon: "Video", color: "#5865f2" }],

  isOctoPro: true,
  ogrs: 22000,
  xp: 67000,
  level: 38,
  createdAt: "2024-01-20T00:00:00Z",
  cardColor: "#f47fff"
},
{
  id: "u5",
  username: "dj_beats",
  displayName: "DJ Beats",
  avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=beats&backgroundColor=f0b232",
  bio: "Music producer & DJ. Drop your collabs!",
  status: "offline",
  badges: [],
  isOctoPro: false,
  ogrs: 500,
  xp: 5000,
  level: 8,
  createdAt: "2024-06-01T00:00:00Z",
  cardColor: "#f0b232"
},
{
  id: "u6",
  username: "neon_witch",
  displayName: "NeonWitch",
  avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=witch&backgroundColor=ed4245",
  bio: "Dark aesthetic. Witchcraft & tech.",
  status: "online",
  customStatus: "Brewing potions",
  badges: [{ id: "b1", name: "Early Adopter", icon: "Zap", color: "#fee75c" }],
  isOctoPro: false,
  ogrs: 2100,
  xp: 18000,
  level: 18,
  createdAt: "2024-03-25T00:00:00Z",
  cardColor: "#ed4245"
}];


export function getUserById(id) {
  if (id === "me") return currentUser;
  return mockUsers.find((u) => u.id === id);
}