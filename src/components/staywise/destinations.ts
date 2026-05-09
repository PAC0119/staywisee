// StayWise destination engine — supports India + International destinations.
// Each destination provides everything Results / Itinerary / Explorer need.

export type StayKind = "Hotel" | "Hostel" | "Homestay" | "Local stay" | "Dharamshala" | "Guest house" | "Serviced apt." | "Villa" | "Desert camp" | "Beach stay" | "Backpacker stay";

export type StaySuggestion = {
  slug?: string;       // only set when a full detail page exists (e.g. Jaipur seeds)
  name: string;
  type: StayKind;
  area: string;
  price: number;       // INR / night
  food: string;
  badge: string;
  distance: string;
  accent: string;      // CSS var
};

export type Attraction = {
  name: string;
  area: string;
  blurb: string;
  km: number;
  minutes: number;
  tags: string[];                 // matches purpose / food
  mode: "walk" | "drive";
};

export type FoodHighlight = { dish: string; where: string };
export type TravelEstimate = { to: string; auto: number; cab: number };

export type Destination = {
  id: string;
  name: string;
  region: string;
  country: string;
  group: "Rajasthan" | "Gujarat" | "India Popular" | "Vietnam" | "Bali" | "Singapore" | "International";
  types: string[]; // city, beach, hill station, spiritual, heritage, business, island, backpacking, luxury, family, food, wildlife
  emoji: string;
  tagline: string;
  popularAreas: string[];
  attractions: Attraction[];
  foodHighlights: FoodHighlight[];
  travel: TravelEstimate[];
  budget: {
    hotel: [number, number];
    hostel: [number, number];
    homestay: [number, number];
    dharam?: [number, number];
    apt: [number, number];
  };
  foodPerDay: [number, number];
  travelPerDay: [number, number];
  bestFor: string[];
  safetyNote: string;
  stays: StaySuggestion[];
};

const WARM = "var(--coral)";
const COOL = "var(--teal)";
const SUN  = "var(--saffron)";
const ROSE = "var(--pink)";

// ---------- Helpers to keep destination authoring terse ----------
const a = (name: string, area: string, blurb: string, km: number, minutes: number, tags: string[], mode: "walk" | "drive" = "drive"): Attraction =>
  ({ name, area, blurb, km, minutes, tags, mode });

const s = (
  name: string, type: StayKind, area: string, price: number,
  food: string, badge: string, distance: string, accent = WARM, slug?: string
): StaySuggestion => ({ name, type, area, price, food, badge, distance, accent, slug });

