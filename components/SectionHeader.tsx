import { cn } from "@/lib/utils";

type Props = { eyebrow?: string; title: string; description?: string; align?: "left" | "center"; className?: string };
export function SectionHeader({ eyebrow, title, description, align = "left", className }: Props) {
  const inverted = className?.includes("text-white");
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className={cn("mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl", inverted ? "text-white" : "text-brand-primary")}>{title}</h2>
      {description ? <p className={cn("mt-5 text-base sm:text-lg", inverted ? "text-white/82" : "text-brand-muted")}>{description}</p> : null}
    </div>
  );
}
