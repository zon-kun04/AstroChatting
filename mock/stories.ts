

export const mockStories = [
{
  id: "s1",
  userId: "u1",
  mediaType: "image",
  content: "Just pwned the CTF!",
  mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=700&fit=crop",
  views: ["me", "u2"],
  reactions: [{ userId: "me", emoji: "fire" }],
  createdAt: "2025-02-21T08:00:00Z",
  expiresAt: "2025-02-22T08:00:00Z"
},
{
  id: "s2",
  userId: "u2",
  mediaType: "image",
  content: "New art piece WIP",
  mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=700&fit=crop",
  views: ["u1"],
  reactions: [{ userId: "u1", emoji: "heart" }],
  createdAt: "2025-02-21T10:00:00Z",
  expiresAt: "2025-02-22T10:00:00Z"
},
{
  id: "s3",
  userId: "u4",
  mediaType: "text",
  content: "Stream starts in 1 hour! Come hang out with me on Valorant ranked! Let's hit Immortal together.",
  backgroundColor: "#5865f2",
  views: [],
  reactions: [],
  createdAt: "2025-02-21T18:00:00Z",
  expiresAt: "2025-02-22T18:00:00Z"
},
{
  id: "s4",
  userId: "u6",
  mediaType: "image",
  content: "Midnight coding vibes",
  mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=700&fit=crop",
  views: ["me"],
  reactions: [{ userId: "me", emoji: "sparkles" }],
  createdAt: "2025-02-21T01:00:00Z",
  expiresAt: "2025-02-22T01:00:00Z"
},
{
  id: "s5",
  userId: "me",
  mediaType: "text",
  content: "Astro is coming together nicely! Building the future of messaging.",
  backgroundColor: "#23a559",
  views: ["u1", "u2", "u4", "u6"],
  reactions: [
  { userId: "u1", emoji: "fire" },
  { userId: "u2", emoji: "heart" },
  { userId: "u4", emoji: "thumbsup" }],

  createdAt: "2025-02-21T12:00:00Z",
  expiresAt: "2025-02-22T12:00:00Z"
}];


export function getStoriesByUser(userId) {
  return mockStories.filter((s) => s.userId === userId);
}

export function getStoriesFeed(currentUserId) {
  return mockStories.filter((s) => s.userId !== currentUserId);
}