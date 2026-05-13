import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Cloud, CloudRain, Snowflake, Thermometer, Star, Users, Wallet, Sparkles } from "lucide-react";
import type { Destination } from "./destinations";

type Level = "Low" | "Mid" | "High";
type Weather = "Hot" | "VeryHot" | "Pleasant" | "Cold" | "Cool" | "Rainy" | "Snowy" | "Warm" | "Dry" | "Changing";
export type MonthData = {
  price: Level;
  crowd: Level;
  weather: Weather;
  score: 1 | 2 | 3 | 4 | 5;
  tip: string;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DATA: Record<string, MonthData[]> = {
  jaipur: [
    { price:"Mid", crowd:"High", weather:"Pleasant", score:4, tip:"Peak season — book havelis 3 weeks ahead" },
    { price:"Mid", crowd:"High", weather:"Pleasant", score:4, tip:"Ideal weather, festivals, slightly cheaper than Jan" },
    { price:"Mid", crowd:"Mid", weather:"Warm", score:3, tip:"Getting hot, shoulder crowds" },
    { price:"Low", crowd:"Low", weather:"Hot", score:2, tip:"Very hot, best deals on hotels" },
    { price:"Low", crowd:"Low", weather:"VeryHot", score:1, tip:"Avoid — 44°C+ heat, most touristy spots shut early" },
    { price:"Low", crowd:"Low", weather:"Hot", score:1, tip:"Pre-monsoon heat, some rain begins" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:2, tip:"Monsoon — havelis look magical but roads flood" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:2, tip:"Heavy rains, cheap but limited outdoor sightseeing" },
    { price:"Low", crowd:"Mid", weather:"Pleasant", score:3, tip:"Post-monsoon green city, rising demand" },
    { price:"Mid", crowd:"High", weather:"Pleasant", score:5, tip:"Best month — Dussehra magic, perfect weather" },
    { price:"High", crowd:"High", weather:"Pleasant", score:5, tip:"Top season — Pushkar Fair nearby, book far ahead" },
    { price:"High", crowd:"High", weather:"Cool", score:4, tip:"Christmas-New Year surge, foggy mornings" },
  ],
  goa: [
    { price:"High", crowd:"High", weather:"Pleasant", score:4, tip:"Post-NYE, still busy and expensive but gorgeous" },
    { price:"High", crowd:"High", weather:"Pleasant", score:5, tip:"Best month — Carnival, perfect beach weather" },
    { price:"Mid", crowd:"Mid", weather:"Warm", score:4, tip:"Shoulder sweet spot — warm, prices dropping" },
    { price:"Mid", crowd:"Low", weather:"Hot", score:3, tip:"Hot but quiet — good for budget beach trips" },
    { price:"Low", crowd:"Low", weather:"Hot", score:2, tip:"Pre-monsoon, some shacks closing" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:2, tip:"Monsoon starts — beaches shut, but lush & cheap" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:1, tip:"Heaviest rains — inner Goa only, beaches off-limits" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:1, tip:"Still monsoon, prices rock-bottom" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:2, tip:"Rains easing, early shacks reopening" },
    { price:"Mid", crowd:"Mid", weather:"Pleasant", score:4, tip:"Great timing — season opening, deals still available" },
    { price:"High", crowd:"High", weather:"Pleasant", score:5, tip:"Peak begins — Sunburn Festival, book 6 weeks ahead" },
    { price:"High", crowd:"High", weather:"Pleasant", score:4, tip:"Christmas-NYE madness — most expensive week of year" },
  ],
  manali: [
    { price:"Low", crowd:"Low", weather:"Snowy", score:3, tip:"Snow beauty but Rohtang often blocked — check road status" },
    { price:"Low", crowd:"Low", weather:"Snowy", score:3, tip:"Deep winter — Solang snow activities, very few tourists" },
    { price:"Low", crowd:"Low", weather:"Cold", score:3, tip:"Snow melting, roads opening — adventure seekers only" },
    { price:"Mid", crowd:"Mid", weather:"Cold", score:3, tip:"Spring thaw, Beas river rising, pleasant Old Manali" },
    { price:"Mid", crowd:"High", weather:"Pleasant", score:4, tip:"Rohtang opens, crowds build — book early" },
    { price:"High", crowd:"High", weather:"Pleasant", score:4, tip:"Peak rush — Solang, Sissu, everything open" },
    { price:"High", crowd:"High", weather:"Rainy", score:3, tip:"Monsoon landslide risk on Rohtang — check before going" },
    { price:"High", crowd:"High", weather:"Rainy", score:3, tip:"Busy but rainy — Spiti road often blocked" },
    { price:"Mid", crowd:"Mid", weather:"Pleasant", score:5, tip:"Best month — apple season, crisp air, manageable crowds" },
    { price:"Mid", crowd:"Mid", weather:"Cool", score:5, tip:"Golden foliage, clear skies — ideal trekking window" },
    { price:"Low", crowd:"Low", weather:"Cold", score:3, tip:"First snowfall — dramatic but Rohtang closing soon" },
    { price:"Low", crowd:"Low", weather:"Snowy", score:3, tip:"Christmas in snow — romantic but limit mobility" },
  ],
  varanasi: [
    { price:"Mid", crowd:"High", weather:"Cold", score:4, tip:"Makar Sankranti kite festival — spiritual peak, misty ghats" },
    { price:"Mid", crowd:"High", weather:"Cool", score:5, tip:"Maha Shivaratri — once-in-a-year experience on the ghats" },
    { price:"Mid", crowd:"Mid", weather:"Warm", score:4, tip:"Holi on the ghats — one of India's most intense celebrations" },
    { price:"Low", crowd:"Low", weather:"Hot", score:2, tip:"Heat building — ghats quiet, boats cheap, very hot by noon" },
    { price:"Low", crowd:"Low", weather:"VeryHot", score:1, tip:"Extreme heat 45°C — only for devoted pilgrims" },
    { price:"Low", crowd:"Low", weather:"Hot", score:1, tip:"Pre-monsoon humidity, some flooding near ghats" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:2, tip:"Ganga floods ghats — dramatic but limited access" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:2, tip:"Monsoon peak — ghats submerged, inner city only" },
    { price:"Low", crowd:"Mid", weather:"Rainy", score:3, tip:"Rains easing, Ganga full — beautiful boat rides" },
    { price:"Mid", crowd:"High", weather:"Pleasant", score:5, tip:"Navratri + Dussehra — the best cultural window" },
    { price:"High", crowd:"High", weather:"Pleasant", score:5, tip:"Dev Deepawali — Ganga lit by a million lamps, book 2 months out" },
    { price:"Mid", crowd:"Mid", weather:"Cold", score:4, tip:"Cool, quiet ghats — peaceful and photogenic" },
  ],
  bali: [
    { price:"Low", crowd:"Low", weather:"Rainy", score:3, tip:"Wet season but lush green — cheapest month, inner Bali magic" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:3, tip:"Still rainy but Nyepi (Day of Silence) is unforgettable" },
    { price:"Mid", crowd:"Mid", weather:"Changing", score:4, tip:"Rains easing — rice terraces at peak green" },
    { price:"Mid", crowd:"Mid", weather:"Pleasant", score:4, tip:"Shoulder gem — warm, drying, prices still reasonable" },
    { price:"Mid", crowd:"Mid", weather:"Pleasant", score:5, tip:"Perfect weather starts — not yet crowded, great value" },
    { price:"High", crowd:"High", weather:"Dry", score:4, tip:"Dry season peak — Ubud at its best, book ahead" },
    { price:"High", crowd:"High", weather:"Dry", score:4, tip:"School holiday surge — Kuta and Seminyak packed" },
    { price:"High", crowd:"High", weather:"Dry", score:4, tip:"Highest prices — but beaches, temples, sunsets are flawless" },
    { price:"Mid", crowd:"Mid", weather:"Dry", score:5, tip:"Best month — dry, post-holiday, incredible value vs July" },
    { price:"Mid", crowd:"Mid", weather:"Changing", score:4, tip:"Rains beginning but light — rice planting season begins" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:3, tip:"Wet season starts — dramatic skies, cheap hotels" },
    { price:"High", crowd:"High", weather:"Rainy", score:3, tip:"Christmas rush — expensive despite rain, Seminyak busy" },
  ],
  singapore: [
    { price:"Mid", crowd:"Mid", weather:"Rainy", score:3, tip:"Post-Christmas quiet — good hotel deals, some rain" },
    { price:"Mid", crowd:"High", weather:"Warm", score:4, tip:"Chinese New Year — spectacular light displays citywide" },
    { price:"Mid", crowd:"Mid", weather:"Warm", score:4, tip:"Least rainy month — ideal for Gardens by the Bay, Sentosa" },
    { price:"Mid", crowd:"Mid", weather:"Warm", score:4, tip:"Great weather window before school holidays" },
    { price:"Mid", crowd:"Mid", weather:"Warm", score:4, tip:"Vesak Day — temples lit up, peaceful atmosphere" },
    { price:"High", crowd:"High", weather:"Warm", score:3, tip:"School holidays — families everywhere, prices up 30%" },
    { price:"High", crowd:"High", weather:"Warm", score:3, tip:"National Day prep — good fireworks, heavy crowds" },
    { price:"High", crowd:"High", weather:"Warm", score:4, tip:"National Day 9th Aug — spectacular fireworks at Marina Bay" },
    { price:"Mid", crowd:"Mid", weather:"Warm", score:4, tip:"Post-holiday calm — great deals, good weather" },
    { price:"High", crowd:"High", weather:"Warm", score:3, tip:"F1 Grand Prix — hotel prices triple race weekend, book far ahead" },
    { price:"Mid", crowd:"Mid", weather:"Rainy", score:4, tip:"Deepavali light-up on Serangoon Road — unmissable for Indians" },
    { price:"High", crowd:"High", weather:"Rainy", score:3, tip:"Christmas at Orchard Road is magical but very expensive" },
  ],
};

// Climate profile fallback for destinations not explicitly listed.
type Profile = "rajasthan" | "hill" | "beach-india" | "spiritual" | "metro-india" | "tropical" | "international";
function profileFor(d: Destination): Profile {
  const id = d.id;
  if (DATA[id]) return "rajasthan";
  const t = d.types.map((x) => x.toLowerCase()).join(",");
  if (d.group === "Rajasthan" || d.group === "Gujarat") return "rajasthan";
  if (/hill|mountain/.test(t)) return "hill";
  if (/beach|island/.test(t)) return "beach-india";
  if (/spiritual|heritage/.test(t) && d.country === "India") return "spiritual";
  if (d.country === "India") return "metro-india";
  if (/beach|island|tropical/.test(t)) return "tropical";
  return "international";
}
const TEMPLATES: Record<Profile, MonthData[]> = {
  rajasthan: DATA.jaipur,
  hill: DATA.manali,
  "beach-india": DATA.goa,
  spiritual: DATA.varanasi,
  "metro-india": [
    { price:"Mid", crowd:"High", weather:"Pleasant", score:4, tip:"Cool, dry — great sightseeing weather" },
    { price:"Mid", crowd:"High", weather:"Pleasant", score:4, tip:"Comfortable temperatures, festival season tail" },
    { price:"Mid", crowd:"Mid", weather:"Warm", score:3, tip:"Warming up, shoulder pricing" },
    { price:"Low", crowd:"Low", weather:"Hot", score:2, tip:"Hot afternoons — good hotel deals" },
    { price:"Low", crowd:"Low", weather:"VeryHot", score:1, tip:"Peak heat — plan indoor activities" },
    { price:"Low", crowd:"Low", weather:"Hot", score:2, tip:"Pre-monsoon humidity, cheap stays" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:2, tip:"Monsoon — atmospheric but wet" },
    { price:"Low", crowd:"Low", weather:"Rainy", score:2, tip:"Heavy rains continue, lowest prices" },
    { price:"Mid", crowd:"Mid", weather:"Pleasant", score:3, tip:"Rains easing, demand picking up" },
    { price:"Mid", crowd:"High", weather:"Pleasant", score:5, tip:"Festival season — book early" },
    { price:"High", crowd:"High", weather:"Pleasant", score:5, tip:"Peak season — perfect weather, highest prices" },
    { price:"High", crowd:"High", weather:"Cool", score:4, tip:"Year-end surge — book in advance" },
  ],
  tropical: DATA.bali,
  international: DATA.singapore,
};
function dataFor(d: Destination): MonthData[] {
  return DATA[d.id] ?? TEMPLATES[profileFor(d)];
}

export type SeasonStatus = "great" | "decent" | "off";
export function seasonStatusFor(d: Destination, monthIndex: number = new Date().getMonth()): SeasonStatus {
  const months = dataFor(d);
  const ranked = months
    .map((m, i) => ({ i, score: m.score, price: m.price }))
    .sort((a, b) => b.score - a.score || (a.price === "Low" ? -1 : 1));
  const top3 = new Set(ranked.slice(0, 3).map((r) => r.i));
  const next3 = new Set(ranked.slice(3, 6).map((r) => r.i));
  if (top3.has(monthIndex)) return "great";
  if (next3.has(monthIndex)) return "decent";
  return "off";
}

const LEVEL_COLORS: Record<Level, { dot: string; bg: string; ring: string; label: string }> = {
  Low:  { dot: "#16a34a", bg: "rgba(22,163,74,0.10)",  ring: "rgba(22,163,74,0.45)",  label: "Low"  },
  Mid:  { dot: "#d97706", bg: "rgba(217,119,6,0.10)",  ring: "rgba(217,119,6,0.45)",  label: "Mid"  },
  High: { dot: "#dc2626", bg: "rgba(220,38,38,0.10)",  ring: "rgba(220,38,38,0.50)",  label: "High" },
};
function priceLevelToScore(p: Level) { return p === "Low" ? 1 : p === "Mid" ? 2 : 3; }
function levelBar(p: Level) { return p === "Low" ? "33%" : p === "Mid" ? "66%" : "100%"; }

function WeatherIcon({ w, className }: { w: Weather; className?: string }) {
  const cn = className ?? "w-4 h-4";
  switch (w) {
    case "Snowy": return <Snowflake className={cn} />;
    case "Cold":
    case "Cool": return <Cloud className={cn} />;
    case "Rainy": return <CloudRain className={cn} />;
    case "Hot":
    case "VeryHot":
    case "Warm":
    case "Dry": return <Sun className={cn} />;
    case "Changing": return <Cloud className={cn} />;
    default: return <Thermometer className={cn} />;
  }
}

function weatherLabel(w: Weather) {
  return w === "VeryHot" ? "Very hot" : w;
}

export function PricePrediction({ d }: { d: Destination }) {
  const months = dataFor(d);
  const initial = months.reduce((best, m, i) => (m.score > months[best].score ? i : best), 0);
  const [sel, setSel] = useState(initial);
  const m = months[sel];
  const c = LEVEL_COLORS[m.price];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: "var(--coral)" }}>
        Smart timing
      </div>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight inline-flex items-center gap-2">
        <Sparkles className="w-5 h-5" /> Best time & price prediction
      </h2>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Based on season, weather, crowd patterns and local events
      </p>

      {/* 12-month row */}
      <div className="-mx-1 overflow-x-auto pb-2">
        <div className="flex gap-2 px-1 min-w-max md:min-w-0 md:grid md:grid-cols-12">
          {months.map((mo, i) => {
            const cc = LEVEL_COLORS[mo.price];
            const active = i === sel;
            return (
              <button
                key={i}
                onClick={() => setSel(i)}
                className="rounded-xl border bg-card px-2 py-2 text-center transition hover:shadow-soft min-w-[64px] md:min-w-0"
                style={{
                  background: active ? cc.bg : undefined,
                  borderColor: active ? cc.ring : undefined,
                  borderWidth: active ? 2 : 1,
                }}
                aria-pressed={active}
              >
                <div className="text-[11px] font-semibold">{MONTHS[i]}</div>
                <div className="my-1 mx-auto w-2.5 h-2.5 rounded-full" style={{ background: cc.dot }} />
                <div className="text-[10px] text-muted-foreground">{cc.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-4 rounded-2xl border bg-card p-5"
          style={{ borderLeft: `4px solid ${c.dot}` }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{MONTHS[sel]}</span>
              <span className="text-xs text-muted-foreground">in {d.name}</span>
            </div>
            <div className="flex items-center gap-1" aria-label={`Score ${m.score} of 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4" style={{
                  color: i < m.score ? "var(--saffron)" : "hsl(var(--muted-foreground) / 0.3)",
                  fill: i < m.score ? "var(--saffron)" : "transparent",
                }} />
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <Metric icon={<Wallet className="w-3.5 h-3.5" />} label="Price level" value={m.price}
              barWidth={levelBar(m.price)} color={LEVEL_COLORS[m.price].dot} />
            <Metric icon={<Users className="w-3.5 h-3.5" />} label="Crowd level" value={m.crowd}
              barWidth={levelBar(m.crowd)} color={LEVEL_COLORS[m.crowd].dot} />
            <div className="rounded-xl border p-3">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1.5 mb-1">
                <WeatherIcon w={m.weather} className="w-3.5 h-3.5" /> Weather
              </div>
              <div className="font-semibold capitalize">{weatherLabel(m.weather)}</div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed">
            <span className="font-semibold" style={{ color: "var(--coral)" }}>Tip · </span>{m.tip}
          </p>
        </motion.div>
      </AnimatePresence>

      <p className="text-[11px] text-muted-foreground mt-3">
        Price levels are relative seasonal indices, not actual quotes. Actual prices vary by property and availability.
      </p>
    </motion.div>
  );
}

function Metric({ icon, label, value, barWidth, color }: { icon: React.ReactNode; label: string; value: string; barWidth: string; color: string }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1.5 mb-1">
        {icon} {label}
      </div>
      <div className="font-semibold">{value}</div>
      <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: barWidth, background: color }} />
      </div>
    </div>
  );
}

// silence unused import warning if Sparkles unused in some bundler configs
void priceLevelToScore;