

export const mockShopItems = [
{
  id: "si1",
  name: "Neon Glow Frame",
  description: "A glowing neon avatar decoration that pulses with energy",
  category: "avatar_decoration",
  price: 500,
  icon: "Sparkles",
  rarity: "rare",
  limited: false
},
{
  id: "si2",
  name: "Cyberpunk Banner",
  description: "A futuristic cyberpunk-themed profile banner",
  category: "banner",
  price: 800,
  icon: "Image",
  rarity: "epic",
  limited: false
},
{
  id: "si3",
  name: "Galaxy Particles",
  description: "Mesmerizing galaxy particle effect for your profile",
  category: "profile_effect",
  price: 1200,
  icon: "Stars",
  rarity: "legendary",
  limited: true
},
{
  id: "si4",
  name: "Fire Nameplate",
  description: "Your name engulfed in flames",
  category: "nameplate",
  price: 300,
  icon: "Flame",
  rarity: "common",
  limited: false
},
{
  id: "si5",
  name: "Diamond Badge",
  description: "A prestigious diamond-encrusted badge",
  category: "badge",
  price: 2000,
  icon: "Diamond",
  rarity: "legendary",
  limited: true
},
{
  id: "si6",
  name: "Midnight Theme",
  description: "An ultra-dark theme with blue accents",
  category: "theme",
  price: 400,
  icon: "Moon",
  rarity: "common",
  limited: false
},
{
  id: "si7",
  name: "Cherry Blossom Effect",
  description: "Sakura petals fall across your profile",
  category: "profile_effect",
  price: 900,
  icon: "Flower",
  rarity: "epic",
  limited: true
},
{
  id: "si8",
  name: "Glitch Frame",
  description: "A digital glitch effect avatar decoration",
  category: "avatar_decoration",
  price: 650,
  icon: "Zap",
  rarity: "rare",
  limited: false
},
{
  id: "si9",
  name: "Ocean Wave Banner",
  description: "Animated ocean waves on your profile banner",
  category: "banner",
  price: 750,
  icon: "Waves",
  rarity: "rare",
  limited: false
},
{
  id: "si10",
  name: "Crown Nameplate",
  description: "A royal nameplate fit for a king",
  category: "nameplate",
  price: 1500,
  icon: "Crown",
  rarity: "epic",
  limited: false
}];


export const mockInventory = [
{ itemId: "si1", equipped: true, acquiredAt: "2025-01-15T00:00:00Z" },
{ itemId: "si4", equipped: false, acquiredAt: "2025-01-20T00:00:00Z" },
{ itemId: "si6", equipped: true, acquiredAt: "2025-02-01T00:00:00Z" }];


export const mockGiftHistory = [
{
  id: "gift1",
  fromUserId: "me",
  toUserId: "u2",
  itemId: "si4",
  message: "Enjoy the fire!",
  createdAt: "2025-02-10T12:00:00Z"
},
{
  id: "gift2",
  fromUserId: "u4",
  toUserId: "me",
  itemId: "si1",
  message: "Thanks for the carry!",
  createdAt: "2025-01-15T20:00:00Z"
}];


export function getShopItemById(id) {
  return mockShopItems.find((i) => i.id === id);
}

export const rarityColors = {
  common: "#949ba4",
  rare: "#5865f2",
  epic: "#eb459e",
  legendary: "#fee75c"
};