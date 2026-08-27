import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { brand, hero } from "@/config/site";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[100svh] overflow-hidden">
      <img
        src={hero.image}
        alt="Sedan executivo com motorista profissional em cenário urbano noturno"
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="veil absolute inset-0" />
      <div className="veil-side absolute inset-0 hidden md:block" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pt-32 pb-14 md:px-10 md:pb-20">
        <Reveal>
          <p className="eyebrow">{hero.eyebrow}</p>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-semibold text-foreground sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {hero.text}
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={hero.primaryCta.href}
              className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary px-8 py-4 text-xs tracking-[0.2em] uppercase text-primary-foreground transition-all duration-300 hover:shadow-[var(--shadow-gold)] hover:brightness-110"
            >
              {hero.primaryCta.label}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              to={brand.systemUrl}
              className="inline-flex items-center justify-center rounded-sm border border-border px-8 py-4 text-xs tracking-[0.2em] uppercase text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={420}>
          <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-xl text-primary md:text-2xl">{stat.value}</dt>
                <dd className="mt-1 text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
