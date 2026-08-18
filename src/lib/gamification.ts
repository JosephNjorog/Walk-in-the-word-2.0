export interface TierDef {
  name: string;
  minXp: number;
}

export const TIERS: TierDef[] = [
  { name: "Seeker", minXp: 0 },
  { name: "Disciple", minXp: 500 },
  { name: "Teacher", minXp: 1500 },
  { name: "Elder", minXp: 3000 },
];

export function tierForXp(xp: number) {
  let index = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (xp >= TIERS[i].minXp) index = i;
  }
  const current = TIERS[index];
  const next = TIERS[index + 1];
  return {
    level: index + 1,
    name: current.name,
    nextLevelXp: next ? next.minXp : current.minXp,
  };
}

export interface BadgeDef {
  type: string;
  name: string;
  letter: string;
}

export const BADGES: BadgeDef[] = [
  { type: "first_chapter", name: "First Chapter", letter: "1" },
  { type: "week_streak", name: "7 Day Streak", letter: "7" },
  { type: "month_streak", name: "30 Day Streak", letter: "30" },
  { type: "genesis_complete", name: "Genesis Complete", letter: "G" },
  { type: "century", name: "100 Chapters", letter: "C" },
  { type: "first_verse", name: "Verse Master", letter: "V" },
  { type: "journaler", name: "Journaler", letter: "J" },
  { type: "community", name: "Community Member", letter: "M" },
];
