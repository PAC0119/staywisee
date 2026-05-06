import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, Sparkles, ShieldCheck, Map } from "lucide-react";
import { AnimatedGlobe } from "@/components/staywise/AnimatedGlobe";
import { WalkingCharacters } from "@/components/staywise/WalkingCharacters";
import { SearchPanel, type TripPlan } from "@/components/staywise/SearchPanel";
import { LiquidLoader } from "@/components/staywise/LiquidLoader";
import { Results } from "@/components/staywise/Results";

export const Route = createFileRoute("/")({
  component: Index,
});

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
          <button className="hidden md:inline-flex px-4 py-2 rounded-full text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition">
            Open app
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-gradient-hero overflow-hidden pt-28 pb-20 md:pb-32">
        {/* decorative blobs */}
        <div className="absolute top-32 -left-32 w-96 h-96 liquid-bg rounded-full opacity-30 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl animate-blob"
             style={{ background: "var(--teal)", animationDelay: "-4s" }} />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div className="text-white reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5 text-saffron" style={{ color: "var(--saffron)" }} />
              Smart stay decision engine for India
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-5">
              Find the <span className="text-gradient-warm">smartest stay plan</span> for your trip.
            </h1>
            <p className="text-base md:text-lg text-white/75 max-w-xl mb-8">
              Hotels, hostels, homestays, dharamshalas and local stays — matched to your budget,
              food, people and purpose. No noise. Just the right plan.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Budget-aware", "Food-aware", "Split-stay smart", "Verified contacts"].map(t => (
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
            <div className="relative w-full md:mt-32">
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
