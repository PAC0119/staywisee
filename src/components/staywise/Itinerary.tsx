import { motion } from "framer-motion";
import { Footprints, Navigation, Sun, Sunrise, Sunset, MapPin, Sparkles, Clock } from "lucide-react";
import type { TripPlan } from "./SearchPanel";
import { PROPERTIES } from "./properties";

type Stop = {
  name: string;
  area: string;
  blurb: string;
  km: number;
  minutes: number;
  tags: string[]; // matches purpose/food
  mode: "walk" | "drive";
};

// Curated Jaipur stops, tagged for matching against user preferences.
const POOL: Stop[] = [
  { name: "Hawa Mahal", area: "Old City", blurb: "Iconic pink facade — best at sunrise", km: 1.8, minutes: 60, tags: ["Sightseeing"], mode: "walk" },
  { name: "City Palace", area: "Old City", blurb: "Royal courtyards, museum, textile gallery", km: 1.6, minutes: 120, tags: ["Sightseeing"], mode: "walk" },
  { name: "Jantar Mantar", area: "Old City", blurb: "UNESCO astronomy observatory", km: 1.7, minutes: 60, tags: ["Sightseeing"], mode: "walk" },
  { name: "Amber Fort", area: "Amer", blurb: "Hilltop fort + mirror palace", km: 10.1, minutes: 180, tags: ["Sightseeing"], mode: "drive" },
  { name: "Nahargarh Fort", area: "Aravalli ridge", blurb: "Sunset view over the city", km: 9.4, minutes: 120, tags: ["Sightseeing"], mode: "drive" },
  { name: "Jal Mahal", area: "Man Sagar Lake", blurb: "Photo stop on the way to Amer", km: 6.8, minutes: 30, tags: ["Sightseeing"], mode: "drive" },
  { name: "Birla Mandir", area: "Tilak Nagar", blurb: "Calm marble temple, evening aarti", km: 4.2, minutes: 45, tags: ["Spiritual"], mode: "drive" },
  { name: "Govind Dev Ji Temple", area: "City Palace complex", blurb: "Krishna temple, 7 daily darshans", km: 1.5, minutes: 45, tags: ["Spiritual"], mode: "walk" },
  { name: "Galtaji (Monkey Temple)", area: "Aravalli foothills", blurb: "Ancient stepwell temple complex", km: 11.2, minutes: 90, tags: ["Spiritual"], mode: "drive" },
  { name: "Bapu Bazar", area: "Pink City", blurb: "Veg thalis, lassi, juttis, block prints", km: 1.4, minutes: 75, tags: ["Vegetarian", "Jain", "Local explorer"], mode: "walk" },
  { name: "Johari Bazar", area: "Old City", blurb: "Street food + jewellery lanes", km: 1.6, minutes: 60, tags: ["Local explorer", "Non-veg"], mode: "walk" },
  { name: "Masala Chowk", area: "Ram Niwas Garden", blurb: "Open-air food court — 20 famous stalls", km: 2.4, minutes: 75, tags: ["Vegetarian", "Local explorer", "Non-veg", "Vegan"], mode: "drive" },
  { name: "Laxmi Misthan Bhandar (LMB)", area: "Johari Bazar", blurb: "Legendary veg thali + sweets", km: 1.7, minutes: 60, tags: ["Vegetarian", "Jain"], mode: "walk" },
  { name: "Tapri Central", area: "C-Scheme", blurb: "Rooftop chai cafe — slow morning", km: 3.1, minutes: 60, tags: ["Vegan", "Vegetarian", "Food trip"], mode: "drive" },
  { name: "Anokhi Cafe", area: "C-Scheme", blurb: "Vegan/Jain friendly menu", km: 3.3, minutes: 60, tags: ["Vegan", "Jain", "Vegetarian"], mode: "drive" },
  { name: "Chokhi Dhani", area: "Tonk Road", blurb: "Rajasthani village experience + folk dance", km: 14.0, minutes: 180, tags: ["Family vacation", "Sightseeing"], mode: "drive" },
  { name: "Albert Hall Museum", area: "Ram Niwas Garden", blurb: "Indo-Saracenic museum, lit up at night", km: 2.6, minutes: 75, tags: ["Sightseeing", "Family vacation"], mode: "drive" },
  { name: "Sisodia Rani Garden", area: "Agra Road", blurb: "Quiet terraced Mughal garden", km: 8.6, minutes: 60, tags: ["Family vacation", "Sightseeing"], mode: "drive" },
  { name: "Cafe Palladio", area: "Narain Niwas", blurb: "Instagrammable courtyard cafe", km: 3.6, minutes: 75, tags: ["Food trip", "Backpacking"], mode: "drive" },
  { name: "Pink City night walk", area: "Hawa Mahal lanes", blurb: "Lit-up bazaars after 8pm", km: 1.5, minutes: 60, tags: ["Backpacking", "Local explorer"], mode: "walk" },
  { name: "Co-working at MyHQ", area: "C-Scheme", blurb: "Fast wifi, day passes available", km: 3.4, minutes: 240, tags: ["Work"], mode: "drive" },
];

