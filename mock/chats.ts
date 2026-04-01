

export const mockChats = [
{
  id: "c1",
  type: "dm",
  participants: ["me", "u1"],
  unreadCount: 3,
  pinned: true,
  createdAt: "2024-06-01T00:00:00Z"
},
{
  id: "c2",
  type: "dm",
  participants: ["me", "u2"],
  unreadCount: 0,
  pinned: false,
  createdAt: "2024-06-10T00:00:00Z"
},
{
  id: "c3",
  type: "dm",
  participants: ["me", "u4"],
  unreadCount: 1,
  pinned: true,
  createdAt: "2024-05-20T00:00:00Z"
},
{
  id: "c4",
  type: "dm",
  participants: ["me", "u3"],
  unreadCount: 0,
  pinned: false,
  createdAt: "2024-07-01T00:00:00Z"
},
{
  id: "c5",
  type: "dm",
  participants: ["me", "u6"],
  unreadCount: 5,
  pinned: false,
  createdAt: "2024-07-10T00:00:00Z"
},
{
  id: "g1",
  type: "group",
  participants: ["me", "u1", "u2", "u4"],
  name: "Dev Squad",
  icon: "https://api.dicebear.com/9.x/identicon/svg?seed=devsquad",
  unreadCount: 12,
  pinned: true,
  createdAt: "2024-04-01T00:00:00Z"
},
{
  id: "g2",
  type: "group",
  participants: ["me", "u3", "u5", "u6"],
  name: "Music & Code",
  icon: "https://api.dicebear.com/9.x/identicon/svg?seed=musiccode",
  unreadCount: 0,
  pinned: false,
  createdAt: "2024-05-15T00:00:00Z"
}];


