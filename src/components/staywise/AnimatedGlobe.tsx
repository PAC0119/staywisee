import globeImg from "@/assets/globe-hero.jpg";

export function AnimatedGlobe({ size = 480 }: { size?: number }) {
  return (
    <div
      className="relative pointer-events-none select-none"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* glow */}
      <div className="absolute inset-0 rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle, var(--coral) 0%, transparent 60%)" }} />

      {/* globe image */}
      <div className="absolute inset-6 rounded-full overflow-hidden shadow-glow-coral animate-float">
        <img
          src={globeImg}
          alt=""
          className="w-full h-full object-cover animate-spin-slow"
          style={{ animationDuration: "60s" }}
        />
      </div>

      {/* orbit ring 1 */}
      <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none"
          stroke="var(--saffron)" strokeWidth="0.3" strokeOpacity="0.6"
          className="animate-dash" />
      </svg>
      {/* orbit ring 2 */}
      <svg className="absolute inset-0 w-full h-full animate-spin-reverse" viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="49" ry="20" fill="none"
          stroke="var(--teal)" strokeWidth="0.25" strokeOpacity="0.7"
          className="animate-dash" />
      </svg>

      {/* floating pins */}
      {[
        { top: "12%", left: "30%", color: "var(--coral)", delay: "0s" },
        { top: "60%", left: "78%", color: "var(--saffron)", delay: "1.2s" },
        { top: "78%", left: "20%", color: "var(--teal)", delay: "0.6s" },
        { top: "30%", left: "82%", color: "var(--pink)", delay: "1.8s" },
      ].map((p, i) => (
        <div key={i} className="absolute animate-float"
          style={{ top: p.top, left: p.left, animationDelay: p.delay }}>
          <div className="relative">
            <div className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ background: p.color, width: 16, height: 16 }} />
            <div className="w-4 h-4 rounded-full ring-2 ring-white/80"
              style={{ background: p.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
