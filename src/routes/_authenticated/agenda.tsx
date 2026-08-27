import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageShell } from "@/components/system/PageShell";
import { brl, dateTime, useRows, type Row } from "@/lib/system";

export const Route = createFileRoute("/_authenticated/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda | Sistema OSER" },
      { name: "description", content: "Agenda operacional da OSER com os próximos deslocamentos." },
      { property: "og:title", content: "Agenda | Sistema OSER" },
      { property: "og:description", content: "Próximos deslocamentos da operação OSER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgendaPage,
});

function AgendaPage() {
  const { data: viagens = [], isLoading } = useRows("viagens", "inicio", true);
  const { data: motoristas = [] } = useRows("motoristas");

  const upcoming = viagens.filter((v) => String(v["status"]) !== "cancelada");
  const grouped = upcoming.reduce<Record<string, Row[]>>((acc, viagem) => {
    const day = new Date(String(viagem["inicio"])).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    (acc[day] ??= []).push(viagem);
    return acc;
  }, {});

  return (
    <PageShell
      title="Agenda"
      description="Linha do tempo dos deslocamentos programados, por dia."
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : upcoming.length === 0 ? (
        <div className="rounded-sm border border-border bg-surface p-10 text-center">
          <CalendarDays className="mx-auto size-6 text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhuma viagem agendada. Cadastre uma em Viagens.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([day, items]) => (
            <section key={day}>
              <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{day}</h2>
              <div className="mt-3 grid gap-px border border-border bg-border">
                {items.map((viagem) => (
                  <article key={viagem.id} className="bg-surface p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium">{String(viagem["titulo"])}</p>
                      <span className="text-xs tracking-[0.16em] uppercase text-primary">
                        {dateTime(viagem["inicio"])}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {String(viagem["origem"] ?? "—")} → {String(viagem["destino"] ?? "—")} ·{" "}
                      {(motoristas.find((m) => m.id === viagem["motorista_id"])?.["nome"] as string) ??
                        "Sem motorista"}{" "}
                      · {brl(viagem["valor"])}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
