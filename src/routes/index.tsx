import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, Sparkles, ShieldCheck, Map, Quote } from "lucide-react";
import { AnimatedGlobe } from "@/components/staywise/AnimatedGlobe";
import { WalkingCharacters } from "@/components/staywise/WalkingCharacters";
import { SearchPanel, type TripPlan } from "@/components/staywise/SearchPanel";
import { LiquidLoader } from "@/components/staywise/LiquidLoader";
import { Results } from "@/components/staywise/Results";
import { DESTINATIONS, destinationsByGroup, type Destination } from "@/components/staywise/destinations";
import { seasonStatusFor, priceSavingsFor } from "@/components/staywise/PricePrediction";

export const Route = createFileRoute("/")({
  component: Index,
});

// ---------- Category mapping for filter chips ----------
const CATEGORY_IDS: Record<string, string[]> = {
  Beach: ["goa", "bali", "maldives", "thailand", "srilanka", "sri-lanka", "gokarna"],
  "Hill station": ["manali", "shimla", "dharamshala", "kasol", "mount-abu", "saputara", "mussoorie"],
  Heritage: ["jaipur", "jodhpur", "udaipur", "jaisalmer", "varanasi", "agra", "ahmedabad", "hampi"],
  Spiritual: ["varanasi", "rishikesh", "haridwar", "pushkar", "dwarka", "somnath", "ajmer", "tirupati"],
  Adventure: ["manali", "kasol", "rishikesh", "ranthambore", "gir"],
  Wildlife: ["ranthambore", "gir", "corbett"],
  International: ["bali", "vietnam", "singapore", "dubai", "thailand", "malaysia", "maldives", "srilanka", "sri-lanka", "nepal", "bhutan", "paris", "london", "tokyo", "hanoi", "bangkok"],
};
const CATEGORIES = ["All", "Beach", "Hill station", "Heritage", "Spiritual", "Adventure", "Wildlife", "International", "Budget (under ₹2k/night)"];
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function destMatchesCategory(d: Destination, cat: string): boolean {
  if (cat === "All") return true;
  if (cat === "Budget (under ₹2k/night)") return d.budget.hotel[0] < 2000;
  if (cat === "International") return d.country !== "India" || CATEGORY_IDS.International.includes(d.id);
  const ids = CATEGORY_IDS[cat] || [];
  if (ids.includes(d.id)) return true;
  // Also match by types/tagline keywords as a soft fallback
  const t = d.types.join(" ") + " " + d.tagline.toLowerCase();
  const kw: Record<string, string[]> = {
    Beach: ["beach", "island"],
    "Hill station": ["hill", "mountain"],
    Heritage: ["heritage", "havelis"],
    Spiritual: ["spiritual", "temple", "ghat"],
    Adventure: ["adventure", "trek"],
    Wildlife: ["wildlife", "safari"],
  };
  return (kw[cat] || []).some((k) => t.includes(k));
}

