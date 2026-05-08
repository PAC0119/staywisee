import { motion } from "framer-motion";
import {
  Hotel, Home, Tent, Mountain, Building2, Heart, Phone, MessageCircle,
  Globe2, MapPin, Shield, Sparkles, Utensils, Car, BadgeCheck, ArrowRight, Bookmark
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { TripPlan } from "./SearchPanel";
import { PROPERTIES } from "./properties";
import { Itinerary } from "./Itinerary";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

const stayTypes = [
  { key: "hotel", icon: Hotel, name: "Hotels", best: "Comfort & service", price: "1,800–6,000", color: "var(--coral)" },
  { key: "hostel", icon: Tent, name: "Hostels", best: "Solo & friends", price: "450–1,200", color: "var(--teal)" },
  { key: "homestay", icon: Home, name: "Homestays", best: "Local experience", price: "1,200–3,500", color: "var(--saffron)" },
  { key: "dharam", icon: Mountain, name: "Dharamshalas", best: "Spiritual & budget", price: "200–800", color: "var(--pink)" },
  { key: "apt", icon: Building2, name: "Serviced apt.", best: "Long stays / family", price: "2,500–8,000", color: "var(--coral)" },
];

export function Results({ plan }: { plan: TripPlan }) {
  const perNight = Math.round(plan.budget / plan.days);
  const food = Math.round(plan.budget * 0.18);
  const travel = Math.round(plan.budget * 0.12);
  const stay = plan.budget - food - travel;

  return (
    <div id="results" className="relative py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 text-coral text-xs font-medium mb-3"
               style={{ backgroundColor: "oklch(0.72 0.17 25 / 0.1)", color: "var(--coral)" }}>
            <Sparkles className="w-3.5 h-3.5" /> Your smart stay plan
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {plan.days} days in <span className="text-gradient-warm">{plan.destination}</span>,
            <br className="hidden md:block" /> built for {plan.people} traveler{plan.people > 1 ? "s" : ""} · {plan.group.join(" + ").toLowerCase()}.
          </h2>
        </motion.div>

        {/* Strategy + Budget */}
        <div className="grid lg:grid-cols-3 gap-5 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-3xl p-6 md:p-8 text-white shadow-lift overflow-hidden relative"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          >
            <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full liquid-bg opacity-30 blur-2xl" />
            <div className="relative">
              <div className="text-xs uppercase tracking-widest text-white/70 mb-2">Best plan for you</div>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
                {plan.splitStay
                  ? `Parents in a clean budget hotel near city center · you in a nearby hostel (1.2 km away)`
                  : `${plan.days - 1} nights in a vetted ${plan.comfort.toLowerCase()} homestay + 1 night boutique hotel`}
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {["Breakfast included", "1.2 km apart", "Veg food street nearby", "Women-friendly area"].map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur">
                    {t}
                  </span>
                ))}
              </div>
              <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
                See why we recommended this <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-6 bg-card shadow-soft border"
          >
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Smart budget split</div>
            <div className="text-3xl font-bold mb-4">{inr(plan.budget)}<span className="text-sm font-normal text-muted-foreground"> total</span></div>
            <BudgetBar label="Stay" value={stay} total={plan.budget} color="var(--coral)" />
            <BudgetBar label="Food" value={food} total={plan.budget} color="var(--saffron)" />
            <BudgetBar label="Local travel" value={travel} total={plan.budget} color="var(--teal)" />
            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground flex justify-between">
              <span>Per night avg.</span>
              <span className="font-semibold text-foreground">{inr(perNight)}</span>
            </div>
          </motion.div>
        </div>

        {/* Stay type comparison */}
        <SectionTitle eyebrow="Compare stay types" title="Which type fits this trip?" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {stayTypes.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="lift rounded-2xl bg-card border p-5 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                   style={{ background: `${s.color}20`, color: s.color }}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="font-semibold mb-1">{s.name}</div>
              <div className="text-xs text-muted-foreground mb-3">{s.best}</div>
              <div className="text-xs"><span className="text-muted-foreground">Per night </span><span className="font-semibold">₹{s.price}</span></div>
            </motion.div>
          ))}
        </div>

        {/* Recommended properties */}
        <SectionTitle eyebrow="Recommended for you" title="Verified stays nearby" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {RECS.map((r, i) => <PropertyCard key={r.name} r={r} index={i} days={plan.days} />)}
        </div>

        {/* Split stay planner */}
        <SectionTitle eyebrow="Split-stay planner" title="Creative budget-saving combos" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {SPLIT_PLANS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="lift rounded-2xl p-5 text-white relative overflow-hidden"
              style={{ background: p.bg }}
            >
              <div className="text-xs uppercase tracking-widest opacity-80 mb-2">{p.tag}</div>
              <div className="font-semibold text-lg leading-snug mb-2">{p.title}</div>
              <div className="text-xs opacity-90">{p.savings}</div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/15 blur-xl" />
            </motion.div>
          ))}
        </div>

        {/* Day-by-day itinerary */}
        <Itinerary plan={plan} />

        {/* Food + Travel */}
        <div className="grid md:grid-cols-2 gap-5">
          <InfoCard
            icon={<Utensils className="w-5 h-5" />}
            title="Food-based areas in Jaipur"
            color="var(--saffron)"
            items={[
              ["Vegetarian thali", "M.I. Road · Bapu Bazar"],
              ["Local street food", "Johari Bazar · Chandpole"],
              ["Breakfast hotels", "C-Scheme · Civil Lines"],
              ["Homemade meals", "Bani Park homestays"],
            ]}
          />
          <InfoCard
            icon={<Car className="w-5 h-5" />}
            title="Local travel cost estimator"
            color="var(--teal)"
            items={[
              ["Stay → Amber Fort", "Auto ₹220 · Cab ₹380"],
              ["Stay → Hawa Mahal", "Auto ₹90 · Cab ₹160"],
              ["Stay → Railway Stn.", "Auto ₹70 · Cab ₹140"],
              ["Stay → City Palace", "Auto ₹110 · Cab ₹190"],
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <div className="text-xs uppercase tracking-widest text-coral font-medium mb-1"
           style={{ color: "var(--coral)" }}>{eyebrow}</div>
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h3>
    </div>
  );
}

