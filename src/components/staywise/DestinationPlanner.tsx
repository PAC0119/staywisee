import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays, Users, Wallet, Utensils, Car, BedDouble, Sparkles,
  Sunrise, Sun, Sunset, Clock, MapPin, Navigation, Footprints, Calculator
} from "lucide-react";
import type { Attraction, Destination, StaySuggestion } from "./destinations";

type Vibe = "Relaxed" | "Balanced" | "Packed";
type Tier = "Budget" | "Comfort" | "Luxury";

const dirUrl = (origin: string, dest: string, mode: "driving" | "walking") =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=${mode}`;

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const slotIcons = [Sunrise, Sun, Sunset];
const slotLabels = ["Morning", "Afternoon", "Evening"];

const STAYS_PER_DAY: Record<Vibe, number> = { Relaxed: 2, Balanced: 3, Packed: 4 };

function pickStay(d: Destination, tier: Tier): StaySuggestion | undefined {
  if (!d.stays.length) return undefined;
  const sorted = [...d.stays].sort((a, b) => a.price - b.price);
  if (tier === "Budget") return sorted[0];
  if (tier === "Luxury") return sorted[sorted.length - 1];
  return sorted[Math.floor(sorted.length / 2)];
}

function buildDays(d: Destination, days: number, vibe: Vibe): { day: number; slots: Attraction[] }[] {
  const perDay = STAYS_PER_DAY[vibe];
  const pool = [...d.attractions];
  if (!pool.length) return [];
  const result: { day: number; slots: Attraction[] }[] = [];
  let idx = 0;
  for (let dayN = 1; dayN <= days; dayN++) {
    const slots: Attraction[] = [];
    for (let i = 0; i < perDay; i++) {
      slots.push(pool[idx % pool.length]);
      idx++;
    }
    result.push({ day: dayN, slots });
  }
  return result;
}

function midpoint([lo, hi]: [number, number]) { return (lo + hi) / 2; }

export function DestinationPlanner({ d }: { d: Destination }) {
  const [days, setDays] = useState(3);
  const [group, setGroup] = useState(2);
  const [vibe, setVibe] = useState<Vibe>("Balanced");
  const [tier, setTier] = useState<Tier>("Comfort");

  const stay = useMemo(() => pickStay(d, tier), [d, tier]);
  const itinerary = useMemo(() => buildDays(d, days, vibe), [d, days, vibe]);
  const origin = stay ? `${stay.name}, ${stay.area}, ${d.name}` : `${d.popularAreas[0]}, ${d.name}`;

  const costs = useMemo(() => {
    // Stay cost: per room, ~2 people per room
    const rooms = Math.max(1, Math.ceil(group / 2));
    const stayPerNight = stay
      ? stay.price
      : tier === "Budget"
        ? d.budget.hostel[0]
        : tier === "Luxury"
          ? d.budget.hotel[1]
          : midpoint(d.budget.hotel);
    const nights = Math.max(1, days - 1);
    const stayTotal = stayPerNight * rooms * nights;

    const foodPerPersonDay = tier === "Budget"
      ? d.foodPerDay[0]
      : tier === "Luxury"
        ? d.foodPerDay[1]
        : midpoint(d.foodPerDay);
    const foodTotal = foodPerPersonDay * group * days;

    const travelMid = midpoint(d.travelPerDay);
    const travelMult = tier === "Budget" ? 0.7 : tier === "Luxury" ? 1.6 : 1;
    // travel scales with group but shared per cab (~3 people)
    const travelTotal = travelMid * Math.max(1, Math.ceil(group / 3)) * days * travelMult;

    const total = stayTotal + foodTotal + travelTotal;
    return {
      stayTotal, foodTotal, travelTotal, total,
      stayPerNight, foodPerPersonDay,
      perPerson: total / Math.max(1, group),
      perDay: total / Math.max(1, days),
      rooms, nights,
    };
  }, [d, days, group, tier, stay]);

  const breakdown = [
    { key: "Stay", value: costs.stayTotal, icon: <BedDouble className="w-4 h-4" />, color: "var(--coral)" },
    { key: "Food", value: costs.foodTotal, icon: <Utensils className="w-4 h-4" />, color: "var(--saffron)" },
    { key: "Local travel", value: costs.travelTotal, icon: <Car className="w-4 h-4" />, color: "var(--teal)" },
  ];

  return (
    <div className="space-y-10">
      {/* CONTROLS */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-3xl border bg-card p-5 md:p-6 shadow-soft">
        <div className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: "var(--coral)" }}>
          Trip planner
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-5 inline-flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> Plan your {d.name} trip
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field icon={<CalendarDays className="w-3.5 h-3.5" />} label={`Days · ${days}`}>
            <input type="range" min={1} max={10} value={days} onChange={(e) => setDays(+e.target.value)}
              className="w-full accent-[var(--coral)]" />
          </Field>
          <Field icon={<Users className="w-3.5 h-3.5" />} label={`Travelers · ${group}`}>
            <input type="range" min={1} max={10} value={group} onChange={(e) => setGroup(+e.target.value)}
              className="w-full accent-[var(--coral)]" />
          </Field>
          <Field icon={<Sun className="w-3.5 h-3.5" />} label="Pace">
            <Pills options={["Relaxed", "Balanced", "Packed"] as Vibe[]} value={vibe} onChange={setVibe} />
          </Field>
          <Field icon={<Wallet className="w-3.5 h-3.5" />} label="Tier">
            <Pills options={["Budget", "Comfort", "Luxury"] as Tier[]} value={tier} onChange={setTier} />
          </Field>
        </div>
      </motion.div>

      {/* BUDGET CALCULATOR */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: "var(--coral)" }}>
          Budget calculator
        </div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-4 inline-flex items-center gap-2">
          <Calculator className="w-5 h-5" /> Estimated total
        </h3>

        <div className="rounded-3xl border bg-card p-5 md:p-6 shadow-soft relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10 blur-3xl"
            style={{ background: "var(--gradient-warm)" }} />

          <div className="grid md:grid-cols-3 gap-5 relative">
            <div className="md:col-span-2">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Total trip cost</div>
              <div className="font-display text-4xl md:text-5xl font-bold tracking-tight">{inr(costs.total)}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {days} day{days > 1 ? "s" : ""} · {group} traveler{group > 1 ? "s" : ""} · {costs.rooms} room{costs.rooms > 1 ? "s" : ""} · {tier} tier
              </div>

              <div className="grid sm:grid-cols-3 gap-2 mt-5">
                {breakdown.map((b) => {
                  const pct = (b.value / costs.total) * 100;
                  return (
                    <div key={b.key} className="rounded-2xl border bg-background/60 p-3">
                      <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                        <span style={{ color: b.color }}>{b.icon}</span> {b.key}
                      </div>
                      <div className="font-bold">{inr(b.value)}</div>
                      <div className="h-1.5 rounded-full bg-secondary mt-2 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: b.color }} />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">{pct.toFixed(0)}% of trip</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl p-5 text-white" style={{ backgroundImage: "var(--gradient-warm)" }}>
              <div className="text-[11px] uppercase tracking-widest opacity-80 mb-1">Per person</div>
              <div className="text-3xl font-bold">{inr(costs.perPerson)}</div>
              <div className="text-[11px] uppercase tracking-widest opacity-80 mt-4 mb-1">Per day</div>
              <div className="text-2xl font-semibold">{inr(costs.perDay)}</div>
              <div className="mt-4 pt-4 border-t border-white/20 text-[11px] space-y-1 opacity-90">
                <div>Stay: {inr(costs.stayPerNight)} / night × {costs.nights} × {costs.rooms} room</div>
                <div>Food: {inr(costs.foodPerPersonDay)} / person / day</div>
                <div>Travel: shared by ~3 / cab</div>
              </div>
            </div>
          </div>

          {stay && (
            <div className="mt-5 rounded-2xl border bg-background/60 p-4 flex items-center gap-3 relative">
              <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center text-white shrink-0"
                style={{ background: stay.accent }}>
                <BedDouble className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium" style={{ color: stay.accent }}>
                  Recommended {tier.toLowerCase()} stay · {stay.type}
                </div>
                <div className="font-semibold truncate">{stay.name}</div>
                <div className="text-xs text-muted-foreground">{stay.area} · {stay.distance}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold">{inr(stay.price)}</div>
                <div className="text-[10px] text-muted-foreground">/ night</div>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground mt-2">
          Estimates only. Actual costs vary by season, availability and personal style.
        </p>
      </motion.div>

      {/* ITINERARY */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: "var(--coral)" }}>
          Day-by-day itinerary
        </div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1 inline-flex items-center gap-2">
          <CalendarDays className="w-5 h-5" /> Your {days}-day plan
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          {vibe} pace · routes start from <span className="font-medium text-foreground">{stay?.name ?? d.popularAreas[0]}</span>
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {itinerary.map((day, di) => (
            <motion.div key={day.day}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: di * 0.05 }}
              className="rounded-3xl border bg-card p-5 shadow-soft relative overflow-hidden">
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

              <div className="space-y-3 relative">
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
                          style={{
                            background: s.mode === "walk"
                              ? "color-mix(in oklab, var(--teal) 15%, transparent)"
                              : "color-mix(in oklab, var(--coral) 15%, transparent)",
                            color: s.mode === "walk" ? "var(--teal)" : "var(--coral)"
                          }}>
                          {s.mode === "walk" ? "Walkable" : "Drive"}
                        </span>
                      </div>
                      <div className="font-semibold leading-tight">{s.name}</div>
                      <div className="text-xs text-muted-foreground mb-2">{s.area} · {s.km} km · {s.blurb}</div>
                      <div className="flex gap-2">
                        <a href={dirUrl(origin, dest, "driving")} target="_blank" rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                          style={{ backgroundImage: "var(--gradient-warm)" }}>
                          <Navigation className="w-3.5 h-3.5" /> Drive
                        </a>
                        <a href={dirUrl(origin, dest, "walking")} target="_blank" rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-muted">
                          <Footprints className="w-3.5 h-3.5" /> Walk
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-background/40 p-3">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1.5 mb-2">
        {icon} {label}
      </div>
      {children}
    </div>
  );
}

function Pills<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition ${active ? "text-white" : "bg-secondary hover:bg-muted text-foreground"}`}
            style={active ? { backgroundImage: "var(--gradient-warm)" } : undefined}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}