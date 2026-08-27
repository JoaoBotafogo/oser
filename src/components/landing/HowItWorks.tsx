import { steps } from "@/config/site";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-background px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Como funciona</p>
          <h2 className="mt-5 text-3xl leading-tight font-semibold md:text-5xl">
            A experiência OSER, do primeiro contato à chegada.
          </h2>
        </Reveal>

        <ol className="mt-16 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 90}>
              <li className="group h-full bg-background p-8 transition-colors duration-500 hover:bg-surface">
                <span className="font-display text-4xl text-primary/70 transition-colors duration-500 group-hover:text-primary md:text-5xl">
                  {step.number}
                </span>
                <h3 className="mt-8 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
