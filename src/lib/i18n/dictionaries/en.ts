export const en = {
  nav: {
    home: "Home",
    bible: "Bible",
    groups: "Groups",
    prayer: "Prayer Wall",
    profile: "Profile",
    streaks: "Streak & Partner",
    church: "Church Account",
    churchAdmin: "Manage Church",
  },
  search: {
    title: "Search",
  },
  common: {
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    continue: "Continue",
    comingSoon: "Coming soon",
    logOut: "Log out",
    settings: "Settings",
  },
  home: {
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    dayStreak: "day streak",
    verseOfTheDay: "Today's Verse",
    continueReading: "Continue Reading",
    startReading: "Start Reading",
    browsePlans: "Browse Plans",
    startStreakTitle: "Start your streak today",
    startStreakBody: "Choose a reading plan to begin your first day in the Word.",
    partnerNudgeSuffix: "day streak — nudge them!",
    chaptersOf: "of {total} chapters read",
    minRead: "~{min} min read",
  },
};

type DeepStringify<T> = T extends string ? string : { [K in keyof T]: DeepStringify<T[K]> };

export type Dictionary = DeepStringify<typeof en>;
