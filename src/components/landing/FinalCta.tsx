import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { brand, finalCta } from "@/config/site";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section id="contato" className="relative overflow-hidden">
      <img
        src={finalCta.image}
        alt="Sedan executivo em avenida urbana ao amanhecer"
        loading="lazy"
        width={1600}
        height={900}
        className="absolute inset-0 size-full object-cover opacity-45"
      />
      <div className="veil absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-5 py-28 text-center md:px-10 md:py-40">
        <Reveal>
          <p className="eyebrow">{brand.name}</p>
          <h2 className="mt-6 text-3xl leading-tight font-semibold md:text-6xl">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {finalCta.text}
          </p>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={finalCta.primary.href}
              className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary px-8 py-4 text-xs tracking-[0.2em] uppercase text-primary-foreground transition-all duration-300 hover:shadow-[var(--shadow-gold)] hover:brightness-110"
            >
              {finalCta.primary.label}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              to={brand.systemUrl}
              className="inline-flex items-center justify-center rounded-sm border border-border px-8 py-4 text-xs tracking-[0.2em] uppercase text-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              {finalCta.secondary.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