const dirUrl = (origin: string, dest: string, mode: "driving" | "walking") =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=${mode}`;

const slotIcons = [Sunrise, Sun, Sunset];
const slotLabels = ["Morning", "Afternoon", "Evening"];

function pickStops(prefs: { purpose: string[]; food: string[]; group: string[] }) {
  const interest = new Set([...prefs.purpose, ...prefs.food]);
  // Score each stop by tag overlap; group preference can boost a couple of tags.
  if (prefs.group.includes("Family") || prefs.group.includes("Parents")) interest.add("Family vacation");
  if (prefs.group.includes("Solo") || prefs.group.includes("Friends")) interest.add("Backpacking");

  const scored = POOL.map((s) => {
    const overlap = s.tags.filter((t) => interest.has(t)).length;
    return { stop: s, score: overlap };
  });
  // Keep anything with >0 score, fall back to sightseeing if too few.
  let chosen = scored.filter((s) => s.score > 0);
  if (chosen.length < 6) {
    const filler = scored
      .filter((s) => s.score === 0 && s.stop.tags.includes("Sightseeing"))
      .slice(0, 6 - chosen.length);
    chosen = [...chosen, ...filler];
  }
  // Sort: highest score first, but interleave walk/drive for variety.
  chosen.sort((a, b) => b.score - a.score);
  return chosen.map((c) => c.stop);
}

function buildDays(stops: Stop[], days: number) {
  // 3 slots per day; never repeat a stop. Try to start each day with a walkable stop.
  const result: { day: number; slots: Stop[] }[] = [];
  const remaining = [...stops];
  for (let d = 1; d <= days; d++) {
    const slots: Stop[] = [];
    // Morning: prefer a walk stop
    const walkIdx = remaining.findIndex((s) => s.mode === "walk");
    if (walkIdx >= 0) slots.push(remaining.splice(walkIdx, 1)[0]);
    while (slots.length < 3 && remaining.length) {
      slots.push(remaining.shift()!);
    }
    if (slots.length) result.push({ day: d, slots });
    if (!remaining.length && d < days) {
      // recycle pool by re-pulling tail of stops
      remaining.push(...stops.slice(0, Math.min(stops.length, (days - d) * 3)));
    }
  }
  return result;
}

export function Itinerary({ plan }: { plan: TripPlan }) {
  const stops = pickStops(plan);
  const itinerary = buildDays(stops, plan.days);
  // Origin = top recommended stay (first property). Real product would tie this to the user's chosen stay.
  const home = PROPERTIES[0];
  const origin = `${home.name}, ${home.area}, ${home.city}`;

  return (
    <div className="mb-12">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: "var(--coral)" }}>
            Day-by-day itinerary
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            Your {plan.days}-day plan in {plan.destination}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tuned for {plan.purpose.join(", ").toLowerCase()} · {plan.food.join(", ").toLowerCase()} · starting from{" "}
            <span className="font-medium text-foreground">{home.name}</span>
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--saffron)" }} />
          {stops.length} hand-picked stops
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {itinerary.map((d, di) => (
          <motion.div
            key={d.day}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: di * 0.05 }}
            className="rounded-3xl border bg-card p-5 md:p-6 shadow-soft relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 blur-2xl"
                 style={{ background: "var(--gradient-warm)" }} />
            <div className="flex items-center justify-between mb-4 relative">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Day {d.day}</div>
                <div className="font-display text-xl font-bold">
                  {d.slots.length} stops · {d.slots.reduce((a, s) => a + s.minutes, 0)} min
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {d.slots.reduce((a, s) => a + s.km, 0).toFixed(1)} km
              </div>
            </div>

            <div className="relative space-y-3">
              {d.slots.map((s, si) => {
                const SlotIcon = slotIcons[si] ?? Sun;
                const dest = `${s.name}, ${s.area}, ${plan.destination}`;
                return (
                  <div key={s.name + si} className="rounded-2xl border bg-background/60 p-4">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="inline-flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <SlotIcon className="w-3.5 h-3.5" style={{ color: "var(--saffron)" }} />
                        {slotLabels[si] ?? `Stop ${si + 1}`}
                        <span className="inline-flex items-center gap-0.5 ml-1">
                          <Clock className="w-3 h-3" /> {s.minutes}m
                        </span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: s.mode === "walk" ? "color-mix(in oklab, var(--teal) 15%, transparent)" : "color-mix(in oklab, var(--coral) 15%, transparent)",
                                     color: s.mode === "walk" ? "var(--teal)" : "var(--coral)" }}>
                        {s.mode === "walk" ? "Walkable" : "Drive"}
                      </span>
                    </div>
                    <div className="font-semibold leading-tight">{s.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">{s.area} · {s.km} km · {s.blurb}</div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {s.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={dirUrl(origin, dest, "driving")}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                        style={{ backgroundImage: "var(--gradient-warm)" }}
                      >
                        <Navigation className="w-3.5 h-3.5" /> Drive route
                      </a>
                      <a
                        href={dirUrl(origin, dest, "walking")}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-muted"
                      >
                        <Footprints className="w-3.5 h-3.5" /> Walk route
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground mt-3">
        Routes open in Google Maps with directions from your stay. Times are approximate.
      </p>
    </div>
  );
}