import Link from "next/link";
import { ButtonLink } from "./ButtonLink";
import { Logo } from "./Logo";

type NavItem = { label: string; href: string };
type Props = { brand?: string; descriptor?: string; navItems?: NavItem[]; ctaHref?: string; ctaLabel?: string; homeHref?: string };

export function Header({ brand = "Nexo Local Studio", descriptor = "Páginas web profesionales", navItems = [{ label: "Servicios", href: "#servicios" }, { label: "Precios", href: "#paquetes" }, { label: "Ejemplos", href: "/demos" }, { label: "FAQ", href: "#faq" }], ctaHref = "#contacto", ctaLabel = "Cotizar mi página", homeHref = "/" }: Props) {
  const isAgency = brand === "Nexo Local Studio";
  const mark = brand
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border/70 bg-[#fbf7ef]/90 shadow-[0_1px_0_rgba(255,255,255,.7)_inset] backdrop-blur-2xl">
      <div className="container-page flex h-20 items-center justify-between gap-5">
        <Link href={homeHref} className="group flex items-center gap-3" aria-label="Ir al inicio">
          {isAgency ? (
            <Logo variant="full" />
          ) : (
            <>
              <span className="grid h-11 w-11 place-items-center border border-brand-border bg-white/80 font-display text-sm font-semibold text-brand-primary shadow-card transition group-hover:-translate-y-0.5">{mark}</span>
              <span className="leading-tight"><span className="block font-display text-base font-semibold tracking-tight text-brand-primary sm:text-lg">{brand}</span><span className="hidden text-xs text-brand-muted sm:block">{descriptor}</span></span>
            </>
          )}
        </Link>
        <nav className="hidden items-center gap-7 text-[13px] font-semibold text-brand-muted lg:flex">
          {navItems.map((item) => <Link key={item.href + item.label} href={item.href} className="transition hover:text-brand-primary">{item.label}</Link>)}
        </nav>
        <ButtonLink href={ctaHref} className="hidden sm:inline-flex">{ctaLabel}</ButtonLink>
      </div>
    </header>
  );
}
