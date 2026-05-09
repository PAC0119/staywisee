import { motion } from "framer-motion";
import { Footprints, Navigation, Sun, Sunrise, Sunset, MapPin, Sparkles, Clock } from "lucide-react";
import type { TripPlan } from "./SearchPanel";
import type { Attraction, Destination } from "./destinations";

const dirUrl = (origin: string, dest: string, mode: "driving" | "walking") =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=${mode}`;

const slotIcons = [Sunrise, Sun, Sunset];
const slotLabels = ["Morning", "Afternoon", "Evening"];

function pickStops(d: Destination, prefs: { purpose: string[]; food: string[]; group: string[] }) {
  const interest = new Set([...prefs.purpose, ...prefs.food]);
  if (prefs.group.includes("Family") || prefs.group.includes("Parents")) interest.add("Family vacation");
  if (prefs.group.includes("Solo") || prefs.group.includes("Friends")) interest.add("Backpacking");

  const scored = d.attractions.map((s) => ({
    stop: s,
    score: s.tags.filter((t) => interest.has(t)).length,
  }));
  let chosen = scored.filter((s) => s.score > 0);
  if (chosen.length < Math.min(6, d.attractions.length)) {
    const filler = scored
      .filter((s) => s.score === 0 && s.stop.tags.includes("Sightseeing"))
      .slice(0, 6 - chosen.length);
    chosen = [...chosen, ...filler];
  }
  if (chosen.length === 0) chosen = scored;
  chosen.sort((a, b) => b.score - a.score);
  return chosen.map((c) => c.stop);
}

function buildDays(stops: Attraction[], days: number) {
  const result: { day: number; slots: Attraction[] }[] = [];
  if (!stops.length) return result;
  const remaining = [...stops];
  for (let dN = 1; dN <= days; dN++) {
    const slots: Attraction[] = [];
    const walkIdx = remaining.findIndex((s) => s.mode === "walk");
    if (walkIdx >= 0) slots.push(remaining.splice(walkIdx, 1)[0]);
    while (slots.length < 3 && remaining.length) slots.push(remaining.shift()!);
    if (slots.length) result.push({ day: dN, slots });
    if (!remaining.length && dN < days) {
      remaining.push(...stops.slice(0, Math.min(stops.length, (days - dN) * 3)));
    }
  }
  return result;
}

export function Itinerary({ plan }: { plan: TripPlan }) {
  const d = plan.resolved;
  const stops = pickStops(d, plan);
  const itinerary = buildDays(stops, plan.days);
  const home = d.stays[0];
  const origin = home ? `${home.name}, ${home.area}, ${d.name}` : `${d.popularAreas[0]}, ${d.name}`;

  if (!itinerary.length) return null;

  return (
    <div className="mb-12">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: "var(--coral)" }}>
            Day-by-day itinerary
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            Your {plan.days}-day plan in {d.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tuned for {plan.purpose.join(", ").toLowerCase()} · {plan.food.join(", ").toLowerCase()} · starting from{" "}
            <span className="font-medium text-foreground">{home?.name ?? d.popularAreas[0]}</span>
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--saffron)" }} />
          {stops.length} hand-picked stops
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {itinerary.map((day, di) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: di * 0.05 }}
            className="rounded-3xl border bg-card p-5 md:p-6 shadow-soft relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 blur-2xl"
                 style={{ background: "var(--gradient-warm)" }} />
            <div className="flex items-center justify-between mb-4 relative">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Day {day.day}</div>
                <div className="font-display text-xl font-bold">
                  {day.slots.length} stops · {day.slots.reduce((a, s) => a + s.minutes, 0)} min
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {day.slots.reduce((a, s) => a + s.km, 0).toFixed(1)} km
              </div>
            </div>

            <div className="relative space-y-3">
              {day.slots.map((s, si) => {
                const SlotIcon = slotIcons[si] ?? Sun;
                const dest = `${s.name}, ${s.area}, ${d.name}`;
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
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href={dirUrl(origin, dest, "driving")} target="_blank" rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                        style={{ backgroundImage: "var(--gradient-warm)" }}>
                        <Navigation className="w-3.5 h-3.5" /> Drive route
                      </a>
                      <a href={dirUrl(origin, dest, "walking")} target="_blank" rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-muted">
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
