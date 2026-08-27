import { Gauge, MapPin, Clock, UserRound, Car, CalendarDays } from "lucide-react";
import { technology } from "@/config/site";
import { Reveal } from "./Reveal";

export function Technology() {
  const p = technology.panel;

  return (
    <section id="tecnologia" className="relative overflow-hidden bg-surface">
      <img
        src={technology.image}
        alt="Veículo executivo em movimento à noite"
        loading="lazy"
        width={1600}
        height={1000}
        className="absolute inset-0 size-full object-cover opacity-35"
      />
      <div className="veil absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow">Tecnologia OSER</p>
          <h2 className="mt-5 text-3xl leading-tight font-semibold md:text-5xl">
            {technology.title}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            {technology.text}
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-foreground/80">
            {["Localização em tempo real", "Motorista e veículo", "Eventos e horários", "Controle de quilometragem"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </Reveal>

        <Reveal delay={140}>
          <div className="rounded-md border border-border bg-background/80 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:p-8">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-primary">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                {p.status}
              </span>
              <span className="text-xs text-muted-foreground">{p.start}</span>
            </div>

            <div className="relative mt-6 h-44 overflow-hidden rounded-sm border border-border bg-secondary md:h-52">
              <svg viewBox="0 0 400 200" className="size-full" aria-hidden="true">
                <defs>
                  <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path d="M28 0H0V28" fill="none" stroke="currentColor" strokeWidth="0.6" />
                  </pattern>
                </defs>
                <rect width="400" height="200" fill="url(#grid)" className="text-border" />
                <path
                  d="M20 170 C 90 150, 110 90, 180 90 S 300 60, 380 26"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="600"
                  strokeDashoffset="600"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="600"
                    to="0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
                <circle cx="20" cy="170" r="4" fill="var(--primary)" />
                <circle cx="380" cy="26" r="5" fill="none" stroke="var(--primary)" strokeWidth="2" />
              </svg>
              <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-sm bg-background/80 px-3 py-1.5 text-xs text-foreground backdrop-blur">
                <MapPin className="size-3.5 text-primary" />
                Em rota
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { icon: CalendarDays, text: p.event },
                { icon: UserRound, text: p.driver },
                { icon: Car, text: p.vehicle },
                { icon: Gauge, text: p.km },
                { icon: Clock, text: p.end },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
