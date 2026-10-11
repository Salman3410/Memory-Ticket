export const SUBSCRIPTION_PLANS = {
  FREE: "free",
  PREMIUM: "premium",
};

export const SUBSCRIPTION_PRICING = {
  monthly: {
    amount: 200,
    currency: "PKR",
    label: "PKR 200 / month",
  },
  annual: {
    amount: 1700,
    currency: "PKR",
    label: "PKR 1,700 / year",
    savings: 700,
  },
};

export const STORAGE_LIMITS = {
  freeBytes: 2 * 1024 * 1024 * 1024,
  premiumBytes: 25 * 1024 * 1024 * 1024,
};

export const PREMIUM_FEATURES = {
  PREMIUM_TICKETS: "premiumTickets",
  ADVANCED_TICKET_CUSTOMIZATION: "advancedTicketCustomization",
  RICH_MEMORY_EDITOR: "richMemoryEditor",
  VOICE_MEMORIES: "voiceMemories",
  AI_MEMORY_ASSISTANT: "aiMemoryAssistant",
  SMART_COLLECTIONS: "smartCollections",
  MEMORY_REPLAY: "memoryReplay",
  ADVANCED_PEOPLE_TAGS_MOOD: "advancedPeopleTagsMood",
  ADVANCED_EXPORT: "advancedExport",
  PREMIUM_WIDGET: "premiumWidget",
};

export const FREE_FEATURES = {
  CREATE_MEMORIES: "createMemories",
  BASIC_TICKETS: "basicTickets",
  COLLECTIONS: "collections",
  TIMELINE: "timeline",
  ON_THIS_DAY: "onThisDay",
  NOTIFICATIONS: "notifications",
  OFFLINE_SYNC: "offlineSync",
  APP_LOCK: "appLock",
  BASIC_WIDGET: "basicWidget",
  BASIC_EXPORT: "basicExport",
  CALENDAR: "calendar",
  BASIC_PEOPLE_TAGS_MOOD: "basicPeopleTagsMood",
};

export const PREMIUM_FEATURE_LIST = [
  {
    key: PREMIUM_FEATURES.PREMIUM_TICKETS,
    title: "Premium Tickets",
    description: "Unlock exclusive ticket designs and templates.",
    icon: "ticket-outline",
  },
  {
    key: PREMIUM_FEATURES.RICH_MEMORY_EDITOR,
    title: "Advanced Memory Editor",
    description: "Build richer memories with more content and layouts.",
    icon: "create-outline",
  },
  {
    key: PREMIUM_FEATURES.VOICE_MEMORIES,
    title: "Voice Memories",
    description: "Add voice recordings and transcriptions to memories.",
    icon: "mic-outline",
  },
  {
    key: PREMIUM_FEATURES.AI_MEMORY_ASSISTANT,
    title: "AI Memory Assistant",
    description: "Search, organize, and enhance memories with AI.",
    icon: "sparkles-outline",
  },
  {
    key: PREMIUM_FEATURES.SMART_COLLECTIONS,
    title: "Smart Collections",
    description: "Automatically group related memories.",
    icon: "albums-outline",
  },
  {
    key: PREMIUM_FEATURES.MEMORY_REPLAY,
    title: "Memory Replay",
    description: "Relive a month, year, or collection as a replay.",
    icon: "play-circle-outline",
  },
  {
    key: PREMIUM_FEATURES.ADVANCED_PEOPLE_TAGS_MOOD,
    title: "Advanced People, Tags & Mood",
    description: "Get smarter organization and filtering tools.",
    icon: "people-outline",
  },
  {
    key: PREMIUM_FEATURES.ADVANCED_EXPORT,
    title: "Advanced Export",
    description: "Export memories and collections with premium layouts.",
    icon: "download-outline",
  },
];
