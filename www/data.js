// Catalog data for Damodara Ratna Mandir (sample catalog — edit freely)

const PLANETS = {
  Sun:     { emoji: "☀️", color: "#e8912d", trait: "confidence, leadership and vitality" },
  Moon:    { emoji: "🌙", color: "#9bb4d6", trait: "emotional calm and intuition" },
  Mars:    { emoji: "🔥", color: "#c0392b", trait: "courage, energy and drive" },
  Mercury: { emoji: "🌿", color: "#3f9d6b", trait: "intellect, speech and business sense" },
  Jupiter: { emoji: "🪔", color: "#d9a520", trait: "wisdom, luck and growth" },
  Venus:   { emoji: "💎", color: "#c46fa8", trait: "love, beauty and harmony" },
  Saturn:  { emoji: "⚓", color: "#5b6c8f", trait: "discipline, stability and protection" },
  Rahu:    { emoji: "🌀", color: "#6d4c8c", trait: "ambition and breaking obstacles" },
  Ketu:    { emoji: "🧿", color: "#8a6d4b", trait: "focus, detachment and spiritual insight" },
};

// One bracelet per planet, plus two temple specials (Damodara = Krishna, bound with love)
const BRACELETS = {
  Sun:     { name: "Garnet & Sunstone Bracelet",   stone: "Garnet / Sunstone", price: 1499 },
  Moon:    { name: "Moonstone & Pearl Bracelet",   stone: "Moonstone / Pearl", price: 1799 },
  Mars:    { name: "Red Coral Bracelet",           stone: "Red Coral (Moonga)", price: 1699 },
  Mercury: { name: "Green Aventurine Bracelet",    stone: "Aventurine / Emerald-tone", price: 1399 },
  Jupiter: { name: "Citrine Prosperity Bracelet",  stone: "Citrine / Yellow Topaz", price: 1599 },
  Venus:   { name: "Opal & Clear Quartz Bracelet", stone: "Opal / Clear Quartz", price: 1499 },
  Saturn:  { name: "Lapis & Black Tourmaline Bracelet", stone: "Lapis Lazuli / Tourmaline", price: 1599 },
  Rahu:    { name: "Hessonite (Gomed) Bracelet",   stone: "Hessonite Garnet", price: 1699 },
  Ketu:    { name: "Cat's Eye & Tiger Eye Bracelet", stone: "Cat's Eye / Tiger Eye", price: 1599 },
};

const SPECIAL_BRACELETS = [
  { key: "Rudraksha", emoji: "📿", name: "5-Mukhi Rudraksha Bracelet", stone: "Rudraksha", price: 999,
    why: "A universal, balancing bracelet that calms the mind and suits every birth chart." },
  { key: "Tulsi", emoji: "🌱", name: "Damodara Tulsi Bracelet", stone: "Tulsi wood", price: 799,
    why: "Sacred Tulsi beads of Lord Damodara — protective, devotional and grounding." },
];

// Vastu tag lists
const PROBLEM_TAGS = [
  { id: "money-loss",     label: "Money loss / debt",      emoji: "💸" },
  { id: "health-issues",  label: "Health issues",          emoji: "🩺" },
  { id: "family-conflict",label: "Family conflict",        emoji: "⚡" },
  { id: "poor-sleep",     label: "Poor sleep",             emoji: "😴" },
  { id: "career-block",   label: "Career blocks",          emoji: "🚧" },
  { id: "negative-energy",label: "Negative energy",        emoji: "🌑" },
  { id: "anxiety",        label: "Fear / anxiety",         emoji: "😰" },
  { id: "study-distract", label: "Poor focus / studies",   emoji: "📚" },
];

const ENHANCE_TAGS = [
  { id: "wealth",    label: "Wealth & abundance", emoji: "🪙" },
  { id: "love",      label: "Love & harmony",     emoji: "💗" },
  { id: "peace",     label: "Peace & calm",       emoji: "🕊️" },
  { id: "success",   label: "Career success",     emoji: "🏆" },
  { id: "wellbeing", label: "Health & vitality",  emoji: "🌸" },
  { id: "focus",     label: "Focus & learning",   emoji: "🎯" },
  { id: "protection",label: "Protection",         emoji: "🛡️" },
  { id: "positivity",label: "Positive energy",    emoji: "✨" },
];

const ROOMS = ["Any / whole home", "Main entrance", "Living room", "Bedroom", "Kitchen", "Puja room", "Office / shop", "Study room"];

