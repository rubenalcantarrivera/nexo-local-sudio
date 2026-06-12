import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "full" | "compact" | "mark";
  tone?: "light" | "dark";
  className?: string;
};

export function LogoMark({ className, tone = "dark" }: Pick<LogoProps, "className" | "tone">) {
  const ink = tone === "light" ? "#F8F5EF" : "#183B56";
  const accent = tone === "light" ? "#D9B06E" : "#B88A44";

  return (
    <svg className={cn("h-10 w-10", className)} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="nexo-mark-gradient" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor={ink} />
          <stop offset="1" stopColor={accent} />
        </linearGradient>
      </defs>
      <path d="M10 50V14h10l24 28V14h10v36H44L20 22v28H10Z" fill="url(#nexo-mark-gradient)" />
      <path d="M20 18h24M20 46h24" stroke={tone === "light" ? "#F8F5EF" : "#0B1220"} strokeOpacity=".32" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 18 45 46" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <circle cx="19" cy="18" r="3" fill={accent} />
      <circle cx="45" cy="46" r="3" fill={accent} />
    </svg>
  );
}

export function LogoWordmark({ compact = false, tone = "dark" }: { compact?: boolean; tone?: LogoProps["tone"] }) {
  const text = tone === "light" ? "text-white" : "text-brand-primary";
  const muted = tone === "light" ? "text-white/58" : "text-brand-muted";

  return (
    <span className="leading-none">
      <span className={cn("block font-display text-lg font-semibold tracking-tight", text)}>
        {compact ? "Nexo Local" : "Nexo Local Studio"}
      </span>
      {!compact ? <span className={cn("mt-1 hidden text-[11px] font-medium tracking-[0.18em] sm:block", muted)}>LOCAL LANDING SYSTEMS</span> : null}
    </span>
  );
}

export function Logo({ variant = "full", tone = "dark", className }: LogoProps) {
  if (variant === "mark") return <LogoMark tone={tone} className={className} />;

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className={cn("grid h-11 w-11 place-items-center rounded-2xl border", tone === "light" ? "border-white/15 bg-white/10" : "border-brand-border bg-white/70 shadow-card")}>
        <LogoMark tone={tone} className="h-8 w-8" />
      </span>
      <LogoWordmark compact={variant === "compact"} tone={tone} />
    </span>
  );
}