export const mockMessages = {
  c1: [
  {
    id: "m1",
    chatId: "c1",
    senderId: "u1",
    content: "Hey! Did you see the new CTF challenge?",
    type: "text",
    attachments: [],
    reactions: [{ emoji: "fire", count: 1, userIds: ["me"] }],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T10:00:00Z"
  },
  {
    id: "m2",
    chatId: "c1",
    senderId: "me",
    content: "Yeah! I was looking at it last night. The crypto one looks insane.",
    type: "text",
    attachments: [],
    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T10:02:00Z"
  },
  {
    id: "m3",
    chatId: "c1",
    senderId: "u1",
    content: "Let's team up on it. I already got the first flag.",
    type: "text",
    attachments: [],
    reactions: [{ emoji: "thumbsup", count: 1, userIds: ["me"] }],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T10:05:00Z"
  },
  {
    id: "m4",
    chatId: "c1",
    senderId: "me",
    content: "Nice! I'll start on the web exploitation part.",
    type: "text",
    attachments: [],
    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T10:06:00Z"
  },
  {
    id: "m5",
    chatId: "c1",
    senderId: "u1",
    content: "Check this out, found a vulnerability!",
    type: "image",
    attachments: [
    {
      id: "a1",
      name: "screenshot.png",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      type: "image/png",
      size: 245000
    }],

    reactions: [
    { emoji: "eyes", count: 1, userIds: ["me"] },
    { emoji: "fire", count: 1, userIds: ["me"] }],

    edited: false,
    deleted: false,
    createdAt: "2025-02-20T10:10:00Z"
  },
  {
    id: "m6",
    chatId: "c1",
    senderId: "me",
    content: "Whoa that's a critical one. Great find!",
    type: "text",
    attachments: [],
    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T10:12:00Z"
  },
  {
    id: "m7",
    chatId: "c1",
    senderId: "u1",
    content: "Here's the exploit script",
    type: "file",
    attachments: [
    {
      id: "a2",
      name: "exploit.py",
      url: "#",
      type: "text/x-python",
      size: 12400
    }],

    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T10:15:00Z"
  }],

  c2: [
  {
    id: "m10",
    chatId: "c2",
    senderId: "u2",
    content: "Just finished a new illustration! Want to see?",
    type: "text",
    attachments: [],
    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-19T15:00:00Z"
  },
  {
    id: "m11",
    chatId: "c2",
    senderId: "me",
    content: "Absolutely! Send it over.",
    type: "text",
    attachments: [],
    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-19T15:01:00Z"
  },
  {
    id: "m12",
    chatId: "c2",
    senderId: "u2",
    content: "Here it is! What do you think?",
    type: "image",
    attachments: [
    {
      id: "a3",
      name: "new_art.png",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
      type: "image/png",
      size: 540000
    }],

    reactions: [{ emoji: "heart", count: 1, userIds: ["me"] }],
    edited: false,
    deleted: false,
    createdAt: "2025-02-19T15:03:00Z"
  },
  {
    id: "m13",
    chatId: "c2",
    senderId: "me",
    content: "That's incredible! The colors are so vibrant. Would you do a commission for Astro's new UI?",
    type: "text",
    attachments: [],
    reactions: [{ emoji: "sparkles", count: 1, userIds: ["u2"] }],
    edited: false,
    deleted: false,
    createdAt: "2025-02-19T15:05:00Z"
  }],

  c3: [
  {
    id: "m20",
    chatId: "c3",
    senderId: "u4",
    content: "GG on that last match! You carried hard.",
    type: "text",
    attachments: [],
    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T20:00:00Z"
  },
  {
    id: "m21",
    chatId: "c3",
    senderId: "me",
    content: "Thanks! That ace on Haven was lucky though lol",
    type: "text",
    attachments: [],
    reactions: [{ emoji: "skull", count: 1, userIds: ["u4"] }],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T20:01:00Z"
  },
  {
    id: "m22",
    chatId: "c3",
    senderId: "u4",
    content: "Lucky? You hit every headshot. Stream tomorrow?",
    type: "text",
    attachments: [],
    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T20:03:00Z"
  }],

  c4: [],
  c5: [
  {
    id: "m30",
    chatId: "c5",
    senderId: "u6",
    content: "I put a hex on your code. It will compile on the first try now.",
    type: "text",
    attachments: [],
    reactions: [{ emoji: "heart", count: 1, userIds: ["me"] }],
    edited: false,
    deleted: false,
    createdAt: "2025-02-21T08:00:00Z"
  }],

  g1: [
  {
    id: "mg1",
    chatId: "g1",
    senderId: "u1",
    content: "Team standup! What's everyone working on?",
    type: "text",
    attachments: [],
    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-21T09:00:00Z"
  },
  {
    id: "mg2",
    chatId: "g1",
    senderId: "u2",
    content: "Finishing the new profile card designs.",
    type: "text",
    attachments: [],
    reactions: [{ emoji: "thumbsup", count: 2, userIds: ["me", "u1"] }],
    edited: false,
    deleted: false,
    createdAt: "2025-02-21T09:01:00Z"
  },
  {
    id: "mg3",
    chatId: "g1",
    senderId: "me",
    content: "Working on the chat system. Almost done with file uploads!",
    type: "text",
    attachments: [],
    reactions: [{ emoji: "fire", count: 3, userIds: ["u1", "u2", "u4"] }],
    edited: false,
    deleted: false,
    createdAt: "2025-02-21T09:02:00Z"
  },
  {
    id: "mg4",
    chatId: "g1",
    senderId: "u4",
    content: "I'll test everything later tonight after my stream.",
    type: "text",
    attachments: [],
    reactions: [],
    edited: false,
    deleted: false,
    createdAt: "2025-02-21T09:03:00Z"
  }],

  g2: [
  {
    id: "mg10",
    chatId: "g2",
    senderId: "u5",
    content: "New beat dropping this weekend. Preview incoming!",
    type: "text",
    attachments: [],
    reactions: [{ emoji: "headphones", count: 2, userIds: ["me", "u3"] }],
    edited: false,
    deleted: false,
    createdAt: "2025-02-20T22:00:00Z"
  }]

};

export function getMessagesForChat(chatId) {
  return mockMessages[chatId] || [];
}

export function getChatById(id) {
  return mockChats.find((c) => c.id === id);
}