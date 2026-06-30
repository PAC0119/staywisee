import { useEffect, useRef } from "react";

type P = {
  x: number; y: number; z: number; // z = depth 0..1
  vx: number; vy: number;
  r: number; baseA: number; aPhase: number; aSpeed: number;
  kind: "dot" | "plane" | "pin" | "ring";
  rot: number; vr: number;
};

/**
 * Cinematic, travel-themed particle field.
 * - Transparent background (never paints over page bg)
 * - Pointer-events: none, fixed behind content
 * - Depth via size + speed, slow drift, opacity breathing
 * - Subtle parallax response to cursor + scroll
 */
export function CinematicParticles({ density = 60 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const scroll = useRef({ y: 0, ty: 0 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: P[] = [];
    let raf = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pickKind = (): P["kind"] => {
      const r = Math.random();
      if (r < 0.74) return "dot";
      if (r < 0.88) return "plane";
      if (r < 0.96) return "ring";
      return "pin";
    };

    const make = (): P => {
      const z = Math.random(); // 0 = far, 1 = near
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        z,
        vx: rand(-0.12, 0.12) * (0.4 + z),
        vy: rand(-0.08, 0.08) * (0.4 + z),
        r: 0.6 + z * 2.6,
        baseA: 0.08 + z * 0.35,
        aPhase: Math.random() * Math.PI * 2,
        aSpeed: rand(0.0015, 0.006),
        kind: pickKind(),
        rot: Math.random() * Math.PI * 2,
        vr: rand(-0.002, 0.002),
      };
    };

    const seed = () => {
      const count = Math.max(24, Math.round((w * h) / 22000) + density - 40);
      particles = Array.from({ length: Math.min(count, density + 40) }, make);
    };

    resize();
    seed();

    const onResize = () => { resize(); seed(); };
    const onMove = (e: MouseEvent) => { mouse.current.tx = e.clientX; mouse.current.ty = e.clientY; };
    const onScroll = () => { scroll.current.ty = window.scrollY; };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // brand coral hue ~25
    const drawPlane = (p: P, a: number) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(p.vy, p.vx) + Math.PI / 4);
      const s = p.r * 1.6;
      ctx.fillStyle = `oklch(0.62 0.16 25 / ${a})`;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.9, s * 0.7);
      ctx.lineTo(0, s * 0.3);
      ctx.lineTo(-s * 0.9, s * 0.7);
      ctx.closePath();
      ctx.fill();
      // trail
      ctx.strokeStyle = `oklch(0.78 0.10 25 / ${a * 0.5})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.lineTo(0, s * 2.2);
      ctx.stroke();
      ctx.restore();
    };

    const drawPin = (p: P, a: number) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      const s = p.r * 1.4;
      ctx.fillStyle = `oklch(0.55 0.18 25 / ${a})`;
      ctx.beginPath();
      ctx.arc(0, -s * 0.4, s, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s * 0.7, -s * 0.1);
      ctx.lineTo(s * 0.7, -s * 0.1);
      ctx.lineTo(0, s * 1.2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawRing = (p: P, a: number) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = `oklch(0.62 0.16 25 / ${a * 0.7})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    };

    const drawDot = (p: P, a: number) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `oklch(0.62 0.16 25 / ${a})`;
      ctx.fill();
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      // ease mouse + scroll
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;
      scroll.current.y += (scroll.current.ty - scroll.current.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const mx = mouse.current.x - w / 2;
      const my = mouse.current.y - h / 2;
      const sy = scroll.current.y;

      for (const p of particles) {
        // drift
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.rot += p.vr * dt;
        // gentle wander
        p.vx += (Math.random() - 0.5) * 0.002;
        p.vy += (Math.random() - 0.5) * 0.002;
        p.vx = Math.max(-0.35, Math.min(0.35, p.vx));
        p.vy = Math.max(-0.25, Math.min(0.25, p.vy));

        // parallax offsets (depth scaled)
        const px = p.x + mx * 0.012 * p.z + 0;
        const py = p.y + my * 0.012 * p.z + (-sy * 0.04 * p.z);

        // wrap
        const margin = 40;
        let x = px, y = py;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;

        // opacity breathing
        p.aPhase += p.aSpeed * dt;
        const a = Math.max(0.04, p.baseA + Math.sin(p.aPhase) * 0.12);

        const draw = { x: x, y: y } as P;
        const proxy: P = { ...p, x, y };
        if (p.kind === "plane") drawPlane(proxy, a);
        else if (p.kind === "pin") drawPin(proxy, a);
        else if (p.kind === "ring") drawRing(proxy, a);
        else drawDot(proxy, a);
        void draw;
      }

      if (!reduce) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}