// ============ DESTINATIONS ============
export const DESTINATIONS: Destination[] = [
  // ---------------- RAJASTHAN ----------------
  {
    id: "jaipur", name: "Jaipur", region: "Rajasthan", country: "India",
    group: "Rajasthan", types: ["heritage", "city", "family", "food"], emoji: "🏰",
    tagline: "Pink City — havelis, bazaars, slow rooftop mornings",
    popularAreas: ["Bani Park", "C-Scheme", "Civil Lines", "M.I. Road", "Old City (Pink City)"],
    attractions: [
      a("Hawa Mahal", "Old City", "Iconic pink facade — best at sunrise", 1.8, 60, ["Sightseeing"], "walk"),
      a("City Palace", "Old City", "Royal courtyards & textile gallery", 1.6, 120, ["Sightseeing"], "walk"),
      a("Amber Fort", "Amer", "Hilltop fort + mirror palace", 10.1, 180, ["Sightseeing"]),
      a("Nahargarh Fort", "Aravalli ridge", "Sunset view over the city", 9.4, 120, ["Sightseeing"]),
      a("Birla Mandir", "Tilak Nagar", "Calm marble temple, evening aarti", 4.2, 45, ["Spiritual"]),
      a("Galtaji Monkey Temple", "Aravalli foothills", "Stepwell temple complex", 11.2, 90, ["Spiritual"]),
      a("Bapu Bazar", "Pink City", "Veg thalis, lassi, juttis, block prints", 1.4, 75, ["Vegetarian", "Local explorer"], "walk"),
      a("Masala Chowk", "Ram Niwas Garden", "Open-air food court — 20 famous stalls", 2.4, 75, ["Vegetarian", "Non-veg", "Local explorer"]),
      a("Tapri Central", "C-Scheme", "Rooftop chai cafe — slow morning", 3.1, 60, ["Vegan", "Vegetarian", "Food trip"]),
      a("Chokhi Dhani", "Tonk Road", "Rajasthani village experience", 14, 180, ["Family vacation", "Sightseeing"]),
    ],
    foodHighlights: [
      { dish: "Vegetarian thali", where: "M.I. Road · Bapu Bazar" },
      { dish: "Pyaaz kachori & lassi", where: "Johari Bazar" },
      { dish: "Rooftop breakfast", where: "C-Scheme · Civil Lines" },
      { dish: "Homemade Rajasthani", where: "Bani Park homestays" },
    ],
    travel: [
      { to: "Amber Fort", auto: 220, cab: 380 },
      { to: "Hawa Mahal", auto: 90, cab: 160 },
      { to: "Railway station", auto: 70, cab: 140 },
      { to: "City Palace", auto: 110, cab: 190 },
    ],
    budget: { hotel: [1800, 6000], hostel: [450, 1200], homestay: [1200, 3500], dharam: [200, 600], apt: [2500, 8000] },
    foodPerDay: [350, 900], travelPerDay: [250, 700],
    bestFor: ["Family", "Couple", "Parents", "Food lovers"],
    safetyNote: "Bani Park & C-Scheme are quiet & well-lit at night. Old City lanes can get crowded after 8pm.",
    stays: [
      s("Sunder Niwas Homestay", "Homestay", "Bani Park", 1850, "Home-cooked veg breakfast", "Family-friendly", "1.1 km from City Palace", SUN, "sunder-niwas-homestay"),
      s("The Pink Door Hostel", "Hostel", "M.I. Road", 650, "Cafe on site", "Solo-friendly", "400 m from food street", COOL, "the-pink-door-hostel"),
      s("Hotel Amer Heritage", "Hotel", "Civil Lines", 2400, "Breakfast included", "Parents-approved", "Near Jaipur Junction", WARM, "hotel-amer-heritage"),
    ],
  },
  {
    id: "udaipur", name: "Udaipur", region: "Rajasthan", country: "India",
    group: "Rajasthan", types: ["heritage", "couple", "luxury", "city"], emoji: "🛶",
    tagline: "City of Lakes — palaces, ghats, sunset boat rides",
    popularAreas: ["Lal Ghat", "Hanuman Ghat", "Fateh Sagar", "Lake Palace Road"],
    attractions: [
      a("City Palace", "Lal Ghat", "Largest palace in Rajasthan", 0.9, 120, ["Sightseeing"], "walk"),
      a("Lake Pichola boat ride", "Lal Ghat", "Sunset over the lake", 0.5, 60, ["Sightseeing", "Family vacation"], "walk"),
      a("Jagdish Temple", "Old City", "17th-century stone temple", 0.6, 30, ["Spiritual"], "walk"),
      a("Sajjangarh Monsoon Palace", "Aravalli", "Hilltop palace with valley view", 7.2, 90, ["Sightseeing"]),
      a("Bagore Ki Haveli", "Gangaur Ghat", "Folk dance show every evening", 0.7, 75, ["Sightseeing"], "walk"),
      a("Shilpgram", "Havala", "Crafts village", 5.3, 90, ["Local explorer", "Family vacation"]),
    ],
    foodHighlights: [
      { dish: "Dal-baati-churma", where: "Natraj Dining Hall" },
      { dish: "Lake-view cafes", where: "Hanuman Ghat" },
      { dish: "Rooftop thali", where: "Lal Ghat" },
    ],
    travel: [
      { to: "City Palace", auto: 60, cab: 120 },
      { to: "Sajjangarh", auto: 200, cab: 350 },
      { to: "Railway station", auto: 90, cab: 170 },
    ],
    budget: { hotel: [1600, 7500], hostel: [500, 1100], homestay: [1300, 3200], dharam: [200, 500], apt: [2400, 7500] },
    foodPerDay: [350, 1000], travelPerDay: [200, 600],
    bestFor: ["Couple", "Family", "Parents"],
    safetyNote: "Old City around Lal Ghat is very tourist-friendly and well-policed.",
    stays: [
      s("Lal Ghat Lakeview Haveli", "Homestay", "Lal Ghat", 1950, "Rooftop breakfast w/ lake view", "Couple favourite", "Walk to City Palace", SUN),
      s("Bunkyard Hostel", "Hostel", "Hanuman Ghat", 600, "Hostel cafe", "Solo-friendly", "Across the lake", COOL),
      s("Trident Udaipur", "Hotel", "Lake Palace Road", 4200, "Buffet breakfast", "Lake view", "Lake Pichola", WARM),
    ],
  },
  {
    id: "jodhpur", name: "Jodhpur", region: "Rajasthan", country: "India",
    group: "Rajasthan", types: ["heritage", "city", "couple"], emoji: "💙",
    tagline: "Blue City beneath Mehrangarh Fort",
    popularAreas: ["Old Blue City", "Sardar Market", "Ratanada"],
    attractions: [
      a("Mehrangarh Fort", "Old City", "Cliff-top fort museum", 1.2, 150, ["Sightseeing"], "walk"),
      a("Sardar Market clock tower", "Old City", "Spice market & lassi", 0.4, 60, ["Local explorer", "Vegetarian"], "walk"),
      a("Jaswant Thada", "Old City", "Marble cenotaph", 1.6, 45, ["Sightseeing"]),
      a("Mandore Gardens", "Mandore", "Royal cenotaphs", 9.2, 90, ["Sightseeing"]),
    ],
    foodHighlights: [
      { dish: "Mirchi vada & makhaniya lassi", where: "Sardar Market" },
      { dish: "Rooftop fort-view dinners", where: "Old Blue City" },
    ],
    travel: [{ to: "Mehrangarh Fort", auto: 80, cab: 160 }, { to: "Mandore", auto: 220, cab: 380 }],
    budget: { hotel: [1500, 5500], hostel: [450, 1100], homestay: [1200, 3000], dharam: [180, 500], apt: [2200, 6500] },
    foodPerDay: [300, 800], travelPerDay: [200, 550],
    bestFor: ["Couple", "Friends", "Solo"],
    safetyNote: "Stick to lit lanes after 9pm in Old City — narrow alleys can be confusing.",
    stays: [
      s("Blue House Homestay", "Homestay", "Old Blue City", 1500, "Home Marwari breakfast", "Fort view", "Below Mehrangarh", SUN),
      s("Zostel Jodhpur", "Hostel", "Old City", 600, "Cafe on site", "Solo-friendly", "Near Sardar Market", COOL),
      s("RAAS Jodhpur", "Hotel", "Old City", 6500, "Full board", "Luxury heritage", "Fort-facing", WARM),
    ],
  },
  basicRajasthan("jaisalmer", "Jaisalmer", "🐪", "Golden City + Thar desert camps", ["Sam dunes", "Fort area", "Gadisar Lake"], ["Desert camp", "Heritage hotel"]),
  basicRajasthan("pushkar", "Pushkar", "🪔", "Holy lake, ghats & camel fair", ["Pushkar Lake", "Brahma Temple road"], ["Lakeside guest house", "Backpacker hostel", "Dharamshala"]),
  basicRajasthan("mount-abu", "Mount Abu", "🏔️", "Rajasthan's only hill station", ["Nakki Lake", "Sunset Point"], ["Lakeview hotel", "Family resort"]),
  basicRajasthan("ajmer", "Ajmer", "🕌", "Dargah Sharif & Ana Sagar lake", ["Dargah Bazaar", "Ana Sagar"], ["Dharamshala", "Budget hotel"]),
  basicRajasthan("bikaner", "Bikaner", "🏜️", "Junagarh fort & camel country", ["Old City", "Junagarh area"], ["Heritage haveli", "Hotel"]),
  basicRajasthan("ranthambore", "Ranthambore", "🐅", "Wildlife — tigers in the wild", ["Sawai Madhopur", "Park gates"], ["Wildlife resort", "Forest lodge"]),
  basicRajasthan("kota", "Kota", "📚", "Education hub on Chambal", ["Talwandi", "Vigyan Nagar"], ["Hotel", "Service apt"]),
  basicRajasthan("chittorgarh", "Chittorgarh", "🏯", "India's largest fort", ["Fort road"], ["Heritage hotel", "Homestay"]),
  basicRajasthan("bundi", "Bundi", "🎨", "Stepwells & blue lanes", ["Bundi Bazaar"], ["Boutique haveli", "Backpacker stay"]),
  basicRajasthan("alwar", "Alwar", "🌳", "Sariska tiger reserve gateway", ["City centre", "Sariska road"], ["Wildlife resort", "Hotel"]),

  // ---------------- GUJARAT ----------------
  {
    id: "ahmedabad", name: "Ahmedabad", region: "Gujarat", country: "India",
    group: "Gujarat", types: ["heritage", "city", "food", "business"], emoji: "🪡",
    tagline: "UNESCO heritage city — pol walks & business hubs",
    popularAreas: ["Old City (Pols)", "C.G. Road", "S.G. Highway", "Navrangpura"],
    attractions: [
      a("Sabarmati Ashram", "Ashram Road", "Gandhi's ashram & museum", 6.4, 75, ["Spiritual", "Sightseeing"]),
      a("Adalaj Stepwell", "Adalaj", "Geometric Indo-Islamic stepwell", 18, 90, ["Sightseeing"]),
      a("Pol heritage walk", "Old City", "Lanes of carved wooden havelis", 5, 120, ["Sightseeing", "Local explorer"], "walk"),
      a("Manek Chowk", "Old City", "Day jewellery, night food market", 4.5, 75, ["Vegetarian", "Local explorer", "Food trip"]),
      a("Akshardham", "Gandhinagar", "Carved temple complex", 25, 150, ["Spiritual", "Family vacation"]),
    ],
    foodHighlights: [
      { dish: "Gujarati thali", where: "Agashiye, Vishala" },
      { dish: "Manek Chowk midnight menu", where: "Old City" },
      { dish: "Khaman, dhokla, fafda", where: "Law Garden" },
    ],
    travel: [{ to: "Sabarmati Ashram", auto: 120, cab: 220 }, { to: "Akshardham (Gandhinagar)", auto: 380, cab: 600 }, { to: "Airport", auto: 220, cab: 380 }],
    budget: { hotel: [1600, 6500], hostel: [450, 1100], homestay: [1100, 2800], dharam: [200, 500], apt: [2400, 7500] },
    foodPerDay: [300, 850], travelPerDay: [250, 700],
    bestFor: ["Family", "Parents", "Work trip", "Food lovers"],
    safetyNote: "Old City pols are very local — go with a guide for first walk. New city safe at all hours.",
    stays: [
      s("French Haveli (Pol stay)", "Homestay", "Old City Pols", 2400, "Gujarati breakfast", "Heritage walk start", "Inside the pols", SUN),
      s("Zostel Ahmedabad", "Hostel", "Navrangpura", 600, "Cafe", "Solo-friendly", "Walk to C.G. Road", COOL),
      s("Hyatt Regency", "Hotel", "Ashram Road", 5800, "Buffet breakfast", "Business-class", "Riverfront", WARM),
    ],
  },
  basicGujarat("surat", "Surat", "💎", "Diamond city, Tapi riverfront", ["Adajan", "Vesu", "City Light"], ["Business hotel", "Service apt"]),
  basicGujarat("vadodara", "Vadodara", "🎓", "Royal Baroda — Laxmi Vilas Palace", ["Alkapuri", "Sayajigunj"], ["Heritage hotel", "Homestay"]),
  basicGujarat("rajkot", "Rajkot", "🏏", "Saurashtra hub", ["Race Course", "Kalawad Road"], ["Hotel", "Guest house"]),
  basicGujarat("dwarka", "Dwarka", "🕉️", "Krishna's coastal city", ["Dwarkadhish Temple area"], ["Dharamshala", "Temple stay", "Hotel"]),
  basicGujarat("somnath", "Somnath", "🌊", "Jyotirlinga by the sea", ["Temple road"], ["Dharamshala", "Sea-view hotel"]),
  basicGujarat("gir", "Gir", "🦁", "Asiatic lion safari country", ["Sasan Gir"], ["Wildlife resort", "Forest lodge"]),
  basicGujarat("kutch", "Kutch", "🐫", "White Rann salt desert", ["Bhuj base", "Dhordo"], ["Tent city", "Heritage stay"]),
  basicGujarat("bhuj", "Bhuj", "🧵", "Crafts capital, Aina Mahal", ["Old City", "Station Road"], ["Homestay", "Hotel"]),
  basicGujarat("saputara", "Saputara", "🌲", "Gujarat's hill station", ["Lake area"], ["Hill resort", "Cottage"]),
  basicGujarat("statue-of-unity", "Statue of Unity", "🗿", "Tallest statue + tent city", ["Kevadia"], ["Tent city", "Resort"]),
  basicGujarat("junagadh", "Junagadh", "⛰️", "Foot of Mount Girnar", ["Girnar base"], ["Dharamshala", "Hotel"]),
  basicGujarat("porbandar", "Porbandar", "🏠", "Gandhi's birthplace, beach town", ["Beach road"], ["Beach hotel", "Guest house"]),
  basicGujarat("diu", "Diu", "🏖️", "Quiet Portuguese-era island", ["Nagoa Beach"], ["Beach stay", "Boutique hotel"]),

  // ---------------- INDIA POPULAR ----------------
  {
    id: "goa", name: "Goa", region: "Goa", country: "India",
    group: "India Popular", types: ["beach", "backpacking", "couple", "luxury"], emoji: "🏝️",
    tagline: "Beaches, sussegado, scooter rides & sunset shacks",
    popularAreas: ["Anjuna", "Vagator", "Assagao", "Palolem", "Panjim", "Morjim"],
    attractions: [
      a("Anjuna Beach", "North Goa", "Trance sunsets, flea market Wed", 0.4, 120, ["Sightseeing", "Backpacking"], "walk"),
      a("Vagator cliffs", "North Goa", "Chapora fort & sunset", 3.4, 90, ["Sightseeing", "Backpacking"]),
      a("Palolem Beach", "South Goa", "Crescent beach, kayaking", 65, 240, ["Family vacation", "Backpacking"]),
      a("Fontainhas", "Panjim", "Latin quarter heritage walk", 18, 90, ["Sightseeing"], "walk"),
      a("Saturday Night Market", "Arpora", "Live music + food stalls", 7.5, 180, ["Local explorer", "Food trip"]),
      a("Dudhsagar Falls", "Mollem", "Train-side waterfall", 70, 360, ["Sightseeing", "Family vacation"]),
    ],
    foodHighlights: [
      { dish: "Goan fish thali", where: "Mum's Kitchen, Panjim" },
      { dish: "Beach shack seafood", where: "Anjuna · Morjim" },
      { dish: "Vegan/yoga cafes", where: "Assagao" },
    ],
    travel: [{ to: "Airport (Dabolim)", auto: 0, cab: 1400 }, { to: "Beach hop scooter/day", auto: 0, cab: 400 }, { to: "Palolem (South)", auto: 0, cab: 2200 }],
    budget: { hotel: [1800, 8000], hostel: [500, 1500], homestay: [1500, 4000], apt: [3000, 12000] },
    foodPerDay: [500, 1500], travelPerDay: [400, 1200],
    bestFor: ["Couple", "Friends", "Solo", "Backpackers"],
    safetyNote: "North Goa busy & safe; South Goa quieter. Always carry helmet on rented scooters.",
    stays: [
      s("Olaulim Backyards", "Homestay", "Olaulim (interior)", 3200, "Goan breakfast", "Couple retreat", "Riverside", SUN),
      s("The Hosteller Anjuna", "Hostel", "Anjuna", 700, "Cafe on site", "Backpacker hub", "5 min to beach", COOL),
      s("W Goa", "Hotel", "Vagator", 9500, "Beach club", "Luxury", "Cliffside", WARM),
    ],
  },
  {
    id: "manali", name: "Manali", region: "Himachal Pradesh", country: "India",
    group: "India Popular", types: ["hill station", "backpacking", "couple", "family"], emoji: "🏔️",
    tagline: "Old Manali cafes, Solang adventures, snowline drives",
    popularAreas: ["Old Manali", "Vashisht", "Mall Road", "Aleo"],
    attractions: [
      a("Solang Valley", "Solang", "Paragliding & ropeway", 13, 240, ["Sightseeing", "Backpacking", "Family vacation"]),
      a("Hadimba Temple", "Old Manali", "Cedar-forest temple", 2.1, 60, ["Spiritual", "Sightseeing"], "walk"),
      a("Vashisht hot springs", "Vashisht", "Sulphur baths + cafes", 3, 90, ["Local explorer"], "walk"),
      a("Old Manali cafe walk", "Old Manali", "Riverside cafes", 1.5, 120, ["Backpacking", "Food trip"], "walk"),
      a("Atal Tunnel / Sissu", "Lahaul", "Snow-line day trip", 40, 360, ["Sightseeing", "Family vacation"]),
    ],
    foodHighlights: [
      { dish: "Israeli & Italian cafes", where: "Old Manali" },
      { dish: "Trout & momos", where: "Mall Road" },
      { dish: "Tibetan thukpa", where: "Vashisht" },
    ],
    travel: [{ to: "Solang Valley", auto: 0, cab: 1500 }, { to: "Sissu / Atal Tunnel", auto: 0, cab: 3500 }, { to: "Old Manali (Mall)", auto: 80, cab: 200 }],
    budget: { hotel: [1400, 6500], hostel: [400, 1200], homestay: [1100, 3000], apt: [2200, 7500] },
    foodPerDay: [400, 1200], travelPerDay: [350, 1500],
    bestFor: ["Couple", "Friends", "Family", "Backpackers"],
    safetyNote: "Old Manali bridge area is well-lit; avoid driving after dark on Rohtang side.",
    stays: [
      s("Apple Country Homestay", "Homestay", "Aleo", 1800, "Himachali breakfast", "Mountain view", "Riverside", SUN),
      s("Zostel Plus Old Manali", "Hostel", "Old Manali", 750, "Cafe + bonfire", "Backpacker hub", "Walk to cafes", COOL),
      s("Span Resort", "Hotel", "Kullu Manali Hwy", 5800, "Full board", "Family resort", "Beas riverside", WARM),
    ],
  },
  {
    id: "mumbai", name: "Mumbai", region: "Maharashtra", country: "India",
    group: "India Popular", types: ["city", "business", "food", "nightlife"], emoji: "🌆",
    tagline: "Maximum city — local trains, sea-link, midnight chai",
    popularAreas: ["Colaba", "Bandra", "Andheri", "BKC", "Lower Parel"],
    attractions: [
      a("Gateway of India", "Colaba", "Iconic arch + Taj across", 0.6, 60, ["Sightseeing"], "walk"),
      a("Marine Drive", "Churchgate", "Queen's Necklace at sunset", 2.4, 75, ["Sightseeing", "Couple"], "walk"),
      a("Elephanta Caves", "Elephanta Island", "Boat + rock-cut temples", 12, 240, ["Sightseeing", "Spiritual"]),
      a("Bandra–Worli Sea Link drive", "Worli", "Skyline at night", 14, 45, ["Sightseeing"]),
      a("Mohammed Ali Road", "South Mumbai", "Ramadan food street", 5.6, 120, ["Non-veg", "Local explorer", "Food trip"]),
      a("Bandra street art walk", "Bandra West", "Chapel road murals", 8.4, 90, ["Local explorer", "Backpacking"], "walk"),
    ],
    foodHighlights: [
      { dish: "Vada pav & cutting chai", where: "Anywhere — start at Ashok Vada Pav, Dadar" },
      { dish: "Coastal seafood", where: "Trishna, Gajalee" },
      { dish: "Irani cafes", where: "Britannia, Kyani" },
    ],
    travel: [{ to: "Airport T2", auto: 0, cab: 600 }, { to: "Bandra → Colaba", auto: 0, cab: 450 }, { to: "Local train day pass", auto: 0, cab: 60 }],
    budget: { hotel: [2400, 12000], hostel: [600, 1800], homestay: [1800, 4500], apt: [4500, 18000] },
    foodPerDay: [500, 1800], travelPerDay: [400, 1500],
    bestFor: ["Solo", "Couple", "Friends", "Work trip"],
    safetyNote: "Mumbai is one of India's safest cities at night. Use Uber/Ola or local trains till 11pm.",
    stays: [
      s("Abode Bombay", "Homestay", "Colaba", 4200, "Continental breakfast", "Heritage boutique", "Walk to Gateway", SUN),
      s("Backpacker Panda Andheri", "Hostel", "Andheri East", 800, "Cafe", "Solo-friendly", "Near metro + airport", COOL),
      s("Trident BKC", "Hotel", "Bandra Kurla Complex", 8500, "Buffet breakfast", "Work-trip favourite", "Walk to BKC", WARM),
    ],
  },
  {
    id: "varanasi", name: "Varanasi", region: "Uttar Pradesh", country: "India",
    group: "India Popular", types: ["spiritual", "heritage", "food"], emoji: "🪔",
    tagline: "Ghats, Ganga aarti, oldest living city",
    popularAreas: ["Assi Ghat", "Dashashwamedh", "Godowlia", "Cantonment"],
    attractions: [
      a("Ganga aarti", "Dashashwamedh Ghat", "Daily evening ceremony", 1.2, 75, ["Spiritual", "Sightseeing"], "walk"),
      a("Sunrise boat ride", "Assi Ghat", "Row past 84 ghats", 0.3, 90, ["Spiritual", "Sightseeing"], "walk"),
      a("Kashi Vishwanath corridor", "Old City", "Renovated temple complex", 1.5, 90, ["Spiritual"], "walk"),
      a("Sarnath", "Sarnath", "Where Buddha first preached", 12, 180, ["Spiritual", "Sightseeing"]),
      a("Banarasi silk weavers", "Madanpura", "Workshop visit", 2, 90, ["Local explorer"]),
    ],
    foodHighlights: [
      { dish: "Banarasi paan", where: "Godowlia chowk" },
      { dish: "Kachori-sabzi breakfast", where: "Ram Bhandar, Thatheri Bazaar" },
      { dish: "Lassi at Blue Lassi", where: "Kachori Gali" },
    ],
    travel: [{ to: "Sarnath", auto: 250, cab: 450 }, { to: "Cantt railway station", auto: 120, cab: 220 }, { to: "Airport", auto: 0, cab: 750 }],
    budget: { hotel: [1200, 5000], hostel: [400, 1100], homestay: [900, 2500], dharam: [150, 500], apt: [2200, 6000] },
    foodPerDay: [250, 700], travelPerDay: [200, 600],
    bestFor: ["Solo", "Parents", "Spiritual seekers", "Backpackers"],
    safetyNote: "Old ghat lanes are safe but maze-like — drop a pin before walking deep.",
    stays: [
      s("BrijRama Palace", "Hotel", "Darbhanga Ghat", 7200, "Riverside dining", "Heritage luxury", "On the ghats", WARM),
      s("Stops Hostel Varanasi", "Hostel", "Assi Ghat", 550, "Cafe + rooftop", "Solo-friendly", "5 min to ghat", COOL),
      s("Ghat-side family homestay", "Homestay", "Bengali Tola", 1400, "Sattvik veg meals", "Quiet ghat lane", "Walk to aarti", SUN),
    ],
  },
  {
    id: "bangalore", name: "Bangalore", region: "Karnataka", country: "India",
    group: "India Popular", types: ["city", "business", "food", "nightlife"], emoji: "🌳",
    tagline: "Garden city — breweries, parks, work-cafe culture",
    popularAreas: ["Indiranagar", "Koramangala", "MG Road", "HSR Layout", "Whitefield"],
    attractions: [
      a("Cubbon Park", "Central", "Morning walk + library", 4.2, 60, ["Local explorer"], "walk"),
      a("Lalbagh Botanical Garden", "South", "Glass house + flower show", 6.5, 90, ["Family vacation"]),
      a("Indiranagar 100ft Road", "Indiranagar", "Cafes, breweries, shops", 7, 180, ["Food trip", "Backpacking"], "walk"),
      a("Bangalore Palace", "Vasanth Nagar", "Tudor-style royal residence", 5.5, 90, ["Sightseeing"]),
      a("Nandi Hills sunrise", "Chikkaballapur", "Day trip — sunrise drive", 60, 300, ["Sightseeing", "Couple"]),
    ],
    foodHighlights: [
      { dish: "Masala dosa breakfast", where: "MTR, CTR, Vidyarthi Bhavan" },
      { dish: "Craft beer + pub food", where: "Indiranagar, Koramangala" },
      { dish: "Andhra meals", where: "Nagarjuna, Residency Road" },
    ],
    travel: [{ to: "Airport (KIA)", auto: 0, cab: 1200 }, { to: "Indiranagar → Koramangala", auto: 0, cab: 250 }, { to: "Metro day pass", auto: 0, cab: 70 }],
    budget: { hotel: [2200, 9000], hostel: [600, 1600], homestay: [1500, 4000], apt: [3500, 14000] },
    foodPerDay: [400, 1500], travelPerDay: [300, 1200],
    bestFor: ["Solo", "Friends", "Work trip", "Food lovers"],
    safetyNote: "Very safe city. Traffic, not safety, is the planning constraint.",
    stays: [
      s("Goodstay Indiranagar", "Homestay", "Indiranagar", 2400, "Filter coffee + dosa", "Cafe-walk distance", "100ft Road", SUN),
      s("Construkt Hostel", "Hostel", "Koramangala", 800, "Coworking + cafe", "Work-friendly", "Near startup hub", COOL),
      s("Taj MG Road", "Hotel", "MG Road", 7800, "Buffet", "Business-class", "Metro 2 min", WARM),
    ],
  },
  basicIndia("delhi", "Delhi", "Delhi NCR", "🏛️", "Mughal monuments + modern markets", ["Connaught Place", "Hauz Khas", "Aerocity"], ["Hotel", "Hostel", "Homestay", "Service apt"]),
  basicIndia("agra", "Agra", "Uttar Pradesh", "🤍", "Taj Mahal day & night", ["Taj Ganj", "Fatehabad Road"], ["Hotel", "Homestay", "Dharamshala"]),
  basicIndia("rishikesh", "Rishikesh", "Uttarakhand", "🧘", "Ganga, yoga, rafting", ["Tapovan", "Lakshman Jhula"], ["Yoga ashram", "Hostel", "Riverside camp"]),
  basicIndia("haridwar", "Haridwar", "Uttarakhand", "🕉️", "Har Ki Pauri evening aarti", ["Har Ki Pauri", "Shivalik Nagar"], ["Dharamshala", "Hotel"]),
  basicIndia("shimla", "Shimla", "Himachal Pradesh", "🌲", "Colonial hill capital", ["The Mall", "Chhota Shimla"], ["Hotel", "Homestay", "Cottage"]),
  basicIndia("dharamshala", "Dharamshala", "Himachal Pradesh", "🪷", "Dalai Lama's home — Mcleodganj", ["Mcleodganj", "Bhagsu", "Naddi"], ["Homestay", "Hostel", "Hotel"]),
  basicIndia("kasol", "Kasol", "Himachal Pradesh", "🏞️", "Parvati valley backpacker base", ["Kasol main", "Chalal"], ["Backpacker stay", "Riverside camp"]),
  basicIndia("amritsar", "Amritsar", "Punjab", "🛕", "Golden Temple + Wagah border", ["Near Golden Temple", "Lawrence Road"], ["Dharamshala (free)", "Hotel", "Homestay"]),
  basicIndia("chandigarh", "Chandigarh", "Punjab/Haryana", "🌹", "Planned city, Rock Garden, Sukhna", ["Sector 17", "Sector 35"], ["Hotel", "Service apt", "Homestay"]),
  basicIndia("mysore", "Mysore", "Karnataka", "🏯", "Wodeyar palace city", ["Palace area", "Gokulam"], ["Heritage hotel", "Homestay"]),
  basicIndia("hyderabad", "Hyderabad", "Telangana", "🍛", "Charminar, biryani & tech parks", ["Banjara Hills", "Hitec City", "Old City"], ["Hotel", "Service apt", "Homestay"]),
  basicIndia("chennai", "Chennai", "Tamil Nadu", "🌊", "Marina beach, temples, idli mornings", ["T. Nagar", "Mylapore", "ECR"], ["Hotel", "Homestay", "Service apt"]),
  basicIndia("pondicherry", "Pondicherry", "Puducherry", "🥖", "French quarter & Auroville", ["White Town", "Auroville"], ["Heritage hotel", "Homestay", "Hostel"]),
  basicIndia("kochi", "Kochi", "Kerala", "⛵", "Fort Kochi, Chinese nets, backwaters", ["Fort Kochi", "Marine Drive"], ["Heritage homestay", "Hotel", "Hostel"]),
  basicIndia("munnar", "Munnar", "Kerala", "🍃", "Tea estates and misty drives", ["Munnar town", "Chinnakanal"], ["Tea-estate stay", "Resort"]),
  basicIndia("alleppey", "Alleppey", "Kerala", "🛶", "Backwater houseboats", ["Alleppey town", "Punnamada"], ["Houseboat", "Homestay", "Resort"]),
  basicIndia("ooty", "Ooty", "Tamil Nadu", "🚂", "Nilgiri toy train hill town", ["Charing Cross", "Coonoor"], ["Hill resort", "Cottage"]),
  basicIndia("coorg", "Coorg", "Karnataka", "☕", "Coffee plantations & misty trails", ["Madikeri"], ["Estate stay", "Resort"]),
  basicIndia("hampi", "Hampi", "Karnataka", "🪨", "UNESCO Vijayanagara ruins", ["Hampi Bazaar", "Anegundi"], ["Heritage homestay", "Hostel"]),
  basicIndia("kolkata", "Kolkata", "West Bengal", "🚋", "Trams, Durga Puja, Park Street", ["Park Street", "Salt Lake"], ["Hotel", "Heritage homestay", "Hostel"]),
  basicIndia("darjeeling", "Darjeeling", "West Bengal", "☕", "Tea, Toy train, Kanchenjunga sunrise", ["The Mall", "Tiger Hill"], ["Heritage hotel", "Homestay"]),
  basicIndia("gangtok", "Gangtok", "Sikkim", "⛰️", "Capital of Sikkim", ["MG Marg"], ["Hotel", "Homestay"]),
  basicIndia("shillong", "Shillong", "Meghalaya", "🎸", "Scotland of the East", ["Police Bazaar", "Laitumkhrah"], ["Homestay", "Hotel"]),
  basicIndia("guwahati", "Guwahati", "Assam", "🛕", "Kamakhya & Brahmaputra", ["GS Road", "Pan Bazaar"], ["Hotel", "Homestay"]),
  basicIndia("puri", "Puri", "Odisha", "🌊", "Jagannath temple & beach", ["Beach road", "Temple area"], ["Dharamshala", "Sea-view hotel"]),
  basicIndia("andaman", "Andaman", "Andaman Islands", "🐚", "Havelock, Neil, scuba island life", ["Havelock", "Port Blair"], ["Beach stay", "Resort", "Homestay"]),
  basicIndia("lakshadweep", "Lakshadweep", "Lakshadweep", "🐠", "Coral lagoons, restricted-permit islands", ["Agatti", "Bangaram"], ["Island resort", "Homestay"]),

  // ---------------- INTERNATIONAL — BALI (with sub-areas) ----------------
  intlGroup("bali", "Bali", "Indonesia", "🌴", "Bali", ["beach", "couple", "luxury", "backpacking"], "Rice fields, beach clubs, scooter island life",
    ["Ubud", "Seminyak", "Canggu", "Kuta", "Uluwatu", "Nusa Dua", "Sanur"],
    [
      a("Tegallalang rice terraces", "Ubud", "Iconic terraces + swings", 12, 120, ["Sightseeing", "Couple"]),
      a("Uluwatu temple at sunset", "Uluwatu", "Cliff temple + Kecak dance", 35, 180, ["Spiritual", "Sightseeing"]),
      a("Canggu beach clubs", "Canggu", "Sunset bars + surfing", 5, 240, ["Backpacking", "Couple", "Food trip"]),
      a("Tanah Lot", "Tabanan", "Sea temple at sunset", 18, 120, ["Spiritual", "Sightseeing"]),
      a("Ubud Monkey Forest", "Ubud", "Sacred banyan sanctuary", 1.2, 75, ["Family vacation"], "walk"),
      a("Nusa Penida day trip", "East Bali", "Kelingking cliff + snorkel", 80, 480, ["Sightseeing", "Backpacking"]),
    ],
    [
      { dish: "Babi guling (pork)", where: "Ibu Oka, Ubud" },
      { dish: "Vegan / smoothie bowls", where: "Canggu, Ubud" },
      { dish: "Beach club sundowners", where: "La Brisa, Potato Head" },
    ],
    [{ to: "Airport (DPS) → Ubud", auto: 0, cab: 2200 }, { to: "Scooter day rental", auto: 0, cab: 350 }, { to: "Canggu → Uluwatu", auto: 0, cab: 1500 }],
    { hotel: [3500, 18000], hostel: [800, 2200], homestay: [1500, 4500], apt: [4500, 22000] },
    [800, 2500], [350, 1500],
    ["Couple", "Solo", "Friends", "Backpackers", "Digital nomads"],
    "Very safe overall. Watch for scooter scams; helmet always on; nightlife in Kuta after 1am can get rowdy."),

  // ---------------- INTERNATIONAL — VIETNAM (with sub-areas) ----------------
  intlGroup("vietnam", "Vietnam", "Vietnam", "🍜", "Vietnam", ["city", "backpacking", "food", "beach"], "Pho mornings, motorbike streets, halong bays",
    ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hoi An", "Nha Trang", "Ha Long Bay", "Sapa", "Phu Quoc"],
    [
      a("Hoan Kiem Lake walk", "Hanoi", "Old Quarter heart", 0.5, 60, ["Sightseeing", "Local explorer"], "walk"),
      a("Train Street coffee", "Hanoi", "Coffee 30cm from train", 1.6, 60, ["Backpacking", "Food trip"], "walk"),
      a("Hoi An lantern night", "Hoi An", "Old town glows after dark", 0.8, 120, ["Sightseeing", "Couple"], "walk"),
      a("Ba Na Hills + Golden Bridge", "Da Nang", "Cable car & bridge", 35, 360, ["Sightseeing", "Family vacation"]),
      a("Halong Bay cruise", "Ha Long", "Limestone karst overnight", 165, 1440, ["Sightseeing", "Couple"]),
      a("Cu Chi tunnels", "HCMC", "War history half-day", 70, 300, ["Sightseeing"]),
    ],
    [
      { dish: "Pho bo / pho ga", where: "Pho Gia Truyen, Hanoi" },
      { dish: "Banh mi", where: "Banh Mi Phuong, Hoi An" },
      { dish: "Egg coffee", where: "Cafe Giang, Hanoi" },
    ],
    [{ to: "Grab bike across town", auto: 0, cab: 200 }, { to: "Sleeper bus Hanoi → Sapa", auto: 0, cab: 800 }, { to: "Domestic flight HAN → DAD", auto: 0, cab: 4500 }],
    { hotel: [1800, 9000], hostel: [400, 1200], homestay: [900, 2800], apt: [2800, 12000] },
    [400, 1500], [200, 1000],
    ["Solo", "Friends", "Backpackers", "Food lovers", "Couple"],
    "Very safe for solo & female travellers. Watch belongings on motorbike streets; cross roads slowly + steadily."),

  // ---------------- INTERNATIONAL — SINGAPORE ----------------
  intlGroup("singapore", "Singapore", "Singapore", "🦁", "Singapore", ["city", "family", "food", "luxury"], "MRT-easy city of hawker food & skyline parks",
    ["Marina Bay", "Orchard", "Sentosa", "Chinatown", "Little India", "Bugis", "Clarke Quay"],
    [
      a("Gardens by the Bay", "Marina Bay", "Supertrees + Cloud Forest", 0.6, 180, ["Family vacation", "Sightseeing"], "walk"),
      a("Marina Bay Sands SkyPark", "Marina Bay", "Sunset skyline view", 0.4, 90, ["Sightseeing", "Couple"], "walk"),
      a("Sentosa Universal Studios", "Sentosa", "Theme park day", 8, 480, ["Family vacation"]),
      a("Chinatown food street", "Chinatown", "Hawker centre + temples", 3.2, 120, ["Food trip", "Local explorer"], "walk"),
      a("Little India + Mustafa", "Little India", "Indian food + 24h shopping", 4, 120, ["Food trip", "Local explorer"], "walk"),
      a("Singapore Zoo / Night Safari", "Mandai", "World-class wildlife", 18, 300, ["Family vacation"]),
    ],
    [
      { dish: "Chicken rice + chilli crab", where: "Maxwell, Tian Tian" },
      { dish: "Hawker centres", where: "Lau Pa Sat, Newton Circus" },
      { dish: "South Indian thali", where: "Komala Vilas, Little India" },
    ],
    [{ to: "MRT day pass", auto: 0, cab: 600 }, { to: "Airport (Changi) → Marina", auto: 0, cab: 2200 }, { to: "Grab across town", auto: 0, cab: 900 }],
    { hotel: [6000, 22000], hostel: [1500, 3500], homestay: [3500, 8000], apt: [8000, 30000] },
    [1200, 4500], [400, 1500],
    ["Family", "Couple", "Work trip", "Solo"],
    "One of the world's safest cities. Strict laws — no smoking outside zones, no littering, no chewing gum import."),

  // ---------------- OTHER INTERNATIONAL ----------------
  basicIntl("dubai", "Dubai", "UAE", "🏙️", "Skyscrapers, desert safari, beaches", ["Downtown", "Marina", "JBR", "Deira"], ["Hotel", "Service apt", "Beach resort"]),
  basicIntl("thailand", "Thailand", "Thailand", "🏝️", "Bangkok, Chiang Mai, islands", ["Bangkok Sukhumvit", "Chiang Mai Old City", "Phuket", "Krabi"], ["Hotel", "Hostel", "Beach resort", "Homestay"]),
  basicIntl("malaysia", "Malaysia", "Malaysia", "🏙️", "KL, Penang, Langkawi", ["KL Bukit Bintang", "Penang Georgetown", "Langkawi"], ["Hotel", "Hostel", "Beach resort"]),
  basicIntl("maldives", "Maldives", "Maldives", "🏖️", "Overwater villas, lagoons", ["Male", "Maafushi", "Resort island"], ["Overwater villa", "Local guesthouse"]),
  basicIntl("sri-lanka", "Sri Lanka", "Sri Lanka", "🦚", "Colombo, hills, beaches", ["Colombo", "Kandy", "Ella", "Mirissa"], ["Hotel", "Hostel", "Homestay", "Beach stay"]),
  basicIntl("nepal", "Nepal", "Nepal", "🏔️", "Kathmandu, Pokhara, treks", ["Thamel", "Lakeside Pokhara"], ["Hotel", "Hostel", "Teahouse"]),
  basicIntl("bhutan", "Bhutan", "Bhutan", "🇧🇹", "Tiger's Nest, Paro valleys", ["Thimphu", "Paro", "Punakha"], ["Hotel", "Homestay"]),
  basicIntl("paris", "Paris", "France", "🗼", "Cafes, museums, bridges", ["Le Marais", "Saint-Germain", "Montmartre"], ["Hotel", "Hostel", "Apartment"]),
  basicIntl("london", "London", "United Kingdom", "🇬🇧", "Tube-easy city of museums & markets", ["Soho", "Shoreditch", "Camden", "South Bank"], ["Hotel", "Hostel", "Service apt"]),
  basicIntl("tokyo", "Tokyo", "Japan", "🗾", "Neon, ramen, conveyor sushi", ["Shinjuku", "Shibuya", "Asakusa", "Akihabara"], ["Hotel", "Capsule hotel", "Hostel", "Apartment"]),
];

