import { createFileRoute } from "@tanstack/react-router";
import { CrudModule, type Field } from "@/components/system/CrudModule";
import { brl, dateTime, useRows, type Row } from "@/lib/system";

export const Route = createFileRoute("/_authenticated/viagens")({
  head: () => ({
    meta: [
      { title: "Viagens | Sistema OSER" },
      { name: "description", content: "Controle de deslocamentos executivos, status, km e valores." },
      { property: "og:title", content: "Viagens | Sistema OSER" },
      { property: "og:description", content: "Controle de deslocamentos executivos da OSER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ViagensPage,
});

const statusLabels: Record<string, string> = {
  agendada: "Agendada",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

function ViagensPage() {
  const { data: clientes = [] } = useRows("clientes");
  const { data: motoristas = [] } = useRows("motoristas");
  const { data: veiculos = [] } = useRows("veiculos");

  const nameOf = (rows: Row[], id: unknown, key: string) =>
    (rows.find((r) => r.id === id)?.[key] as string) ?? "—";

  const fields: Field[] = [
    { name: "titulo", label: "Título", required: true, span: true },
    {
      name: "tipo",
      label: "Tipo de serviço",
      type: "select",
      options: [
        { value: "executivo", label: "Transporte executivo" },
        { value: "aeroporto", label: "Aeroporto" },
        { value: "evento", label: "Evento" },
        { value: "vip", label: "VIP" },
        { value: "corporativa", label: "Viagem corporativa" },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
    },
    {
      name: "cliente_id",
      label: "Cliente",
      type: "select",
      options: clientes.map((c) => ({ value: c.id, label: String(c["nome"]) })),
    },
    {
      name: "motorista_id",
      label: "Motorista",
      type: "select",
      options: motoristas.map((m) => ({ value: m.id, label: String(m["nome"]) })),
    },
    {
      name: "veiculo_id",
      label: "Veículo",
      type: "select",
      options: veiculos.map((v) => ({ value: v.id, label: `${v["modelo"]} · ${v["placa"]}` })),
    },
    { name: "origem", label: "Origem" },
    { name: "destino", label: "Destino" },
    { name: "inicio", label: "Início", type: "datetime-local" },
    { name: "fim", label: "Término", type: "datetime-local" },
    { name: "km", label: "Km percorridos", type: "number" },
    { name: "valor", label: "Valor (R$)", type: "number" },
    { name: "observacoes", label: "Observações", type: "textarea" },
  ];

  return (
    <CrudModule
      table="viagens"
      orderBy="inicio"
      title="Viagens"
      description="Todos os deslocamentos, com cliente, motorista, veículo, km e valores."
      columns={[
        { key: "titulo", label: "Viagem" },
        { key: "cliente_id", label: "Cliente", render: (r) => nameOf(clientes, r["cliente_id"], "nome") },
        { key: "motorista_id", label: "Motorista", render: (r) => nameOf(motoristas, r["motorista_id"], "nome") },
        { key: "veiculo_id", label: "Veículo", render: (r) => nameOf(veiculos, r["veiculo_id"], "modelo") },
        { key: "inicio", label: "Início", render: (r) => dateTime(r["inicio"]) },
        { key: "valor", label: "Valor", render: (r) => brl(r["valor"]) },
        {
          key: "status",
          label: "Status",
          render: (r) => statusLabels[String(r["status"])] ?? String(r["status"]),
        },
      ]}
      fields={fields}
      emptyLabel="Nenhuma viagem registrada."
    />
  );
}
