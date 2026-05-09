import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Wallet, Search, Sparkles, Check, Globe2 } from "lucide-react";
import {
  DESTINATIONS, suggestDestinations, findDestination, genericDestination,
  type Destination,
} from "./destinations";

export type TripPlan = {
  destination: string;        // free text — what user typed
  destinationId: string;      // resolved id (or "custom-xxx")
  resolved: Destination;      // resolved destination (real or generic fallback)
  days: number;
  people: number;
  budget: number;
  group: string[];
  purpose: string[];
  food: string[];
  comfort: string;
  splitStay: boolean;
};

const groups = ["Solo", "Friends", "Family", "Couple", "Parents", "Office"];
const purposes = ["Sightseeing", "Spiritual", "Backpacking", "Family vacation", "Work", "Food trip"];
const foods = ["Vegetarian", "Non-veg", "Jain", "Vegan", "Local explorer"];
const comforts = ["Basic", "Balanced", "Comfortable", "Luxury"];

// trending defaults to show before the user types
const TRENDING = ["jaipur", "goa", "manali", "bali", "vietnam", "singapore"]
  .map((id) => DESTINATIONS.find((d) => d.id === id)!).filter(Boolean);

export function SearchPanel({ onSearch }: { onSearch: (p: TripPlan) => void }) {
  const [destinationText, setDestinationText] = useState("Jaipur");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [plan, setPlan] = useState<Omit<TripPlan, "destination" | "destinationId" | "resolved">>({
    days: 4, people: 3, budget: 18000,
    group: ["Parents", "Family"], purpose: ["Sightseeing"], food: ["Vegetarian"],
    comfort: "Balanced", splitStay: true,
  });

  const update = <K extends keyof typeof plan>(k: K, v: (typeof plan)[K]) =>
    setPlan((p) => ({ ...p, [k]: v }));

  const toggleMulti = (k: "group" | "purpose" | "food", v: string) =>
    setPlan((p) => {
      const arr = p[k];
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
      return { ...p, [k]: next.length ? next : arr };
    });

  const suggestions = useMemo(() => {
    const list = destinationText.trim() ? suggestDestinations(destinationText, 10) : TRENDING;
    // Group suggestions by region label
    const grouped: Record<string, Destination[]> = {};
    for (const d of list) (grouped[d.group] ||= []).push(d);
    return grouped;
  }, [destinationText]);

  // close popover on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (d: Destination) => {
    setDestinationText(d.name);
    setOpen(false);
  };

  const submit = () => {
    const found = findDestination(destinationText);
    const resolved = found ?? genericDestination(destinationText || "Your trip");
    onSearch({
      destination: resolved.name,
      destinationId: resolved.id,
      resolved,
      ...plan,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="glass-light rounded-3xl p-5 md:p-6 shadow-lift w-full max-w-xl"
    >
      <div className="flex items-center gap-2 mb-4 text-xs font-medium text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 text-coral" />
        Smart stay engine · works for any destination
      </div>

      {/* Top inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Destination with autocomplete */}
        <div className="md:col-span-2 relative" ref={wrapRef}>
          <div className="rounded-2xl bg-secondary/60 px-4 py-2.5 border border-transparent focus-within:border-coral transition-colors">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-0.5">
              <MapPin className="w-4 h-4" /> Destination · type any city or place
            </div>
            <input
              value={destinationText}
              onChange={(e) => { setDestinationText(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder="Jaipur, Goa, Bali, Hanoi, Singapore…"
              className="w-full bg-transparent outline-none font-medium text-foreground"
            />
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 left-0 right-0 mt-2 max-h-80 overflow-auto rounded-2xl bg-popover border shadow-lift p-2"
              >
                {Object.keys(suggestions).length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground inline-flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5" />
                    Not in our DB — we'll build a smart generic plan for "{destinationText}"
                  </div>
                ) : (
                  Object.entries(suggestions).map(([group, list]) => (
                    <div key={group} className="mb-1">
                      <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                        {group}
                      </div>
                      <div className="grid grid-cols-1">
                        {list.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => pick(d)}
                            className="text-left px-3 py-2 rounded-xl hover:bg-secondary flex items-center gap-3 transition-colors"
                          >
                            <span className="text-lg">{d.emoji}</span>
                            <span className="flex-1">
                              <span className="font-medium text-sm">{d.name}</span>
                              <span className="block text-[11px] text-muted-foreground truncate">
                                {d.region} · {d.tagline}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Field icon={<Calendar className="w-4 h-4" />} label="Days">
          <input type="number" min={1} max={30} value={plan.days}
            onChange={(e) => update("days", +e.target.value)}
            className="w-full bg-transparent outline-none font-medium" />
        </Field>
        <Field icon={<Users className="w-4 h-4" />} label="People">
          <input type="number" min={1} max={20} value={plan.people}
            onChange={(e) => update("people", +e.target.value)}
            className="w-full bg-transparent outline-none font-medium" />
        </Field>
        <Field icon={<Wallet className="w-4 h-4" />} label={`Budget · ₹${plan.budget.toLocaleString("en-IN")}`}>
          <input type="range" min={3000} max={150000} step={500} value={plan.budget}
            onChange={(e) => update("budget", +e.target.value)}
            className="w-full accent-[var(--coral)] md:col-span-2" />
        </Field>
      </div>

      {/* Chips */}
      <ChipRow label="Who's traveling · pick any" options={groups} multi values={plan.group} onToggle={(v) => toggleMulti("group", v)} />
      <ChipRow label="Purpose · pick any" options={purposes} multi values={plan.purpose} onToggle={(v) => toggleMulti("purpose", v)} />
      <ChipRow label="Food · pick any" options={foods} multi values={plan.food} onToggle={(v) => toggleMulti("food", v)} />
      <ChipRow label="Comfort" options={comforts} value={plan.comfort} onChange={(v) => update("comfort", v)} />

      {/* Split stay */}
      <label className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-secondary/60 cursor-pointer">
        <div>
          <div className="font-medium text-sm">Open to split-stay plans</div>
          <div className="text-xs text-muted-foreground">e.g. parents in hotel, you in nearby hostel</div>
        </div>
        <button
          type="button"
          onClick={() => update("splitStay", !plan.splitStay)}
          className={`relative w-11 h-6 rounded-full transition-colors`}
          style={{ backgroundColor: plan.splitStay ? "var(--coral)" : "var(--muted)" }}
          aria-pressed={plan.splitStay}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${plan.splitStay ? "translate-x-5" : ""}`} />
        </button>
      </label>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={submit}
        className="mt-5 w-full relative overflow-hidden rounded-2xl py-4 font-semibold text-white shadow-glow-coral"
        style={{ backgroundImage: "var(--gradient-warm)" }}
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          Build my smart stay plan
        </span>
        <span className="absolute inset-0 liquid-bg opacity-0 hover:opacity-30 transition-opacity" />
      </motion.button>
    </motion.div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-secondary/60 px-4 py-2.5 border border-transparent focus-within:border-coral transition-colors">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-0.5">
        {icon}{label}
      </div>
      {children}
    </div>
  );
}

type ChipRowProps =
  | { label: string; options: string[]; multi?: false; value: string; onChange: (v: string) => void; values?: never; onToggle?: never }
  | { label: string; options: string[]; multi: true; values: string[]; onToggle: (v: string) => void; value?: never; onChange?: never };

function ChipRow(props: ChipRowProps) {
  const { label, options } = props;
  return (
    <div className="mt-4">
      <div className="text-[11px] font-medium text-muted-foreground mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = props.multi ? props.values.includes(o) : o === props.value;
          return (
            <button
              key={o}
              onClick={() => (props.multi ? props.onToggle(o) : props.onChange(o))}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active ? "text-white shadow-glow-coral" : "bg-secondary text-foreground hover:bg-muted"
              }`}
              style={active ? { backgroundImage: "var(--gradient-warm)" } : undefined}
            >
              {props.multi && active && <Check className="w-3 h-3" />}{o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
