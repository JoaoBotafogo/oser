import { services } from "@/config/site";
import { Reveal } from "./Reveal";

export function Services() {
  return (
    <section id="servicos" className="bg-background px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Nossos serviços</p>
          <h2 className="mt-5 text-3xl leading-tight font-semibold md:text-5xl">
            Cada deslocamento tem um propósito. Nós cuidamos de todos.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 80}>
              <article className="group relative h-full min-h-[22rem] overflow-hidden bg-surface">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  width={1000}
                  height={750}
                  className="absolute inset-0 size-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="veil absolute inset-0" />
                <div className="relative flex h-full flex-col justify-end p-7">
                  <h3 className="text-xl font-semibold md:text-2xl">{service.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {service.text}
                  </p>
                  <span className="mt-5 h-px w-10 bg-primary transition-all duration-500 group-hover:w-24" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
