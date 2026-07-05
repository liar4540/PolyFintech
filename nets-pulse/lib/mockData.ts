// ============================================================
// NETS PULSE — MOCK DATA  (edit before your presentation!)
// ============================================================

export const USER = {
  name: "Alex Chen",
  avatar: "AC",
  equippedTitle: "CHAGEE ADDICT",
  streakDays: 7,
  balance: 8420,
  income: 3200,
  spent: 1080,
  saved: 640,
};

export const TITLES = [
  { id: "chagee",   label: "CHAGEE ADDICT",    icon: "⚡", unlocked: true  },
  { id: "commuter", label: "COMMUTER HERO",      icon: "🚇", unlocked: true  },
  { id: "cafe",     label: "CAFÉ HOPPER",        icon: "☕", unlocked: true  },
  { id: "globe",    label: "GLOBE TROTTER",      icon: "🌏", unlocked: false },
  { id: "gem",      label: "HIDDEN GEM HUNTER",  icon: "💎", unlocked: false },
];

export const WEEKLY_SPENDING = [
  { day: "Tue", amount: 45 },
  { day: "Wed", amount: 80 },
  { day: "Thu", amount: 60 },
  { day: "Fri", amount: 130 },
  { day: "Sat", amount: 110 },
  { day: "Sun", amount: 75 },
];

export const RECENT_TRANSACTIONS = [
  { id: 1, icon: "🎵", name: "Spotify Premium", sub: "Monthly sub",  amount: -9.99,  color: "#1DB954" },
  { id: 2, icon: "🍱", name: "GrabFood",         sub: "Lunch order", amount: -18.50, color: "#00B14F" },
  { id: 3, icon: "👗", name: "Uniqlo",            sub: "Summer haul", amount: -67.90, color: "#E50000" },
  { id: 4, icon: "☕", name: "Flash Coffee",      sub: "Iced latte",  amount: -6.50,  color: "#F5A623" },
];

export const SPENDING_BREAKDOWN = [
  { label: "Food",      amount: 380, color: "#F5A623" },
  { label: "Shopping",  amount: 240, color: "#E4002B" },
  { label: "Transport", amount: 120, color: "#3B82F6" },
  { label: "Coffee",    amount: 95,  color: "#F59E0B" },
  { label: "Music",     amount: 60,  color: "#10B981" },
  { label: "Gaming",    amount: 45,  color: "#EF4444" },
];

export const ALL_TRANSACTIONS = [
  { id: 1, date: "TODAY",      icon: "🍱", name: "Grab Food",    sub: "Lunch order",    amount: -18.50 },
  { id: 2, date: "TODAY",      icon: "🎵", name: "Spotify",      sub: "Monthly sub",    amount: -9.99  },
  { id: 3, date: "YESTERDAY",  icon: "👗", name: "Uniqlo",       sub: "Summer haul",    amount: -67.90 },
  { id: 4, date: "YESTERDAY",  icon: "☕", name: "Flash Coffee", sub: "Iced latte",     amount: -6.50  },
  { id: 5, date: "YESTERDAY",  icon: "🚇", name: "MRT / Bus",    sub: "EZ-Link top up", amount: -20.00 },
  { id: 6, date: "MON 30 JUN", icon: "🧋", name: "Chagee",       sub: "Brown sugar latte", amount: -6.00 },
  { id: 7, date: "MON 30 JUN", icon: "🍜", name: "Jeh O Chula",  sub: "Dinner",         amount: -28.00 },
];

export const MERCHANTS = [
  {
    id: "chagee-siam",
    name: "Chagee Siam Square",
    category: "Bubble Tea",
    lat: 200, lng: 180,
    glow: "#E4002B",
    pulse: "48 Singaporean travelers scanned NETS QR here in the last 3 hours.",
    successRate: 99,
    score: { student: 82, hiddenGem: 45, peak: "2–4 PM" },
  },
  {
    id: "jeh-o-chula",
    name: "Jeh O Chula",
    category: "Thai Street Food",
    lat: 100, lng: 250,
    glow: "#10B981",
    pulse: "12 SG travelers paid here in the last hour.",
    successRate: 97,
    score: { student: 65, hiddenGem: 88, peak: "6–8 PM" },
  },
  {
    id: "after-you",
    name: "After You Dessert Café",
    category: "Desserts",
    lat: 300, lng: 130,
    glow: "#F59E0B",
    pulse: "21 SG travelers scanned NETS QR in the last 2 hours.",
    successRate: 95,
    score: { student: 70, hiddenGem: 60, peak: "3–5 PM" },
  },
];

export const AI_ITINERARY = [
  { step: 1, time: "10:00 AM", place: "Chagee Siam Square",    action: "Morning milk tea (budget ~$5)",                  icon: "🧋" },
  { step: 2, time: "11:30 AM", place: "MBK Center",             action: "Shop local fashion & souvenirs (~$30)",          icon: "🛍️" },
  { step: 3, time: "1:30 PM",  place: "Jeh O Chula",            action: "Famous Michelin-starred boat noodles (~$8)",     icon: "🍜" },
  { step: 4, time: "3:00 PM",  place: "Lumpini Park",           action: "Free chill + content creation",                 icon: "🌿" },
  { step: 5, time: "6:00 PM",  place: "After You Dessert Café", action: "Shibuya honey toast (~$12)",                    icon: "🍞" },
];

