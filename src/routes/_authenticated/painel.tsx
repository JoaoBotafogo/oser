import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Car, Gauge, Route as RouteIcon, UserRound, Users, Wallet } from "lucide-react";
import { PageShell } from "@/components/system/PageShell";
import { brl, dateTime, useRows } from "@/lib/system";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel OSER | Gestão de deslocamentos" },
      {
        name: "description",
        content:
          "Painel da OSER para acompanhar deslocamentos, motoristas, veículos e quilometragem em tempo real.",
      },
      { property: "og:title", content: "Painel OSER" },
      { property: "og:description", content: "Gestão de deslocamentos da OSER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PainelPage,
});

const atalhos = [
  { to: "/viagens", label: "Viagens", icon: RouteIcon },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/motoristas", label: "Motoristas", icon: UserRound },
  { to: "/frota", label: "Frota", icon: Car },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
] as const;

function PainelPage() {
  const { user } = Route.useRouteContext();
  const { data: viagens = [] } = useRows("viagens", "inicio");
  const { data: motoristas = [] } = useRows("motoristas");
  const { data: veiculos = [] } = useRows("veiculos");

  const now = new Date();
  const doMes = viagens.filter((v) => {
    const d = new Date(String(v["inicio"]));
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const cards = [
    {
      icon: CalendarDays,
      label: "Viagens ativas",
      value: String(
        viagens.filter((v) => ["agendada", "em_andamento"].includes(String(v["status"]))).length,
      ),
    },
    { icon: UserRound, label: "Motoristas", value: String(motoristas.length) },
    { icon: Car, label: "Veículos", value: String(veiculos.length) },
    {
      icon: Gauge,
      label: "Km no mês",
      value: doMes.reduce((sum, v) => sum + Number(v["km"] ?? 0), 0).toLocaleString("pt-BR"),
    },
  ];

  const proximas = viagens
    .filter((v) => String(v["status"]) !== "cancelada")
    .sort((a, b) => new Date(String(a["inicio"])).getTime() - new Date(String(b["inicio"])).getTime())
    .slice(0, 5);

  return (
    <PageShell
      title="Painel de operações"
      description={`Bem-vindo, ${user?.email ?? ""}. Visão geral da operação OSER.`}
    >
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-surface p-6">
            <Icon className="size-5 text-primary" />
            <p className="mt-6 font-display text-3xl">{value}</p>
            <p className="mt-1 text-xs tracking-[0.16em] uppercase text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Próximos deslocamentos
          </h2>
          <div className="mt-3 divide-y divide-border rounded-sm border border-border bg-surface">
            {proximas.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">
                Nenhuma viagem cadastrada.{" "}
                <Link to="/viagens" className="text-primary">
                  Criar a primeira
                </Link>
                .
              </p>
            ) : (
              proximas.map((viagem) => (
                <div key={viagem.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                  <div>
                    <p>{String(viagem["titulo"])}</p>
                    <p className="text-xs text-muted-foreground">
                      {dateTime(viagem["inicio"])} · {String(viagem["destino"] ?? "—")}
                    </p>
                  </div>
                  <span className="text-primary">{brl(viagem["valor"])}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Módulos</h2>
          <div className="mt-3 grid grid-cols-2 gap-px border border-border bg-border">
            {atalhos.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="bg-surface p-5 transition-colors hover:bg-muted/40">
                <Icon className="size-4 text-primary" />
                <p className="mt-4 text-sm">{label}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
