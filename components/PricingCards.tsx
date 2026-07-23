"use client";

import type { Package } from "@/data/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ButtonLink } from "./ButtonLink";

type Props = { packages: Package[]; ctaHref: string };

const currencies = [
  { code: "MXN", country: "México", rate: 17.407927, locale: "es-MX" },
  { code: "COP", country: "Colombia", rate: 3218.93695, locale: "es-CO" },
  { code: "PEN", country: "Perú", rate: 3.40109, locale: "es-PE" },
  { code: "CLP", country: "Chile", rate: 935.183352, locale: "es-CL" },
  { code: "ARS", country: "Argentina", rate: 1480.8616, locale: "es-AR" },
  { code: "PAB", country: "Panamá", rate: 1, locale: "es-PA" },
  { code: "CRC", country: "Costa Rica", rate: 453.824439, locale: "es-CR" },
  { code: "DOP", country: "Rep. Dominicana", rate: 58.32064, locale: "es-DO" },
  { code: "USD", country: "Ecuador", rate: 1, locale: "es-EC" },
  { code: "BRL", country: "Brasil", rate: 5.067992, locale: "pt-BR" },
  { code: "UYU", country: "Uruguay", rate: 40.171912, locale: "es-UY" },
  { code: "PYG", country: "Paraguay", rate: 6060.641309, locale: "es-PY" },
  { code: "BOB", country: "Bolivia", rate: 10.847973, locale: "es-BO" },
  { code: "GTQ", country: "Guatemala", rate: 7.628688, locale: "es-GT" },
  { code: "HNL", country: "Honduras", rate: 26.783438, locale: "es-HN" },
  { code: "NIO", country: "Nicaragua", rate: 36.809085, locale: "es-NI" },
];

function formatLocalPrice(priceUsd: number, currency: (typeof currencies)[number]) {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: currency.rate > 100 ? 0 : 2,
  }).format(priceUsd * currency.rate);
}

export function PricingCards({ packages, ctaHref }: Props) {
  const [currencyCode, setCurrencyCode] = useState("MXN");
  const currency = currencies.find((item) => item.code === currencyCode) ?? currencies[0];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-y border-brand-border bg-white/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-primary">Precios base en dólares estadounidenses</p>
          <p className="mt-1 text-xs leading-5 text-brand-muted">Consulta una equivalencia aproximada para tu país.</p>
        </div>
        <label className="flex items-center gap-3 text-sm font-semibold text-brand-primary">
          Ver en
          <select
            value={currencyCode}
            onChange={(event) => setCurrencyCode(event.target.value)}
            className="min-h-11 border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          >
            {currencies.map((item) => (
              <option key={`${item.country}-${item.code}`} value={item.code}>
                {item.country} · {item.code}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {packages.map((item) => (
          <article key={item.name} className={cn("relative flex h-full flex-col overflow-hidden border bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft", item.highlighted ? "border-brand-accent bg-[#fffaf0]" : "border-brand-border")}>
            {item.highlighted ? <span className="badge-soft absolute right-5 top-5">Recomendado</span> : null}
            <h3 className="font-display text-3xl font-semibold text-brand-primary">{item.name}</h3>
            <div className="mt-3">
              <p className="font-display text-4xl font-semibold tracking-tight text-brand-text">{item.price}</p>
              <p className="mt-1 text-sm font-semibold text-brand-primary">
                ≈ {formatLocalPrice(item.priceUsd, currency)} {currency.code}
              </p>
            </div>
            <p className="mt-4 text-sm text-brand-muted">{item.description}</p>
            <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-brand-text">
              {item.includes.map((feature) => <li key={feature} className="flex gap-3"><span className="shrink-0 font-semibold text-brand-accent">✓</span><span>{feature}</span></li>)}
            </ul>
            {item.notIncluded?.length ? (
              <div className="mt-6 border-t border-brand-border pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-muted">No incluido</p>
                <p className="mt-2 text-sm leading-7 text-brand-muted">{item.notIncluded.join(", ")}.</p>
              </div>
            ) : null}
            <ButtonLink href={ctaHref} variant={item.highlighted ? "primary" : "secondary"} className="mt-8 w-full">{item.cta ?? `Cotizar ${item.name}`}</ButtonLink>
          </article>
        ))}
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-brand-muted">
        Equivalencias de referencia al 22 de julio de 2026. El monto final se confirma en la propuesta según el tipo de cambio y el alcance del proyecto.
      </p>
    </div>
  );
}