// ---------- Generators for "basic" entries (kept lean but realistic) ----------
function basicRajasthan(id: string, name: string, emoji: string, tagline: string, areas: string[], stayKinds: string[]): Destination {
  return makeBasic(id, name, "Rajasthan", "India", "Rajasthan", ["heritage", "city"], emoji, tagline, areas, stayKinds, [1200, 5500], [350, 950], [200, 600]);
}
function basicGujarat(id: string, name: string, emoji: string, tagline: string, areas: string[], stayKinds: string[]): Destination {
  return makeBasic(id, name, "Gujarat", "India", "Gujarat", ["heritage", "city"], emoji, tagline, areas, stayKinds, [1300, 5500], [300, 800], [250, 650]);
}
function basicIndia(id: string, name: string, region: string, emoji: string, tagline: string, areas: string[], stayKinds: string[]): Destination {
  return makeBasic(id, name, region, "India", "India Popular", ["city"], emoji, tagline, areas, stayKinds, [1500, 7000], [400, 1200], [300, 1000]);
}
function basicIntl(id: string, name: string, country: string, emoji: string, tagline: string, areas: string[], stayKinds: string[]): Destination {
  return makeBasic(id, name, country, country, "International", ["city"], emoji, tagline, areas, stayKinds, [3500, 14000], [1000, 3500], [400, 1500]);
}

