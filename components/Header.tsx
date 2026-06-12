import Link from "next/link";
import { ButtonLink } from "./ButtonLink";

type NavItem = { label: string; href: string };
type Props = { brand?: string; descriptor?: string; navItems?: NavItem[]; ctaHref?: string; ctaLabel?: string; homeHref?: string };

export function Header({ brand = "Nexo Local Studio", descriptor = "Landing pages premium", navItems = [{ label: "Servicios", href: "#servicios" }, { label: "Paquetes", href: "#paquetes" }, { label: "Demos", href: "/demos" }, { label: "FAQ", href: "#faq" }], ctaHref = "#contacto", ctaLabel = "Solicitar diagnóstico", homeHref = "/" }: Props) {
  const mark = brand
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border/80 bg-brand-background/90 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between gap-5">
        <Link href={homeHref} className="group flex items-center gap-3" aria-label="Ir al inicio">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-primary text-sm font-bold text-white shadow-card transition group-hover:-translate-y-0.5">{mark}</span>
          <span className="leading-tight"><span className="block text-sm font-bold tracking-tight text-brand-primary sm:text-base">{brand}</span><span className="hidden text-xs text-brand-muted sm:block">{descriptor}</span></span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-muted lg:flex">
          {navItems.map((item) => <Link key={item.href + item.label} href={item.href} className="transition hover:text-brand-primary">{item.label}</Link>)}
        </nav>
        <ButtonLink href={ctaHref} className="hidden sm:inline-flex">{ctaLabel}</ButtonLink>
      </div>
    </header>
  );
}
