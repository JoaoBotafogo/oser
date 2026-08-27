import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Car, Gauge, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { brand } from "@/config/site";

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

const cards = [
  { icon: CalendarDays, label: "Eventos ativos", value: "0" },
  { icon: UserRound, label: "Motoristas", value: "0" },
  { icon: Car, label: "Veículos", value: "0" },
  { icon: Gauge, label: "Km no mês", value: "0" },
];

function PainelPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="wordmark text-lg text-foreground">{brand.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-sm border border-border px-5 py-2.5 text-xs tracking-[0.2em] uppercase text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Sair
          </button>
        </header>

        <h1 className="mt-10 text-2xl font-semibold md:text-3xl">Painel de operações</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Acompanhe deslocamentos, motoristas, veículos e quilometragem. Os módulos de gestão serão
          conectados aqui.
        </p>

        <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-surface p-6">
              <Icon className="size-5 text-primary" />
              <p className="mt-6 font-display text-3xl">{value}</p>
              <p className="mt-1 text-xs tracking-[0.16em] uppercase text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