function makeBasic(
  id: string, name: string, region: string, country: string,
  group: Destination["group"], types: string[], emoji: string, tagline: string,
  areas: string[], stayKinds: string[], hotel: [number, number], food: [number, number], travel: [number, number]
): Destination {
  const accents = [WARM, COOL, SUN, ROSE];
  const stays: StaySuggestion[] = stayKinds.slice(0, 3).map((k, i) => {
    const baseArea = areas[i % areas.length];
    const isHostel = k.toLowerCase().includes("hostel") || k.toLowerCase().includes("backpack");
    const isDharam = k.toLowerCase().includes("dharam") || k.toLowerCase().includes("temple");
    const price = isDharam ? 350 : isHostel ? 750 : Math.round((hotel[0] + hotel[1]) / 2);
    const type: StayKind = (k as StayKind);
    return s(`${name} ${k}`, type, baseArea, price, isHostel ? "Cafe on site" : isDharam ? "Sattvik thali" : "Breakfast included",
      isHostel ? "Solo-friendly" : isDharam ? "Budget-friendly" : "Recommended", `Walk to ${baseArea}`, accents[i % accents.length]);
  });
  return {
    id, name, region, country, group, types, emoji, tagline,
    popularAreas: areas,
    attractions: areas.slice(0, 4).map((ar, i) =>
      a(`${name} ${["highlight", "viewpoint", "market", "old town"][i] ?? "spot"}`, ar,
        `Local favourite around ${ar}`, 1 + i * 1.6, 60 + i * 15,
        i % 2 ? ["Sightseeing", "Local explorer"] : ["Sightseeing"], i === 0 ? "walk" : "drive")
    ),
    foodHighlights: [
      { dish: "Local thali / signature dish", where: areas[0] },
      { dish: "Street food walk", where: areas[Math.min(1, areas.length - 1)] },
    ],
    travel: [
      { to: "City centre", auto: 80, cab: 160 },
      { to: "Railway / bus station", auto: 100, cab: 200 },
    ],
    budget: { hotel, hostel: [400, 1200], homestay: [1100, 3000], dharam: [180, 500], apt: [Math.round(hotel[0] * 1.4), Math.round(hotel[1] * 1.4)] },
    foodPerDay: food, travelPerDay: travel,
    bestFor: ["Family", "Couple", "Solo", "Friends"],
    safetyNote: "Stick to popular & well-lit areas after dark; ask hosts about local timings.",
    stays,
  };
}

