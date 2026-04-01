

export const mockMissions = [
{
  id: "md1",
  title: "Daily Chatter",
  description: "Send 10 messages in any chat",
  type: "daily",
  goal: 10,
  rewards: [{ type: "ogrs", amount: 50 }],
  icon: "MessageSquare",
  active: true
},
{
  id: "md2",
  title: "Social Butterfly",
  description: "React to 5 messages",
  type: "daily",
  goal: 5,
  rewards: [{ type: "ogrs", amount: 30 }],
  icon: "Heart",
  active: true
},
{
  id: "md3",
  title: "Story Time",
  description: "Post a story today",
  type: "daily",
  goal: 1,
  rewards: [{ type: "ogrs", amount: 25 }],
  icon: "Camera",
  active: true
},
{
  id: "mw1",
  title: "Weekly Explorer",
  description: "Visit 5 different user profiles",
  type: "weekly",
  goal: 5,
  rewards: [{ type: "xp", amount: 500 }],
  icon: "Compass",
  active: true
},
{
  id: "mw2",
  title: "Gift Giver",
  description: "Send a gift to a friend",
  type: "weekly",
  goal: 1,
  rewards: [{ type: "badge", value: "generous" }],
  icon: "Gift",
  active: true
},
{
  id: "mw3",
  title: "File Sharer",
  description: "Upload 10 files this week",
  type: "weekly",
  goal: 10,
  rewards: [{ type: "ogrs", amount: 200 }],
  icon: "Upload",
  active: true
},
{
  id: "ms1",
  title: "Astro Veteran",
  description: "Complete 50 total missions",
  type: "special",
  goal: 50,
  rewards: [{ type: "badge", value: "mission_master" }],
  icon: "Trophy",
  active: true
},
{
  id: "ms2",
  title: "Streak Legend",
  description: "Maintain a 30-day login streak",
  type: "special",
  goal: 30,
  rewards: [{ type: "item", value: "legendary_frame" }],
  icon: "Flame",
  active: true
}];


export const mockMissionProgress = [
{ missionId: "md1", progress: 7, completed: false, claimed: false },
{ missionId: "md2", progress: 5, completed: true, claimed: false },
{ missionId: "md3", progress: 0, completed: false, claimed: false },
{ missionId: "mw1", progress: 3, completed: false, claimed: false },
{ missionId: "mw2", progress: 0, completed: false, claimed: false },
{ missionId: "mw3", progress: 6, completed: false, claimed: false },
{ missionId: "ms1", progress: 34, completed: false, claimed: false },
{ missionId: "ms2", progress: 12, completed: false, claimed: false }];


export const mockStreak = {
  current: 12,
  lastDaily: "2025-02-21T00:00:00Z",
  totalCompleted: 34
};