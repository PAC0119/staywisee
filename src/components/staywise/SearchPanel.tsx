import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Wallet, Search, Sparkles } from "lucide-react";

export type TripPlan = {
  destination: string;
  days: number;
  people: number;
  budget: number;
  group: string;
  purpose: string;
  food: string;
  comfort: string;
  splitStay: boolean;
};

const groups = ["Solo", "Friends", "Family", "Couple", "Parents", "Office"];
const purposes = ["Sightseeing", "Spiritual", "Backpacking", "Family vacation", "Work", "Food trip"];
const foods = ["Vegetarian", "Non-veg", "Jain", "Vegan", "Local explorer"];
const comforts = ["Basic", "Balanced", "Comfortable", "Luxury"];

export function SearchPanel({ onSearch }: { onSearch: (p: TripPlan) => void }) {
  const [plan, setPlan] = useState<TripPlan>({
    destination: "Jaipur",
    days: 4,
    people: 3,
    budget: 18000,
    group: "Parents",
    purpose: "Sightseeing",
    food: "Vegetarian",
    comfort: "Balanced",
    splitStay: true,
  });

  const update = <K extends keyof TripPlan>(k: K, v: TripPlan[K]) =>
    setPlan((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="glass-light rounded-3xl p-5 md:p-6 shadow-lift w-full max-w-xl"
    >
      <div className="flex items-center gap-2 mb-4 text-xs font-medium text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 text-coral" />
        Smart stay engine · tell us about your trip
      </div>

      {/* Top inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field icon={<MapPin className="w-4 h-4" />} label="Destination">
          <input
            value={plan.destination}
            onChange={(e) => update("destination", e.target.value)}
            placeholder="Where to?"
            className="w-full bg-transparent outline-none font-medium text-foreground"
          />
        </Field>
        <Field icon={<Calendar className="w-4 h-4" />} label="Days">
          <input
            type="number" min={1} max={30}
            value={plan.days}
            onChange={(e) => update("days", +e.target.value)}
            className="w-full bg-transparent outline-none font-medium"
          />
        </Field>
        <Field icon={<Users className="w-4 h-4" />} label="People">
          <input
            type="number" min={1} max={20}
            value={plan.people}
            onChange={(e) => update("people", +e.target.value)}
            className="w-full bg-transparent outline-none font-medium"
          />
        </Field>
        <Field icon={<Wallet className="w-4 h-4" />} label={`Budget · ₹${plan.budget.toLocaleString("en-IN")}`}>
          <input
            type="range" min={3000} max={80000} step={500}
            value={plan.budget}
            onChange={(e) => update("budget", +e.target.value)}
            className="w-full accent-[var(--coral)]"
          />
        </Field>
      </div>

      {/* Chips */}
      <ChipRow label="Who's traveling" options={groups}
               value={plan.group} onChange={(v) => update("group", v)} />
      <ChipRow label="Purpose" options={purposes}
               value={plan.purpose} onChange={(v) => update("purpose", v)} />
      <ChipRow label="Food" options={foods}
               value={plan.food} onChange={(v) => update("food", v)} />
      <ChipRow label="Comfort" options={comforts}
               value={plan.comfort} onChange={(v) => update("comfort", v)} />

      {/* Split stay */}
      <label className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-secondary/60 cursor-pointer">
        <div>
          <div className="font-medium text-sm">Open to split-stay plans</div>
          <div className="text-xs text-muted-foreground">e.g. parents in hotel, you in nearby hostel</div>
        </div>
        <button
          type="button"
          onClick={() => update("splitStay", !plan.splitStay)}
          className={`relative w-11 h-6 rounded-full transition-colors ${plan.splitStay ? "bg-coral" : "bg-muted"}`}
          style={{ backgroundColor: plan.splitStay ? "var(--coral)" : undefined }}
          aria-pressed={plan.splitStay}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${plan.splitStay ? "translate-x-5" : ""}`} />
        </button>
      </label>

      {/* Search button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSearch(plan)}
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
    <div className="rounded-2xl bg-secondary/60 px-4 py-2.5 border border-transparent focus-within:border-coral transition-colors"
         style={{ borderColor: undefined }}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-0.5">
        {icon}{label}
      </div>
      {children}
    </div>
  );
}

function ChipRow({ label, options, value, onChange }:
  { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-4">
      <div className="text-[11px] font-medium text-muted-foreground mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active
                  ? "text-white shadow-glow-coral"
                  : "bg-secondary text-foreground hover:bg-muted"
              }`}
              style={active ? { backgroundImage: "var(--gradient-warm)" } : undefined}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