function intlGroup(
  id: string, name: string, country: string, emoji: string, group: Destination["group"], types: string[], tagline: string,
  areas: string[], attractions: Attraction[], food: FoodHighlight[], travel: TravelEstimate[],
  budget: Destination["budget"], foodPerDay: [number, number], travelPerDay: [number, number],
  bestFor: string[], safetyNote: string
): Destination {
  return {
    id, name, region: country, country, group, types, emoji, tagline,
    popularAreas: areas, attractions, foodHighlights: food, travel,
    budget, foodPerDay, travelPerDay, bestFor, safetyNote,
    stays: [
      s(`${name} boutique stay`, "Hotel", areas[0], Math.round((budget.hotel[0] + budget.hotel[1]) / 2), "Breakfast included", "Top pick", `Walk to ${areas[0]}`, WARM),
      s(`${name} backpacker hostel`, "Hostel", areas[Math.min(1, areas.length - 1)], Math.round((budget.hostel[0] + budget.hostel[1]) / 2), "Cafe on site", "Solo-friendly", "Central location", COOL),
      s(`${name} local homestay`, "Homestay", areas[Math.min(2, areas.length - 1)], Math.round((budget.homestay[0] + budget.homestay[1]) / 2), "Home-cooked breakfast", "Local experience", "Quiet residential", SUN),
    ],
  };
}

