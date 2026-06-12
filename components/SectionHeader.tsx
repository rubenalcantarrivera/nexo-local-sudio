import { cn } from "@/lib/utils";

type Props = { eyebrow?: string; title: string; description?: string; align?: "left" | "center" };
export function SectionHeader({ eyebrow, title, description, align = "left" }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-semibold text-brand-primary sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-base text-brand-muted sm:text-lg">{description}</p> : null}
    </div>
  );
}
