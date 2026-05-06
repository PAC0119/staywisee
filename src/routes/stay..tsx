import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, Bookmark, Car, CheckCircle2, Compass, Globe2,
  MapPin, MessageCircle, Phone, Shield, Sparkles, Utensils, XCircle, Clock, Star
} from "lucide-react";
import { getProperty, PROPERTIES } from "@/components/staywise/properties";

export const Route = createFileRoute("/stay/$slug")({
  loader: ({ params }) => {
    const property = getProperty(params.slug);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.property;
    return {
      meta: p
        ? [
            { title: `${p.name} — ${p.area}, ${p.city} · StayWise` },
            { name: "description", content: p.tagline },
            { property: "og:title", content: `${p.name} · StayWise` },
            { property: "og:description", content: p.tagline },
          ]
        : [{ title: "Stay not found · StayWise" }],
    };
  },
  notFoundComponent: NotFound,
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-destructive mb-3">{error.message}</p>
        <button onClick={reset} className="text-coral underline" style={{ color: "var(--coral)" }}>
          Try again
        </button>
      </div>
    </div>
  ),
  component: StayDetails,
});

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const avg = (xs: { score: number }[]) =>
  +(xs.reduce((a, x) => a + x.score, 0) / xs.length).toFixed(1);

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center bg-background">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold mb-2">Stay not found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find that property. It may have been removed or unverified.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium shadow-glow-coral"
          style={{ backgroundImage: "var(--gradient-warm)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to search
        </Link>
      </div>
    </div>
  );
}

