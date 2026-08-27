import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/system/PageShell";
import { brl, dateTime, useRows } from "@/lib/system";

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro | Sistema OSER" },
      { name: "description", content: "Faturamento por viagem, ticket médio e receita por cliente." },
      { property: "og:title", content: "Financeiro | Sistema OSER" },
      { property: "og:description", content: "Faturamento e receita da operação OSER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FinanceiroPage,
});

function FinanceiroPage() {
  const { data: viagens = [] } = useRows("viagens", "inicio");
  const { data: clientes = [] } = useRows("clientes");

  const faturadas = viagens.filter((v) => String(v["status"]) !== "cancelada");
  const total = faturadas.reduce((sum, v) => sum + Number(v["valor"] ?? 0), 0);
  const concluidas = faturadas.filter((v) => String(v["status"]) === "concluida");
  const recebido = concluidas.reduce((sum, v) => sum + Number(v["valor"] ?? 0), 0);
  const ticket = faturadas.length ? total / faturadas.length : 0;

  const porCliente = clientes
    .map((cliente) => ({
      nome: String(cliente["nome"]),
      total: faturadas
        .filter((v) => v["cliente_id"] === cliente.id)
        .reduce((sum, v) => sum + Number(v["valor"] ?? 0), 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const cards = [
    { label: "Faturamento previsto", value: brl(total) },
    { label: "Recebido (concluídas)", value: brl(recebido) },
    { label: "A realizar", value: brl(total - recebido) },
    { label: "Ticket médio", value: brl(ticket) },
  ];

  return (
    <PageShell title="Financeiro" description="Receita por viagem, por cliente e ticket médio.">
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
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
            Receita por cliente
          </h2>
          <div className="mt-3 divide-y divide-border rounded-sm border border-border bg-surface">
            {porCliente.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">Sem receita registrada.</p>
            ) : (
              porCliente.map((cliente) => (
                <div key={cliente.nome} className="flex items-center justify-between p-4 text-sm">
                  <span>{cliente.nome}</span>
                  <span className="text-primary">{brl(cliente.total)}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Últimos lançamentos
          </h2>
          <div className="mt-3 divide-y divide-border rounded-sm border border-border bg-surface">
            {faturadas.slice(0, 8).length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">Nenhuma viagem lançada.</p>
            ) : (
              faturadas.slice(0, 8).map((viagem) => (
                <div key={viagem.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                  <div>
                    <p>{String(viagem["titulo"])}</p>
                    <p className="text-xs text-muted-foreground">{dateTime(viagem["inicio"])}</p>
                  </div>
                  <span className="text-primary">{brl(viagem["valor"])}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
