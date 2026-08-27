import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/system/PageShell";
import { brand } from "@/config/site";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações | Sistema OSER" },
      { name: "description", content: "Dados da conta, preferências e segurança do sistema OSER." },
      { property: "og:title", content: "Configurações | Sistema OSER" },
      { property: "og:description", content: "Conta e segurança no sistema OSER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { user } = Route.useRouteContext();

  const blocks = [
    { icon: Mail, label: "E-mail da conta", value: user?.email ?? "—" },
    { icon: Building2, label: "Operação", value: brand.name },
    { icon: ShieldCheck, label: "Acesso", value: "Somente você enxerga seus registros" },
  ];

  return (
    <PageShell title="Configurações" description="Informações da conta e do ambiente operacional.">
      <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
        {blocks.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-surface p-6">
            <Icon className="size-5 text-primary" />
            <p className="mt-5 text-sm">{value}</p>
            <p className="mt-1 text-xs tracking-[0.16em] uppercase text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
        Os módulos de Viagens, Agenda, Clientes, Motoristas, Frota, Financeiro e Relatórios usam a
        mesma base de dados protegida — cada conta acessa apenas os próprios registros.
      </p>
    </PageShell>
  );
}