// Vastu products: tags match problem + enhance ids above
const VASTU_PRODUCTS = [
  { id: 1, emoji: "🔺", name: "9-Layer Vastu Pyramid", price: 899,
    tags: ["negative-energy", "positivity", "health-issues", "wellbeing", "family-conflict"], rooms: ["Any / whole home", "Living room", "Office / shop"],
    place: "Centre of the home (Brahmasthan) or on your work desk." },
  { id: 2, emoji: "🧂", name: "Rock Salt Bowl Set (Set of 3)", price: 349,
    tags: ["negative-energy", "anxiety", "family-conflict", "protection", "peace"], rooms: ["Any / whole home", "Bedroom", "Kitchen"],
    place: "Corners of rooms; replace every full moon." },
  { id: 3, emoji: "🐢", name: "Brass Kachua (Tortoise) with Plate", price: 749,
    tags: ["career-block", "success", "wealth", "money-loss", "wellbeing"], rooms: ["Office / shop", "Living room", "Study room"],
    place: "North direction, head facing inside." },
  { id: 4, emoji: "🔶", name: "Shree Yantra (Copper, 6\")", price: 1299,
    tags: ["wealth", "money-loss", "success", "positivity", "peace"], rooms: ["Puja room", "Office / shop", "Living room"],
    place: "North-east or puja shelf, on a clean cloth." },
  { id: 5, emoji: "🪙", name: "Kuber Yantra with Lakshmi Coins", price: 649,
    tags: ["money-loss", "wealth", "career-block", "success"], rooms: ["Office / shop", "Main entrance", "Living room"],
    place: "North wall or inside the cash box / locker." },
  { id: 6, emoji: "🎐", name: "6-Rod Metal Wind Chime", price: 599,
    tags: ["negative-energy", "positivity", "family-conflict", "love", "peace"], rooms: ["Main entrance", "Living room", "Any / whole home"],
    place: "North-west or entrance, away from the bedroom door." },
  { id: 7, emoji: "💗", name: "Rose Quartz Heart Pair", price: 549,
    tags: ["love", "family-conflict", "peace", "anxiety"], rooms: ["Bedroom", "Living room"],
    place: "South-west of the bedroom, in a pair." },
  { id: 8, emoji: "💜", name: "Amethyst Cluster", price: 999,
    tags: ["poor-sleep", "peace", "anxiety", "negative-energy", "health-issues"], rooms: ["Bedroom", "Puja room", "Study room"],
    place: "Bedside table, away from electronics." },
  { id: 9, emoji: "🌳", name: "Citrine Money Tree", price: 1199,
    tags: ["wealth", "money-loss", "success", "positivity"], rooms: ["Office / shop", "Living room", "Any / whole home"],
    place: "South-east or north of the living room." },
  { id: 10, emoji: "🧿", name: "Nazar Battu Evil Eye Hanging", price: 299,
    tags: ["protection", "negative-energy", "anxiety", "career-block"], rooms: ["Main entrance", "Office / shop", "Any / whole home"],
    place: "Above the main door, outside-facing." },
  { id: 11, emoji: "🪔", name: "Brass Kamakshi Diya Set (with wicks)", price: 699,
    tags: ["positivity", "peace", "negative-energy", "health-issues", "wellbeing"], rooms: ["Puja room", "Main entrance", "Kitchen"],
    place: "North-east, lit at dawn and dusk." },
  { id: 12, emoji: "🧘", name: "Himalayan Salt Lamp", price: 899,
    tags: ["poor-sleep", "peace", "wellbeing", "health-issues", "anxiety"], rooms: ["Bedroom", "Living room", "Study room"],
    place: "Bedroom or living area, away from moisture." },
  { id: 13, emoji: "🛕", name: "Vastu Dosh Nivaran Yantra", price: 849,
    tags: ["negative-energy", "family-conflict", "health-issues", "money-loss", "protection"], rooms: ["Main entrance", "Any / whole home", "Puja room"],
    place: "Above the main entrance, inside." },
  { id: 14, emoji: "🦚", name: "Saraswati Yantra & Peacock Feather Set", price: 549,
    tags: ["study-distract", "focus", "success", "peace"], rooms: ["Study room", "Office / shop"],
    place: "North-east of the study table." },
  { id: 15, emoji: "🔮", name: "Clear Quartz Sphere", price: 799,
    tags: ["focus", "study-distract", "positivity", "negative-energy", "wellbeing"], rooms: ["Study room", "Office / shop", "Living room"],
    place: "East side of the desk, in sunlight." },
  { id: 16, emoji: "🌿", name: "Tulsi Planter (Brass Pot)", price: 449,
    tags: ["wellbeing", "health-issues", "peace", "protection", "positivity"], rooms: ["Main entrance", "Any / whole home", "Puja room"],
    place: "East or north-east courtyard / balcony." },
  { id: 17, emoji: "🌊", name: "Crystal Flowing Water Fountain", price: 2499,
    tags: ["wealth", "success", "career-block", "money-loss", "peace"], rooms: ["Living room", "Office / shop", "Main entrance"],
    place: "North-east or north; water flowing inward." },
  { id: 18, emoji: "🐘", name: "Pair of Brass Elephants", price: 999,
    tags: ["protection", "success", "family-conflict", "wealth", "love"], rooms: ["Main entrance", "Living room"],
    place: "Either side of the entrance, trunks up." },
  { id: 19, emoji: "🕉️", name: "Swastik & Om Door Toran Set", price: 399,
    tags: ["positivity", "protection", "negative-energy", "wealth", "peace"], rooms: ["Main entrance"],
    place: "Hung on the main door." },
  { id: 20, emoji: "💫", name: "Camphor & Loban Dhoop Cleansing Kit", price: 249,
    tags: ["negative-energy", "anxiety", "poor-sleep", "positivity", "health-issues"], rooms: ["Any / whole home", "Bedroom", "Kitchen", "Puja room"],
    place: "Burn every evening, ending at the entrance." },
];
