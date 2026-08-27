import { fleet } from "@/config/site";
import { Reveal } from "./Reveal";

export function Fleet() {
  return (
    <section id="frota" className="bg-surface px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Nossa frota</p>
            <h2 className="mt-5 text-3xl leading-tight font-semibold md:text-5xl">{fleet.title}</h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Categorias disponíveis conforme a operação, o número de passageiros e o perfil do
            atendimento.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {fleet.categories.map((category, index) => (
            <Reveal key={category.name} delay={index * 90}>
              <article className="group relative h-[24rem] overflow-hidden md:h-[30rem]">
                <img
                  src={category.image}
                  alt={`Categoria ${category.name}`}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="veil absolute inset-0" />
                <div className="relative flex h-full flex-col justify-end p-8">
                  <h3 className="wordmark text-sm text-primary md:text-base">{category.name}</h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/80 md:text-base">
                    {category.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
