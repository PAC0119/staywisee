export type Property = {
  slug: string;
  name: string;
  type: string;
  area: string;
  city: string;
  price: number;
  food: string;
  badge: string;
  distance: string;
  accent: string;
  tagline: string;
  description: string;
  amenities: string[];
  meals: { label: string; included: boolean; note?: string }[];
  distances: { place: string; km: number; auto: number; cab: number }[];
  safety: { label: string; score: number; note: string }[];
  cleanliness: { label: string; score: number; note: string }[];
  contact: {
    website?: string;
    whatsapp?: string;
    phone?: string;
    maps?: string;
    verifiedOn: string;
  };
  hostNote: string;
};

export const PROPERTIES: Property[] = [
  {
    slug: "sunder-niwas-homestay",
    name: "Sunder Niwas Homestay",
    type: "Homestay",
    area: "Bani Park",
    city: "Jaipur",
    price: 1850,
    food: "Home-cooked veg breakfast",
    badge: "Family-friendly",
    distance: "1.1 km from City Palace",
    accent: "var(--saffron)",
    tagline: "A 1940s haveli run by the Sharma family — quiet courtyard, slow mornings.",
    description:
      "A restored family haveli in leafy Bani Park, hosted by Mrs. Sharma and her son Aakash. Six rooms total, breakfast served on the rooftop, and easy walking access to Jaipur's old city. Best for parents, couples, and anyone who prefers a calmer base over a hotel lobby.",
    amenities: [
      "Rooftop breakfast",
      "AC rooms",
      "Hot water 24×7",
      "Free Wi-Fi",
      "Airport pickup",
      "Family of host on-site",
    ],
    meals: [
      { label: "Breakfast", included: true, note: "Poha, paratha, fruit, chai" },
      { label: "Lunch", included: false, note: "Veg thali on request · ₹220" },
      { label: "Dinner", included: false, note: "Home-cooked on request · ₹280" },
      { label: "Drinking water", included: true, note: "Filtered, unlimited" },
    ],
    distances: [
      { place: "City Palace", km: 1.1, auto: 110, cab: 190 },
      { place: "Hawa Mahal", km: 1.8, auto: 90, cab: 160 },
      { place: "Amber Fort", km: 9.4, auto: 220, cab: 380 },
      { place: "Jaipur Junction (Railway)", km: 2.6, auto: 70, cab: 140 },
      { place: "Bapu Bazar (food street)", km: 1.4, auto: 80, cab: 150 },
      { place: "SMS Hospital", km: 3.2, auto: 90, cab: 170 },
    ],
    safety: [
      { label: "Women-friendly area", score: 9.4, note: "Well-lit, residential, low traffic at night" },
      { label: "Verified host ID", score: 10, note: "Aadhaar + GST verified by StayWise" },
      { label: "On-site staff 24×7", score: 9.0, note: "Family lives in the same building" },
      { label: "CCTV at entrance", score: 8.6, note: "Common areas monitored" },
    ],
    cleanliness: [
      { label: "Bedding & linens", score: 9.5, note: "Changed every 2 days, fresh on arrival" },
      { label: "Bathroom hygiene", score: 9.2, note: "Twice-daily cleaning during stay" },
      { label: "Kitchen & food prep", score: 9.6, note: "FSSAI registered kitchen" },
      { label: "Common areas", score: 9.3, note: "Courtyard cleaned 3× daily" },
    ],
    contact: {
      website: "https://example.com/sunder-niwas",
      whatsapp: "+919812340001",
      phone: "+911412340001",
      maps: "https://maps.google.com/?q=Bani+Park+Jaipur",
      verifiedOn: "2 days ago",
    },
    hostNote: "We hold dinner till 10pm if your train is late. Just message — we'll wait with chai.",
  },
  {
    slug: "the-pink-door-hostel",
    name: "The Pink Door Hostel",
    type: "Hostel",
    area: "M.I. Road",
    city: "Jaipur",
    price: 650,
    food: "Cafe on site",
    badge: "Solo-friendly",
    distance: "400 m from food street",
    accent: "var(--teal)",
    tagline: "Bunk beds, big rooftop, even bigger crowd of solo backpackers.",
    description:
      "A bright pink-walled hostel in the middle of M.I. Road, with mixed and female-only dorms, a working cafe, and nightly walking tours of the old city. Best for solo travelers, friends on a budget, and anyone who wants people to eat dinner with.",
    amenities: [
      "Female-only dorm",
      "Lockers in every bunk",
      "Rooftop cafe",
      "Daily walking tours",
      "Laundry ₹60/kg",
      "Co-working desk",
    ],
    meals: [
      { label: "Breakfast", included: false, note: "Cafe menu · ₹80–180" },
      { label: "Lunch", included: false, note: "Cafe + nearby thali ₹140" },
      { label: "Dinner", included: false, note: "Cafe open till 11pm" },
      { label: "Drinking water", included: true, note: "RO refill station" },
    ],
    distances: [
      { place: "Hawa Mahal", km: 1.2, auto: 70, cab: 130 },
      { place: "City Palace", km: 1.6, auto: 90, cab: 160 },
      { place: "Bapu Bazar (food street)", km: 0.4, auto: 40, cab: 90 },
      { place: "Jaipur Junction (Railway)", km: 2.2, auto: 60, cab: 130 },
      { place: "Amber Fort", km: 10.1, auto: 240, cab: 410 },
      { place: "Sindhi Camp Bus Stand", km: 1.9, auto: 60, cab: 120 },
    ],
    safety: [
      { label: "Female-only dorm", score: 9.2, note: "Separate floor, keycard access" },
      { label: "24×7 reception", score: 9.5, note: "Staff always at front desk" },
      { label: "CCTV coverage", score: 8.8, note: "Hallways + entrance" },
      { label: "Verified guest ID required", score: 10, note: "Govt. ID at check-in" },
    ],
    cleanliness: [
      { label: "Dorm cleanliness", score: 8.7, note: "Cleaned daily 11am–1pm" },
      { label: "Shared bathrooms", score: 8.5, note: "3× daily cleaning rotation" },
      { label: "Bedding & linens", score: 8.9, note: "Fresh on arrival, weekly change" },
      { label: "Cafe / kitchen", score: 9.1, note: "FSSAI registered" },
    ],
    contact: {
      website: "https://example.com/pink-door",
      whatsapp: "+919812340002",
      phone: "+911412340002",
      maps: "https://maps.google.com/?q=MI+Road+Jaipur",
      verifiedOn: "5 days ago",
    },
    hostNote: "Free walking tour every evening at 5pm — just show up at reception.",
  },
  {
    slug: "hotel-amer-heritage",
    name: "Hotel Amer Heritage",
    type: "Hotel",
    area: "Civil Lines",
    city: "Jaipur",
    price: 2400,
    food: "Breakfast included",
    badge: "Parents-approved",
    distance: "Near Jaipur Junction",
    accent: "var(--coral)",
    tagline: "A reliable mid-range hotel near the railway station — lifts, room service, the usual comforts.",
    description:
      "A 42-room mid-range hotel a short walk from Jaipur Junction. AC, lift, in-room dining, on-site multi-cuisine restaurant, and proper hotel reception. Best for parents, families, and travelers who want zero surprises after a long train ride.",
    amenities: [
      "Lift access",
      "AC rooms",
      "In-room dining",
      "Buffet breakfast",
      "Airport transfer",
      "Doctor on call",
    ],
    meals: [
      { label: "Breakfast", included: true, note: "Buffet · veg + non-veg + south Indian" },
      { label: "Lunch", included: false, note: "A la carte · ₹250–450" },
      { label: "Dinner", included: false, note: "Restaurant + room service" },
      { label: "Drinking water", included: true, note: "Sealed bottles in room" },
    ],
    distances: [
      { place: "Jaipur Junction (Railway)", km: 0.6, auto: 40, cab: 90 },
      { place: "Hawa Mahal", km: 3.1, auto: 110, cab: 200 },
      { place: "City Palace", km: 3.4, auto: 120, cab: 210 },
      { place: "Amber Fort", km: 11.2, auto: 260, cab: 440 },
      { place: "SMS Hospital", km: 2.4, auto: 80, cab: 150 },
      { place: "Jaipur Airport", km: 13.6, auto: 320, cab: 520 },
    ],
    safety: [
      { label: "Reception 24×7", score: 9.4, note: "Front desk staffed all night" },
      { label: "CCTV coverage", score: 9.1, note: "Lobby, lifts, all corridors" },
      { label: "Family-friendly area", score: 9.2, note: "Civil Lines, well-policed" },
      { label: "Doctor on call", score: 9.0, note: "Tie-up with nearby clinic" },
    ],
    cleanliness: [
      { label: "Room housekeeping", score: 9.0, note: "Daily, plus turndown service" },
      { label: "Bathrooms", score: 9.2, note: "Sanitized after each guest" },
      { label: "Bedding & linens", score: 9.3, note: "Fresh daily on request" },
      { label: "Restaurant & kitchen", score: 9.4, note: "FSSAI + monthly audit" },
    ],
    contact: {
      website: "https://example.com/amer-heritage",
      whatsapp: "+919812340003",
      phone: "+911412340003",
      maps: "https://maps.google.com/?q=Civil+Lines+Jaipur",
      verifiedOn: "1 day ago",
    },
    hostNote: "Mention 'StayWise' at check-in for a free early check-in if your train arrives before 11am.",
  },
];

export const getProperty = (slug: string) => PROPERTIES.find((p) => p.slug === slug);