// ---------- Lookup utilities ----------
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function findDestination(query: string): Destination | undefined {
  if (!query) return undefined;
  const q = norm(query);
  return DESTINATIONS.find((d) => norm(d.name) === q)
      || DESTINATIONS.find((d) => norm(d.name).startsWith(q))
      || DESTINATIONS.find((d) => norm(d.name).includes(q))
      || DESTINATIONS.find((d) => d.popularAreas.some((a) => norm(a).includes(q)));
}

export function suggestDestinations(query: string, limit = 8): Destination[] {
  if (!query) return [];
  const q = norm(query);
  const scored = DESTINATIONS.map((d) => {
    const n = norm(d.name);
    let score = 0;
    if (n === q) score = 100;
    else if (n.startsWith(q)) score = 80;
    else if (n.includes(q)) score = 60;
    else if (norm(d.region).includes(q) || norm(d.country).includes(q)) score = 40;
    else if (d.popularAreas.some((a) => norm(a).includes(q))) score = 30;
    return { d, score };
  }).filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.d);
  return scored;
}

// Generic fallback for free-typed destinations not in DB
export function genericDestination(name: string): Destination {
  return makeBasic(
    "custom-" + norm(name), name, "Custom", "—", "International", ["city"],
    "🌍", `Smart stay plan for ${name}`,
    ["City centre", "Old town", "Business district"],
    ["Hotel", "Hostel", "Homestay"],
    [1800, 7000], [400, 1500], [300, 1000]
  );
}

export function destinationsByGroup() {
  const groups: Record<string, Destination[]> = {};
  for (const d of DESTINATIONS) {
    (groups[d.group] ||= []).push(d);
  }
  return groups;
}
