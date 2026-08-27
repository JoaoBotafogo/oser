import { createFileRoute } from "@tanstack/react-router";
import { CrudModule } from "@/components/system/CrudModule";
import { dateOnly } from "@/lib/system";

export const Route = createFileRoute("/_authenticated/motoristas")({
  head: () => ({
    meta: [
      { title: "Motoristas | Sistema OSER" },
      { name: "description", content: "Gestão de motoristas executivos, CNH e disponibilidade." },
      { property: "og:title", content: "Motoristas | Sistema OSER" },
      { property: "og:description", content: "Gestão de motoristas executivos da OSER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudModule
      table="motoristas"
      title="Motoristas"
      description="Equipe de condutores, documentação e disponibilidade operacional."
      columns={[
        { key: "nome", label: "Nome" },
        { key: "telefone", label: "Telefone" },
        { key: "cnh_categoria", label: "CNH" },
        { key: "cnh_validade", label: "Validade", render: (r) => dateOnly(r["cnh_validade"]) },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { name: "nome", label: "Nome", required: true },
        { name: "telefone", label: "Telefone" },
        { name: "documento", label: "Documento" },
        {
          name: "cnh_categoria",
          label: "Categoria CNH",
          type: "select",
          options: ["A", "B", "C", "D", "E"].map((v) => ({ value: v, label: v })),
        },
        { name: "cnh_validade", label: "Validade da CNH", type: "date" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "disponivel", label: "Disponível" },
            { value: "em_operacao", label: "Em operação" },
            { value: "folga", label: "Folga" },
            { value: "inativo", label: "Inativo" },
          ],
        },
        { name: "observacoes", label: "Observações", type: "textarea" },
      ]}
      emptyLabel="Nenhum motorista cadastrado."
    />
  ),
});
