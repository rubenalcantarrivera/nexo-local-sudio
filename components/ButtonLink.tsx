import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = { href: string; children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string };

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  const classes = cn(
    "focus-ring inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
    variant === "primary" && "bg-brand-primary text-white shadow-card hover:opacity-95",
    variant === "secondary" && "border border-brand-border bg-white text-brand-primary hover:border-brand-accent hover:bg-brand-softAccent/40",
    variant === "ghost" && "text-brand-primary hover:bg-white/60",
    className
  );
  const external = href.startsWith("http") || href.startsWith("mailto:");
  return external ? <a href={href} className={classes} target="_blank" rel="noreferrer">{children}</a> : <Link href={href} className={classes}>{children}</Link>;
}
