import { ShieldCheck, IdCard, Radar, Gauge, LayoutGrid } from "lucide-react";
import { security } from "@/config/site";
import { Reveal } from "./Reveal";

const icons = [IdCard, ShieldCheck, Radar, Gauge, LayoutGrid];

export function Security() {
  return (
    <section className="bg-background px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Segurança e confiança</p>
          <h2 className="mt-5 text-3xl leading-tight font-semibold md:text-5xl">{security.title}</h2>
        </Reveal>

        <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {security.items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Reveal key={item.title} delay={index * 70}>
                <article className="group h-full bg-background p-8 transition-colors duration-500 hover:bg-surface">
                  <Icon className="size-6 text-primary transition-transform duration-500 group-hover:-translate-y-1" />
                  <h3 className="mt-8 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              </Reveal>
            );
          })}
          <div className="hidden bg-surface lg:block" />
        </div>
      </div>
    </section>
  );
}
