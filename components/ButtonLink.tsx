import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = { href: string; children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string };

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  const classes = cn(
    "focus-ring group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5",
    variant === "primary" && "bg-[linear-gradient(135deg,#183B56,#0B1220)] text-white shadow-card hover:shadow-soft",
    variant === "secondary" && "border border-brand-border bg-white/90 text-brand-primary shadow-[0_1px_0_rgba(255,255,255,.7)_inset] hover:border-brand-accent hover:bg-brand-softAccent/40",
    variant === "ghost" && "text-brand-primary hover:bg-white/60",
    className
  );
  const content = <>{children}<span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span></>;
  const external = href.startsWith("http");
  if (external) return <a href={href} className={classes} target="_blank" rel="noreferrer">{content}</a>;
  if (href.startsWith("mailto:")) return <a href={href} className={classes}>{content}</a>;
  return <Link href={href} className={classes}>{content}</Link>;
}