function BudgetBar({ label, value, total, color }:
  { label: string; value: number; total: number; color: string }) {
  const pct = (value / total) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{inr(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

const RECS = PROPERTIES;

function PropertyCard({ r, index, days }: { r: typeof PROPERTIES[number]; index: number; days: number }) {
  const safetyAvg = +(r.safety.reduce((a, s) => a + s.score, 0) / r.safety.length).toFixed(1);
  const cleanAvg = +(r.cleanliness.reduce((a, s) => a + s.score, 0) / r.cleanliness.length).toFixed(1);
  const total = r.price * days;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.08 }}
      className="lift rounded-3xl bg-card border overflow-hidden"
    >
      <div className="h-32 relative" style={{ background: `linear-gradient(135deg, ${r.accent}, var(--pink))` }}>
        <div className="absolute inset-0 liquid-bg opacity-30 mix-blend-overlay" />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[11px] font-semibold text-foreground inline-flex items-center gap-1">
          <BadgeCheck className="w-3 h-3 text-teal" style={{ color: "var(--teal)" }} /> Verified
        </div>
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform">
          <Bookmark className="w-4 h-4" />
        </button>
        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/30 text-white text-[10px] font-medium backdrop-blur">
          {r.type}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <Link
            to="/stay/$slug"
            params={{ slug: r.slug }}
            className="font-semibold leading-tight hover:text-coral transition-colors"
            style={{ color: undefined }}
          >
            {r.name}
          </Link>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary font-medium">{r.badge}</span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3" /> {r.area} · {r.distance}
        </div>
        <div className="flex items-center gap-3 text-[11px] mb-4">
          <Score icon={<Shield className="w-3 h-3" />} label="Safety" value={safetyAvg} />
          <Score icon={<Sparkles className="w-3 h-3" />} label="Clean" value={cleanAvg} />
          <Score icon={<Utensils className="w-3 h-3" />} label="Food" value={r.food} small />
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <div className="text-2xl font-bold">{inr(r.price)}</div>
          <div className="text-xs text-muted-foreground">/ night · total {inr(total)}</div>
        </div>
        <Link
          to="/stay/$slug"
          params={{ slug: r.slug }}
          className="block text-center text-xs font-semibold py-2.5 rounded-xl text-white shadow-glow-coral mb-2"
          style={{ backgroundImage: "var(--gradient-warm)" }}
        >
          View details & contact →
        </Link>
        <div className="grid grid-cols-3 gap-2">
          <ActionBtn icon={<Globe2 className="w-3.5 h-3.5" />} label="Site" />
          <ActionBtn icon={<MessageCircle className="w-3.5 h-3.5" />} label="WhatsApp" />
          <ActionBtn icon={<Phone className="w-3.5 h-3.5" />} label="Call" />
        </div>
      </div>
    </motion.div>
  );
}

function Score({ icon, label, value, small }:
  { icon: React.ReactNode; label: string; value: number | string; small?: boolean }) {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      {icon}
      <span className={small ? "" : "font-medium text-foreground"}>{value}{typeof value === "number" ? "" : ""}</span>
      {!small && <span className="text-muted-foreground">{label}</span>}
    </div>
  );
}

function ActionBtn({ icon, label, highlight }:
  { icon: React.ReactNode; label: string; highlight?: boolean }) {
  return (
    <button
      className={`text-xs font-medium py-2 rounded-xl inline-flex items-center justify-center gap-1 transition-all ${
        highlight ? "text-white shadow-glow-coral" : "bg-secondary hover:bg-muted"
      }`}
      style={highlight ? { backgroundImage: "var(--gradient-warm)" } : undefined}
    >
      {icon} {label}
    </button>
  );
}

const SPLIT_PLANS = [
  { tag: "Save 28%", title: "2 nights hostel + 2 nights boutique hotel",
    savings: "Best for solo flexible travelers", bg: "linear-gradient(135deg, var(--coral), var(--pink))" },
  { tag: "Family combo", title: "Parents in hotel + you in nearby hostel",
    savings: "1.2 km apart · saves ₹4,200", bg: "linear-gradient(135deg, var(--saffron), var(--coral))" },
  { tag: "Local + comfort", title: "Homestay 2 nights + city hotel 1 night",
    savings: "Authentic + reliable mix", bg: "linear-gradient(135deg, var(--teal), var(--pink))" },
  { tag: "Spiritual", title: "Dharamshala near temple + market hotel",
    savings: "Saves up to ₹3,800", bg: "linear-gradient(135deg, var(--pink), var(--saffron))" },
];

function InfoCard({ icon, title, items, color }:
  { icon: React.ReactNode; title: string; items: [string, string][]; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-card border p-6 shadow-soft"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>
      <div className="space-y-2">
        {items.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export { Heart };