export const AI_ITINERARY_MERCHANTS = [
  { id: 1, icon: "☕", name: "Chagee Siam Square",    category: "Drinks",    rating: 4.9, priceBaht: 85,  checked: false },
  { id: 2, icon: "🌟", name: "Mango Tango",           category: "Dessert",   rating: 4.7, priceBaht: 120, checked: false },
  { id: 3, icon: "🍽️", name: "Siam Paragon Food Court", category: "Thai Food",rating: 4.5, priceBaht: 200, checked: false },
  { id: 4, icon: "🛍️", name: "Naraya Boutique",       category: "Shopping",  rating: 4.8, priceBaht: 350, checked: false },
  { id: 5, icon: "🍰", name: "After You Dessert Café",category: "Dessert",   rating: 4.6, priceBaht: 150, checked: false },
  { id: 6, icon: "🍽️", name: "CentralWorld B1 Food",  category: "Mixed",     rating: 4.4, priceBaht: 180, checked: false },
];

export const SPLIT_GROUP = [
  { id: 1, name: "Kai",  avatar: "K",  color: "#003DA5", owes: 15.00, settled: false, method: null as string | null, settledAt: null as string | null, note: undefined as string | undefined },
  { id: 2, name: "Ryan", avatar: "R",  color: "#E4002B", owes: 12.50, settled: false, method: null as string | null, settledAt: null as string | null, note: undefined as string | undefined },
  { id: 3, name: "Mia",  avatar: "M",  color: "#10B981", owes: 10.00, settled: true,  method: "PayNow" as string | null,   settledAt: "8:51 PM" as string | null, note: undefined as string | undefined },
  { id: 4, name: "Jess", avatar: "J",  color: "#F59E0B", owes: 8.00,  settled: true,  method: "Cash" as string | null,     settledAt: "9:04 PM" as string | null, note: "Paid at the restaurant!" as string | undefined },
];

export const GOALS = [
  {
    id: "japan",
    icon: "✈️",
    name: "Japan Trip",
    due: "Aug 2026",
    saved: 2100,
    target: 3500,
    streak: 12,
    color: "#E4002B",
  },
  {
    id: "macbook",
    icon: "💻",
    name: "MacBook Pro",
    due: "Dec 2026",
    saved: 840,
    target: 2800,
    streak: 5,
    color: "#10B981",
  },
];

export const BADGES = [
  { id: 1, icon: "🔥", label: "7-Day Streak",       unlocked: true  },
  { id: 2, icon: "🌏", label: "First Overseas Pay",  unlocked: true  },
  { id: 3, icon: "💎", label: "Hidden Gem Finder",   unlocked: true  },
  { id: 4, icon: "🧋", label: "Chagee Addict",       unlocked: true  },
  { id: 5, icon: "🚇", label: "Commuter Hero",        unlocked: true  },
  { id: 6, icon: "🎯", label: "14-Day Streak",       unlocked: false },
  { id: 7, icon: "🏆", label: "Top Spender",         unlocked: false },
  { id: 8, icon: "🌟", label: "Globe Trotter",       unlocked: false },
];

export const VOUCHERS = [
  { id: 1, merchant: "Chagee",       discount: "$1.00 off",    daysNeeded: 0,  unlocked: true  },
  { id: 2, merchant: "Flash Coffee", discount: "$2.00 off",    daysNeeded: 0,  unlocked: true  },
  { id: 3, merchant: "GrabFood",     discount: "5% off order", daysNeeded: 10, unlocked: false },
  { id: 4, merchant: "Uniqlo",       discount: "$5.00 off",    daysNeeded: 14, unlocked: false },
];

export const TIME_CAPSULE = {
  title: "Bangkok Graduation Trip 2026",
  emoji: "🗺️",
  date: "22–26 Jun 2026",
  totalSpent: 312.50,
  currency: "SGD",
  topMerchant: "Chagee Siam Square",
  visits: 6,
  countries: ["🇸🇬 Singapore", "🇹🇭 Thailand"],
  transactions: [
    { icon: "🧋", name: "Chagee Siam Square",     amount: -6.50,  date: "22 Jun" },
    { icon: "🍜", name: "Jeh O Chula",             amount: -28.00, date: "23 Jun" },
    { icon: "🛍️", name: "MBK Center",              amount: -85.00, date: "23 Jun" },
    { icon: "🍞", name: "After You Café",           amount: -12.00, date: "24 Jun" },
    { icon: "🎡", name: "Asiatique The Riverfront", amount: -22.00, date: "25 Jun" },
  ],
};

export const WRAPPED_STATS = {
  year: 2026,
  topMerchant: "Chagee",
  topMerchantVisits: 23,
  topCategory: "Food",
  topCategorySpend: 380,
  totalTransactions: 187,
  countriesVisited: 4,
  overseasTrips: 3,
  totalSaved: 1280,
  peakDay: "Saturday",
  funFact: "You spent more on bubble tea than Netflix. Respect. 🧋",
};
