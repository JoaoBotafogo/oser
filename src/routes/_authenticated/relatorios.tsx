import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/system/PageShell";
import { brl, useRows } from "@/lib/system";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | Sistema OSER" },
      { name: "description", content: "Indicadores de operação: viagens, km, produtividade e frota." },
      { property: "og:title", content: "Relatórios | Sistema OSER" },
      { property: "og:description", content: "Indicadores operacionais da OSER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const { data: viagens = [] } = useRows("viagens", "inicio");
  const { data: motoristas = [] } = useRows("motoristas");
  const { data: veiculos = [] } = useRows("veiculos");

  const km = viagens.reduce((sum, v) => sum + Number(v["km"] ?? 0), 0);
  const porTipo = viagens.reduce<Record<string, number>>((acc, v) => {
    const key = String(v["tipo"] ?? "executivo");
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const maxTipo = Math.max(1, ...Object.values(porTipo));

  const rankingMotoristas = motoristas
    .map((m) => ({
      nome: String(m["nome"]),
      viagens: viagens.filter((v) => v["motorista_id"] === m.id).length,
      km: viagens
        .filter((v) => v["motorista_id"] === m.id)
        .reduce((sum, v) => sum + Number(v["km"] ?? 0), 0),
    }))
    .sort((a, b) => b.viagens - a.viagens)
    .slice(0, 6);

  return (
    <PageShell title="Relatórios" description="Visão analítica da operação e da frota.">
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Viagens", value: String(viagens.length) },
          { label: "Km percorridos", value: km.toLocaleString("pt-BR") },
          { label: "Veículos ativos", value: String(veiculos.filter((v) => v["status"] !== "inativo").length) },
          {
            label: "Receita total",
            value: brl(viagens.reduce((sum, v) => sum + Number(v["valor"] ?? 0), 0)),
          },
        ].map((card) => (
          <div key={card.label} className="bg-surface p-6">
            <p className="font-display text-2xl">{card.value}</p>
            <p className="mt-1 text-xs tracking-[0.16em] uppercase text-muted-foreground">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Viagens por tipo de serviço
          </h2>
          <div className="mt-4 space-y-3">
            {Object.keys(porTipo).length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
            ) : (
              Object.entries(porTipo).map(([tipo, quantidade]) => (
                <div key={tipo}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{tipo}</span>
                    <span className="text-muted-foreground">{quantidade}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(quantidade / maxTipo) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Produtividade por motorista
          </h2>
          <div className="mt-4 divide-y divide-border rounded-sm border border-border bg-surface">
            {rankingMotoristas.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">Cadastre motoristas para ver o ranking.</p>
            ) : (
              rankingMotoristas.map((m) => (
                <div key={m.nome} className="flex items-center justify-between p-4 text-sm">
                  <span>{m.nome}</span>
                  <span className="text-muted-foreground">
                    {m.viagens} viagens · {m.km.toLocaleString("pt-BR")} km
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