function DestinationExplorer({ onPick }: { onPick: (name: string) => void }) {
  const groups = destinationsByGroup();
  const order = ["Rajasthan", "Gujarat", "India Popular", "Bali", "Vietnam", "Singapore", "International"];
  const [cat, setCat] = useState("All");
  const [month, setMonth] = useState<number>(new Date().getMonth());

  const filtered = cat === "All" ? null : DESTINATIONS.filter((d) => destMatchesCategory(d, cat));

  return (
    <section className="relative py-16 md:py-24 bg-card border-y">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="max-w-2xl mb-6">
          <div className="text-xs uppercase tracking-widest font-medium mb-2" style={{ color: "var(--coral)" }}>
            Explore destinations
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Plan a stay for <span className="text-gradient-warm">any city</span>.
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            From Rajasthan & Gujarat to Bali, Vietnam, Singapore and beyond — pick a destination to start.
          </p>
        </div>

        {/* Filter chips — sticky under the heading */}
        <div className="sticky top-0 z-20 -mx-5 md:-mx-10 px-5 md:px-10 py-3 mb-6 bg-card border-b">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mb-1 pb-1">
            {CATEGORIES.map((c) => {
              const active = c === cat;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`shrink-0 inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    active ? "text-white border-transparent shadow-glow-coral" : "bg-background text-foreground border-border hover:bg-secondary"
                  }`}
                  style={active ? { backgroundImage: "var(--gradient-warm)" } : undefined}
                >
                  {c}
                </button>
              );
            })}
          </div>
          {/* Month selector — preview "Best time" badge for any month */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              Preview month
            </span>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {MONTH_LABELS.map((m, i) => {
                const active = i === month;
                return (
                  <button
                    key={m}
                    onClick={() => setMonth(i)}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                      active ? "text-white border-transparent shadow-glow-coral" : "bg-background text-foreground border-border hover:bg-secondary"
                    }`}
                    style={active ? { backgroundImage: "var(--gradient-warm)" } : undefined}
                    aria-pressed={active}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            {month !== new Date().getMonth() && (
              <button
                onClick={() => setMonth(new Date().getMonth())}
                className="text-[11px] underline-offset-2 hover:underline text-muted-foreground"
              >
                Reset to this month
              </button>
            )}
          </div>
        </div>

        {filtered ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map((d) => <DestCard key={d.id} d={d} onPick={onPick} month={month} />)}
            {filtered.length === 0 && (
              <div className="col-span-full text-sm text-muted-foreground py-8 text-center">
                No destinations match yet — try another category.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {order.filter((g) => groups[g]?.length).map((g) => (
              <div key={g}>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">{g}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {groups[g].slice(0, 12).map((d) => <DestCard key={d.id} d={d} onPick={onPick} month={month} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground mt-6">
          {DESTINATIONS.length}+ destinations · plus smart fallback for any city you type.
        </p>
      </div>
    </section>
  );
}

function DestCard({ d, onPick, month }: { d: Destination; onPick: (name: string) => void; month?: number }) {
  const m = month ?? new Date().getMonth();
  const season = seasonStatusFor(d, m);
  const savings = priceSavingsFor(d, m);
  const badge = season === "great"
    ? { label: "Great time to go", bg: "rgba(22,163,74,0.12)", color: "#15803d", ring: "rgba(22,163,74,0.35)" }
    : season === "decent"
    ? { label: "Decent time to go", bg: "rgba(217,119,6,0.12)", color: "#b45309", ring: "rgba(217,119,6,0.35)" }
    : null;
  return (
    <div className="lift rounded-2xl border bg-background p-4 text-left transition-all flex flex-col relative pb-10">
      <button onClick={() => onPick(d.name)} className="text-left">
        <div className="text-2xl mb-1">{d.emoji}</div>
        <div className="font-semibold text-sm leading-tight">{d.name}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{d.tagline}</div>
      </button>
      <Link to="/destination/$id" params={{ id: d.id }}
        className="mt-2 text-[10px] font-medium underline-offset-2 hover:underline"
        style={{ color: "var(--coral)" }}>
        View guide →
      </Link>
      <div className="absolute bottom-2 right-2 left-2 flex items-center justify-end gap-1 flex-wrap">
        {savings && (
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border"
            style={{ background: "rgba(20,184,166,0.10)", color: "#0f766e", borderColor: "rgba(20,184,166,0.35)" }}
            title={`Estimated stay savings vs peak season in ${MONTH_LABELS[m]}`}
          >
            Save {savings.low}–{savings.high}%
          </span>
        )}
        {badge && (
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border"
            style={{ background: badge.bg, color: badge.color, borderColor: badge.ring }}
            title={`${badge.label} — ${MONTH_LABELS[m]}`}
          >
            {badge.label}
          </span>
        )}
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  { quote: "Saved ₹2,200 on our Udaipur trip by doing split-stay. Parents in a heritage hotel, we stayed at a hostel 800m away.", name: "Priya S.", city: "Mumbai" },
  { quote: "Found a Jain-friendly homestay in Varanasi in under 2 minutes. No other site even has that filter.", name: "Ravi M.", city: "Ahmedabad" },
  { quote: "Manali in October — StayWise told me to go shoulder season. Saved a lot, zero crowds.", name: "Ankit D.", city: "Delhi" },
];

function Index() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TripPlan | null>(null);

  const handleSearch = (p: TripPlan) => {
    setPlan(p);
    setLoading(true);
    // wait for liquid loader to finish
    setTimeout(() => {
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* NAV */}
      <header className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-glow-coral"
                 style={{ backgroundImage: "var(--gradient-warm)" }}>
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">StayWise</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
            <a href="#how" className="hover:text-white transition">How it works</a>
            <a href="#types" className="hover:text-white transition">Stay types</a>
            <a href="#trust" className="hover:text-white transition">Trust</a>
          </nav>
          <button
            onClick={() => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex px-4 py-2 rounded-full text-sm font-semibold text-white shadow-glow-coral hover:opacity-95 transition"
            style={{ backgroundImage: "var(--gradient-warm)" }}
          >
            Plan my stay →
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-gradient-hero overflow-hidden pt-28 pb-20 md:pb-32">
        {/* decorative blobs (static — animation removed for perf) */}
        <div className="absolute top-32 -left-32 w-96 h-96 liquid-bg rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl pointer-events-none"
             style={{ background: "var(--teal)" }} />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div className="text-white reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5 text-saffron" style={{ color: "var(--saffron)" }} />
              Smart stay decision engine · India + International
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-5">
              Find the <span className="text-gradient-warm">smartest stay plan</span> for any destination.
            </h1>
            <p className="text-base md:text-lg text-white/75 max-w-xl mb-8">
              Hotels, hostels, homestays, local stays, dharamshalas and split-stay plans — matched to
              your budget, people, food, comfort and purpose. From Jaipur to Bali, Singapore to Goa.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Any destination", "Budget-aware", "Food-aware", "Split-stay smart", "Verified contacts"].map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full glass text-white/90">{t}</span>
              ))}
            </div>
          </div>

          {/* Right: globe + search */}
          <div className="relative flex flex-col items-center">
            <div className="absolute -top-10 -right-10 hidden md:block">
              <AnimatedGlobe size={420} />
            </div>
            <div className="md:hidden mb-6">
              <AnimatedGlobe size={260} />
            </div>
            <div id="planner" className="relative w-full md:mt-32 scroll-mt-24">
              <SearchPanel onSearch={handleSearch} />
            </div>
          </div>
        </div>

        {/* Walking characters strip */}
        <div className="relative h-32 mt-10">
          <WalkingCharacters width={180} duration={70} />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section id="trust" className="py-10 bg-card border-y">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, label: "Verified properties", value: "12,400+" },
            { icon: Map, label: "Cities covered", value: "180" },
            { icon: Sparkles, label: "Smart plans built", value: "85k" },
            { icon: Compass, label: "Avg. trip savings", value: "₹3,200" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="inline-flex w-10 h-10 rounded-xl items-center justify-center mb-2"
                   style={{ background: "var(--secondary)", color: "var(--coral)" }}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 bg-background border-b">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: "var(--coral)" }}>
            Travellers say
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-card border border-l-4 p-5 shadow-soft"
                style={{ borderLeftColor: "var(--coral)" }}
              >
                <Quote className="w-4 h-4 mb-2" style={{ color: "var(--coral)" }} />
                <p className="text-sm leading-relaxed text-foreground">{t.quote}</p>
                <div className="text-xs text-muted-foreground mt-3 font-medium">— {t.name}, {t.city}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS — appears after search */}
      <AnimatePresence>
        {plan && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Results plan={plan} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HOW IT WORKS (when no plan yet) */}
      {!plan && (
        <DestinationExplorer onPick={(name) => {
          // Prefill search by scrolling up; user re-submits with their preferences.
          const el = document.querySelector<HTMLInputElement>('input[placeholder^="Jaipur"]');
          if (el) { el.focus(); el.value = name; el.dispatchEvent(new Event("input", { bubbles: true })); }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }} />
      )}

      {!plan && (
        <section id="how" className="relative py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-10">
            <div className="max-w-2xl mb-12">
              <div className="text-xs uppercase tracking-widest font-medium mb-2"
                   style={{ color: "var(--coral)" }}>How StayWise thinks</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Not a booking engine. <span className="text-gradient-warm">A travel companion.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  step: "01", title: "Tell us your trip",
                  desc: "Destination, days, people, budget, food, comfort — keep it real.",
                  color: "var(--coral)",
                },
                {
                  step: "02", title: "We design the strategy",
                  desc: "Hotel + hostel? Homestay + dharamshala? We pick the smartest mix.",
                  color: "var(--saffron)",
                },
                {
                  step: "03", title: "Direct, verified contact",
                  desc: "Official site, WhatsApp, phone — no middlemen, no hidden fees.",
                  color: "var(--teal)",
                },
              ].map((c, i) => (
                <motion.div
                  key={c.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="lift rounded-3xl bg-card border p-7 relative overflow-hidden"
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
                       style={{ background: c.color }} />
                  <div className="font-display text-4xl font-bold mb-4" style={{ color: c.color }}>
                    {c.step}
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom companions */}
          <div className="relative h-32 mt-16">
            <WalkingCharacters width={150} duration={80} reverse />
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-card border-t py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                 style={{ backgroundImage: "var(--gradient-warm)" }}>
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold">StayWise</span>
            <span className="text-xs text-muted-foreground ml-2">Smart stays · made for India</span>
          </div>
          <div className="text-xs text-muted-foreground">© 2026 StayWise. Plan smart, travel free.</div>
        </div>
      </footer>

      {/* LOADER */}
      <AnimatePresence>
        {loading && (
          <LiquidLoader onDone={() => setLoading(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
