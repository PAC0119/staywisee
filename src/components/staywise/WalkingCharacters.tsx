import characters from "@/assets/characters.png";

/** Cartoon companions walking across the section. */
export function WalkingCharacters({
  className = "",
  width = 220,
  duration = 55,
  reverse = false,
}: {
  className?: string;
  width?: number;
  duration?: number;
  reverse?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 ${className}`}
      aria-hidden
    >
      <div
        className="animate-walk"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="animate-bob" style={{ width }}>
          <img
            src={characters}
            alt=""
            width={width}
            height={(width * 768) / 1024}
            style={{ transform: reverse ? "scaleX(-1)" : "none" }}
            className="drop-shadow-xl"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
