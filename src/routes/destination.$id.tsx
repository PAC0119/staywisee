import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft, MapPin, Compass, Utensils, Sparkles, Shield,
  Footprints, Navigation, Star, Wallet, Users, Share2, MessageCircle, Info
} from "lucide-react";
import { DESTINATIONS, type Destination } from "@/components/staywise/destinations";
import { DestinationPlanner } from "@/components/staywise/DestinationPlanner";
import { PricePrediction } from "@/components/staywise/PricePrediction";

export const Route = createFileRoute("/destination/$id")({
  loader: ({ params }) => {
    const dest = DESTINATIONS.find((d) => d.id === params.id);
    if (!dest) throw notFound();
    return { dest };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.dest;
    return {
      meta: d
        ? [
            { title: `${d.name} stay guide — areas, food & top stays · StayWise` },
            { name: "description", content: `${d.tagline}. Best areas, attractions, food highlights and example stay strategies for ${d.name}.` },
            { property: "og:title", content: `${d.name} · StayWise` },
            { property: "og:description", content: d.tagline },
          ]
        : [{ title: "Destination not found · StayWise" }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center bg-background">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold mb-2">Destination not found</h1>
        <p className="text-muted-foreground mb-6">We don't have a guide for that one yet.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium shadow-glow-coral"
          style={{ backgroundImage: "var(--gradient-warm)" }}>
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-destructive mb-3">{error.message}</p>
        <button onClick={reset} className="underline" style={{ color: "var(--coral)" }}>Try again</button>
      </div>
    </div>
  ),
  component: DestinationPage,
});

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const range = (r: [number, number]) => `${inr(r[0])} – ${inr(r[1])}`;
const dirUrl = (origin: string, dest: string, mode: "driving" | "walking") =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=${mode}`;

// ---------- Season hardcoding (peak / shoulder months) ----------
const SEASONS: Record<string, { peak: number[]; shoulder: number[] }> = {
  jaipur:    { peak: [10,11,12,1,2,3], shoulder: [9,4] },
  udaipur:   { peak: [10,11,12,1,2,3], shoulder: [9,4] },
  jodhpur:   { peak: [10,11,12,1,2,3], shoulder: [9,4] },
  jaisalmer: { peak: [10,11,12,1,2], shoulder: [9,3] },
  ahmedabad: { peak: [11,12,1,2], shoulder: [10,3] },
  goa:       { peak: [11,12,1,2], shoulder: [10,3] },
  manali:    { peak: [4,5,6,9,10,12], shoulder: [3,11] },
  shimla:    { peak: [4,5,6,10,12], shoulder: [3,9,11] },
  varanasi:  { peak: [10,11,12,1,2,3], shoulder: [9,4] },
  mumbai:    { peak: [11,12,1,2], shoulder: [10,3] },
  bangalore: { peak: [10,11,12,1,2], shoulder: [3,9] },
  bali:      { peak: [4,5,6,7,8,9], shoulder: [3,10] },
  vietnam:   { peak: [11,12,1,2,3], shoulder: [4,10] },
  singapore: { peak: [2,3,4,7,8], shoulder: [5,6,9] },
};
function seasonStatus(id: string): { label: string; color: string } {
  const s = SEASONS[id];
  const m = new Date().getMonth() + 1;
  if (!s) return { label: "Year-round", color: "var(--teal)" };
  if (s.peak.includes(m))     return { label: "Best now",        color: "#16a34a" };
  if (s.shoulder.includes(m)) return { label: "Shoulder season", color: "var(--saffron)" };
  return { label: "Off season", color: "hsl(var(--muted-foreground))" };
}

function DestinationPage() {
  const { dest: d } = Route.useLoaderData() as { dest: Destination };
  const [showActionBar, setShowActionBar] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowActionBar(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const season = seasonStatus(d.id);
  const avgPrice = Math.round((d.budget.hotel[0] + d.budget.hotel[1]) / 2);

  const onShare = async () => {
    const url = window.location.href;
    const data = { title: `${d.name} · StayWise`, text: d.tagline, url };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch {}
    }
    try { await navigator.clipboard.writeText(url); alert("Link copied!"); } catch {}
  };
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`Hi, I need help planning a trip to ${d.name}`)}`;

  return (
    <div className="min-h-screen bg-background">
      {/* STICKY TOP CONTEXT BAR */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-5 md:px-10 h-12 flex items-center justify-between gap-3 text-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 font-medium hover:opacity-80">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold truncate">{d.emoji} {d.name}</span>
            <span className="hidden sm:inline text-muted-foreground">·</span>
            <span
              className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold text-white"
              style={{ background: season.color }}
            >
              {season.label}
            </span>
            <span className="hidden md:inline text-muted-foreground">·</span>
            <span className="hidden md:inline text-xs text-muted-foreground">avg {inr(avgPrice)}/night</span>
          </div>
          <span
            className="sm:hidden inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
            style={{ background: season.color }}
          >
            {season.label}
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden text-white"
        style={{ backgroundImage: "var(--gradient-warm)" }}>
        <div className="absolute inset-0 liquid-bg opacity-30 mix-blend-overlay" />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl animate-blob" />

        <div className="relative max-w-6xl mx-auto px-5 md:px-10 pt-8 pb-16 md:pb-24">
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back to search
            </Link>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
              <Compass className="w-3.5 h-3.5" /> {d.region} · {d.country}
            </span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="text-5xl mb-3">{d.emoji}</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-3">{d.name}</h1>
            <p className="text-lg text-white/90 mb-5 max-w-2xl">{d.tagline}</p>
            <div className="flex flex-wrap gap-2">
              {d.types.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] font-medium capitalize">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 -mt-10 relative z-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={<Wallet className="w-4 h-4" />} label="Hotel / night" value={range(d.budget.hotel)} />
        <Stat icon={<Wallet className="w-4 h-4" />} label="Hostel / night" value={range(d.budget.hostel)} />
        <Stat icon={<Utensils className="w-4 h-4" />} label="Food / day" value={range(d.foodPerDay)} />
        <Stat icon={<Users className="w-4 h-4" />} label="Best for" value={d.bestFor.slice(0, 2).join(", ")} />
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {/* AREAS */}
          <Block eyebrow="Where to stay" title="Popular areas" icon={<MapPin className="w-5 h-5" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              {d.popularAreas.map((area, i) => (
                <motion.div key={area}
                  initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border bg-card p-4 hover:shadow-lift transition">
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Area {String(i + 1).padStart(2, "0")}</div>
                  <div className="font-semibold">{area}</div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> {d.safetyNote}
            </p>
          </Block>

          {/* ATTRACTIONS */}
          <Block eyebrow="Things to do" title="Top attractions" icon={<Sparkles className="w-5 h-5" />}>
            <div className="space-y-3">
              {d.attractions.map((at, i) => {
                const origin = `${d.popularAreas[0] || d.name}, ${d.name}`;
                const target = `${at.name}, ${d.name}`;
                return (
                  <motion.div key={at.name}
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                    className="rounded-2xl border bg-card p-4 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{at.name}</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">{at.area}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{at.blurb}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {at.tags.slice(0, 4).map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full border text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex md:flex-col md:items-end gap-2 md:gap-1 shrink-0">
                      <div className="text-xs text-muted-foreground">{at.km} km · {at.minutes}m</div>
                      <div className="flex items-center gap-1.5">
                        <a href={dirUrl(origin, target, "driving")} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary hover:bg-muted text-[11px] font-medium">
                          <Navigation className="w-3 h-3" /> Drive
                        </a>
                        <a href={dirUrl(origin, target, "walking")} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary hover:bg-muted text-[11px] font-medium">
                          <Footprints className="w-3 h-3" /> Walk
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Block>

          {/* PRICE PREDICTION */}
          <PricePrediction d={d} />

          {/* FOOD */}
          <Block eyebrow="Food highlights" title="What to eat & where" icon={<Utensils className="w-5 h-5" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              {d.foodHighlights.map((f, i) => (
                <motion.div key={f.dish + i}
                  initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border-l-4 bg-secondary/40 p-4"
                  style={{ borderLeftColor: "var(--saffron)" }}>
                  <div className="font-semibold mb-0.5">{f.dish}</div>
                  <div className="text-xs text-muted-foreground">{f.where}</div>
                </motion.div>
              ))}
            </div>
          </Block>

          {/* STAY STRATEGIES */}
          <Block eyebrow="Smart stay engine" title="Example stay strategies" icon={<Star className="w-5 h-5" />}>
            <div className="text-xs text-muted-foreground mb-3 inline-flex items-center gap-1">
              Open to split-stay combinations <SplitStayInfo city={d.name} />
            </div>
            <div className="space-y-3">
              {d.stays.map((st, i) => (
                <motion.div key={st.name + i}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border bg-card p-5 hover:shadow-lift transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium mb-1" style={{ color: st.accent }}>
                        {st.type} · {st.badge}
                      </div>
                      <div className="font-semibold mb-0.5">{st.name}</div>
                      <div className="text-xs text-muted-foreground">{st.area} · {st.distance}</div>
                      <div className="text-xs text-muted-foreground mt-1.5 inline-flex items-center gap-1.5">
                        <Utensils className="w-3 h-3" /> {st.food}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold">{inr(st.price)}</div>
                      <div className="text-[11px] text-muted-foreground">/ night</div>
                      {st.slug && (
                        <Link to="/stay/$slug" params={{ slug: st.slug }}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium underline-offset-2 hover:underline"
                          style={{ color: "var(--coral)" }}>
                          View details →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/" className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold shadow-glow-coral"
              style={{ backgroundImage: "var(--gradient-warm)" }}>
              <Compass className="w-4 h-4" /> Plan a stay in {d.name}
            </Link>
          </Block>

          {/* PLANNER + BUDGET CALCULATOR */}
          <DestinationPlanner d={d} />
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-6 self-start space-y-4">
          <div className="rounded-3xl bg-card border shadow-lift p-6">
            <div className="text-xs uppercase tracking-widest font-medium mb-2" style={{ color: "var(--coral)" }}>
              Local travel costs
            </div>
            <div className="space-y-2">
              {d.travel.map((t) => (
                <div key={t.to} className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0">
                  <span className="text-muted-foreground truncate pr-2">{t.to}</span>
                  <span className="font-medium">
                    {t.auto > 0 && <span>{inr(t.auto)} auto · </span>}
                    {inr(t.cab)} cab
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-card border p-6">
            <div className="text-xs uppercase tracking-widest font-medium mb-2" style={{ color: "var(--teal)" }}>
              Best for
            </div>
            <div className="flex flex-wrap gap-1.5">
              {d.bestFor.map((b) => (
                <span key={b} className="text-[11px] px-2 py-1 rounded-full bg-secondary font-medium">{b}</span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-6 border-l-4"
            style={{ background: "var(--secondary)", borderLeftColor: "var(--saffron)" }}>
            <div className="text-xs uppercase tracking-widest font-medium mb-2" style={{ color: "var(--saffron)" }}>
              Safety note
            </div>
            <p className="text-sm leading-relaxed">{d.safetyNote}</p>
          </div>
        </aside>
      </section>

      {/* OTHER DESTINATIONS */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 pb-20">
        <div className="text-xs uppercase tracking-widest font-medium mb-2" style={{ color: "var(--coral)" }}>
          More in {d.group}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Explore nearby destinations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DESTINATIONS.filter((o) => o.group === d.group && o.id !== d.id).slice(0, 8).map((o) => (
            <Link key={o.id} to="/destination/$id" params={{ id: o.id }}
              className="lift rounded-2xl border bg-card p-4 block">
              <div className="text-2xl mb-1">{o.emoji}</div>
              <div className="font-semibold text-sm leading-tight">{o.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{o.tagline}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* STICKY BOTTOM ACTION BAR */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          showActionBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-3xl mx-auto m-3 rounded-2xl bg-card/95 backdrop-blur border shadow-lift p-2 flex items-center gap-2">
          <a
            href={`/?destination=${encodeURIComponent(d.name)}#planner`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-glow-coral"
            style={{ backgroundImage: "var(--gradient-warm)" }}
          >
            <Compass className="w-4 h-4" /> Plan a trip to {d.name} →
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary hover:bg-muted text-foreground"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={onShare}
            aria-label="Share"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary hover:bg-muted text-foreground"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Block({ eyebrow, title, icon, children }: { eyebrow: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="text-xs uppercase tracking-widest font-medium mb-1" style={{ color: "var(--coral)" }}>
        {eyebrow}
      </div>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 inline-flex items-center gap-2">
        {icon} {title}
      </h2>
      {children}
    </motion.div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-soft">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1.5 mb-1">
        {icon} {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

export function SplitStayInfo({ city }: { city: string }) {
  return (
    <span className="relative inline-block group align-middle">
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ml-1"
        style={{ background: "var(--secondary)", color: "var(--coral)" }}
        aria-label="What is split-stay?"
      >
        <Info className="w-3 h-3" />
      </button>
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-2 w-72 p-3 rounded-xl bg-popover border shadow-lift text-xs text-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
        <span className="font-semibold block mb-1" style={{ color: "var(--coral)" }}>Split-stay example · {city}</span>
        e.g. Parents stay at Hotel Amer Heritage (₹2,400/night) · You stay at The Pink Door Hostel (₹650/night) · Combined saving: ₹1,750/night vs booking everyone in the hotel.
      </span>
    </span>
  );
}