function StayDetails() {
  const { property: p } = Route.useLoaderData();
  const safetyAvg = avg(p.safety);
  const cleanAvg = avg(p.cleanliness);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${p.accent}, var(--pink))` }}
      >
        <div className="absolute inset-0 liquid-bg opacity-30 mix-blend-overlay" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-blob" />

        <div className="relative max-w-6xl mx-auto px-5 md:px-10 pt-8 pb-16 md:pb-24">
          {/* Top nav */}
          <div className="flex items-center justify-between mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back to results
            </Link>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified {p.contact.verifiedOn}
              </span>
              <button className="w-9 h-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-2.5 py-1 rounded-md bg-black/25 text-[11px] font-medium backdrop-blur mb-3">
              {p.type} · {p.badge}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-4">
              {p.name}
            </h1>
            <p className="text-lg text-white/85 mb-5 max-w-2xl">{p.tagline}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {p.area}, {p.city}</span>
              <span className="inline-flex items-center gap-1.5"><Shield className="w-4 h-4" /> Safety {safetyAvg}/10</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Clean {cleanAvg}/10</span>
              <span className="inline-flex items-center gap-1.5"><Utensils className="w-4 h-4" /> {p.food}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 py-12 grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">
          {/* About */}
          <Block eyebrow="About this stay" title="Why travelers pick it">
            <p className="text-muted-foreground leading-relaxed">{p.description}</p>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-2">
              {p.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4" style={{ color: "var(--teal)" }} />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </Block>

          {/* Distance */}
          <Block
            eyebrow="Location & travel"
            title="Distance to key places"
            icon={<Compass className="w-5 h-5" />}
          >
            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Place</th>
                    <th className="text-right px-4 py-3 font-medium">Distance</th>
                    <th className="text-right px-4 py-3 font-medium">Auto</th>
                    <th className="text-right px-4 py-3 font-medium">Cab</th>
                  </tr>
                </thead>
                <tbody>
                  {p.distances.map((d, i) => (
                    <motion.tr
                      key={d.place}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="border-t hover:bg-secondary/40"
                    >
                      <td className="px-4 py-3 font-medium">{d.place}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{d.km} km</td>
                      <td className="px-4 py-3 text-right">{inr(d.auto)}</td>
                      <td className="px-4 py-3 text-right">{inr(d.cab)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 inline-flex items-center gap-1">
              <Car className="w-3 h-3" /> Estimates based on local average fares · last refreshed {p.contact.verifiedOn}
            </p>
          </Block>

          {/* Meals */}
          <Block
            eyebrow="Food & meals"
            title="What's included"
            icon={<Utensils className="w-5 h-5" />}
          >
            <div className="grid sm:grid-cols-2 gap-3">
              {p.meals.map((m) => (
                <div
                  key={m.label}
                  className={`rounded-2xl border p-4 ${
                    m.included ? "bg-teal/5" : ""
                  }`}
                  style={m.included ? { background: "color-mix(in oklab, var(--teal) 8%, transparent)" } : undefined}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold">{m.label}</div>
                    {m.included ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--teal)" }}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Included
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <XCircle className="w-3.5 h-3.5" /> On request
                      </span>
                    )}
                  </div>
                  {m.note && <div className="text-xs text-muted-foreground">{m.note}</div>}
                </div>
              ))}
            </div>
          </Block>

          {/* Safety */}
          <Block
            eyebrow="Safety breakdown"
            title={`Safety score ${safetyAvg}/10`}
            icon={<Shield className="w-5 h-5" />}
          >
            <div className="space-y-3">
              {p.safety.map((s, i) => (
                <ScoreRow key={s.label} item={s} index={i} color="var(--teal)" />
              ))}
            </div>
          </Block>

          {/* Cleanliness */}
          <Block
            eyebrow="Cleanliness breakdown"
            title={`Cleanliness score ${cleanAvg}/10`}
            icon={<Sparkles className="w-5 h-5" />}
          >
            <div className="space-y-3">
              {p.cleanliness.map((s, i) => (
                <ScoreRow key={s.label} item={s} index={i} color="var(--coral)" />
              ))}
            </div>
          </Block>

          {/* Host note */}
          <div
            className="rounded-3xl p-6 border-l-4"
            style={{ background: "var(--secondary)", borderLeftColor: "var(--saffron)" }}
          >
            <div className="text-xs uppercase tracking-widest font-medium mb-2" style={{ color: "var(--saffron)" }}>
              Note from the host
            </div>
            <p className="italic text-foreground leading-relaxed">"{p.hostNote}"</p>
          </div>
        </div>

        {/* RIGHT — sticky contact card */}
        <aside className="lg:sticky lg:top-6 self-start">
          <div className="rounded-3xl bg-card border shadow-lift p-6">
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-3xl font-bold">{inr(p.price)}</div>
              <div className="text-sm text-muted-foreground">/ night</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
              <Star className="w-3.5 h-3.5" style={{ color: "var(--saffron)" }} />
              {((safetyAvg + cleanAvg) / 2).toFixed(1)} overall · {p.badge}
            </div>

            {/* Verified strip */}
            <div className="rounded-2xl border p-3 mb-4 space-y-2 text-xs">
              <VerifyRow icon={<Globe2 className="w-3.5 h-3.5" />} label="Official website" ok={!!p.contact.website} />
              <VerifyRow icon={<Phone className="w-3.5 h-3.5" />} label="Phone verified" ok={!!p.contact.phone} />
              <VerifyRow icon={<MessageCircle className="w-3.5 h-3.5" />} label="WhatsApp available" ok={!!p.contact.whatsapp} />
              <VerifyRow icon={<MapPin className="w-3.5 h-3.5" />} label="Google Maps location" ok={!!p.contact.maps} />
              <div className="flex items-center justify-between pt-2 border-t text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Last verified</span>
                <span className="font-medium text-foreground">{p.contact.verifiedOn}</span>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="space-y-2">
              {p.contact.whatsapp && (
                <a
                  href={`https://wa.me/${p.contact.whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white font-semibold shadow-glow-coral"
                  style={{ backgroundImage: "var(--gradient-warm)" }}
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp host
                </a>
              )}
              <div className="grid grid-cols-2 gap-2">
                {p.contact.phone && (
                  <a
                    href={`tel:${p.contact.phone}`}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-secondary hover:bg-muted font-medium text-sm"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                )}
                {p.contact.website && (
                  <a
                    href={p.contact.website}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-secondary hover:bg-muted font-medium text-sm"
                  >
                    <Globe2 className="w-4 h-4" /> Site
                  </a>
                )}
              </div>
              {p.contact.maps && (
                <a
                  href={p.contact.maps}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl border font-medium text-sm hover:bg-secondary"
                >
                  <MapPin className="w-4 h-4" /> Open in Maps
                </a>
              )}
            </div>

            <div className="mt-4 text-[11px] text-muted-foreground text-center">
              StayWise never charges booking fees. You pay the host directly.
            </div>
          </div>
        </aside>
      </section>

      {/* Other stays */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 pb-20">
        <div className="text-xs uppercase tracking-widest font-medium mb-2" style={{ color: "var(--coral)" }}>
          Also nearby
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Other verified stays</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {PROPERTIES.filter((o) => o.slug !== p.slug).map((o) => (
            <Link
              key={o.slug}
              to="/stay/$slug"
              params={{ slug: o.slug }}
              className="lift rounded-2xl border bg-card p-5 block"
            >
              <div className="text-[11px] font-medium mb-2" style={{ color: o.accent }}>
                {o.type}
              </div>
              <div className="font-semibold mb-1">{o.name}</div>
              <div className="text-xs text-muted-foreground mb-3">{o.area} · {o.distance}</div>
              <div className="text-sm font-bold">{inr(o.price)}<span className="font-normal text-muted-foreground"> / night</span></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Block({
  eyebrow, title, icon, children,
}: { eyebrow: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
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

function ScoreRow({
  item, index, color,
}: { item: { label: string; score: number; note: string }; index: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border p-4"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="font-medium text-sm">{item.label}</div>
        <div className="text-sm font-bold" style={{ color }}>{item.score}/10</div>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${item.score * 10}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <div className="text-xs text-muted-foreground">{item.note}</div>
    </motion.div>
  );
}

function VerifyRow({ icon, label, ok }: { icon: React.ReactNode; label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-muted-foreground">{icon}{label}</span>
      {ok ? (
        <CheckCircle2 className="w-4 h-4" style={{ color: "var(--teal)" }} />
      ) : (
        <XCircle className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  );
}
