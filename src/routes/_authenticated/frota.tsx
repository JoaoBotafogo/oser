import { createFileRoute } from "@tanstack/react-router";
import { CrudModule } from "@/components/system/CrudModule";

export const Route = createFileRoute("/_authenticated/frota")({
  head: () => ({
    meta: [
      { title: "Frota | Sistema OSER" },
      { name: "description", content: "Controle da frota executiva: veículos, placas e quilometragem." },
      { property: "og:title", content: "Frota | Sistema OSER" },
      { property: "og:description", content: "Controle da frota executiva da OSER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudModule
      table="veiculos"
      title="Frota"
      description="Veículos executivos, SUVs, vans e elétricos com status e quilometragem."
      columns={[
        { key: "modelo", label: "Modelo" },
        { key: "placa", label: "Placa" },
        { key: "categoria", label: "Categoria" },
        { key: "ano", label: "Ano" },
        { key: "km_atual", label: "Km atual" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { name: "modelo", label: "Modelo", required: true },
        { name: "placa", label: "Placa", required: true },
        {
          name: "categoria",
          label: "Categoria",
          type: "select",
          options: [
            { value: "executivo", label: "Executivo" },
            { value: "suv", label: "SUV" },
            { value: "van", label: "Van" },
            { value: "eletrico", label: "Elétrico" },
          ],
        },
        { name: "ano", label: "Ano", type: "number" },
        { name: "cor", label: "Cor" },
        { name: "km_atual", label: "Km atual", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "disponivel", label: "Disponível" },
            { value: "em_operacao", label: "Em operação" },
            { value: "manutencao", label: "Manutenção" },
            { value: "inativo", label: "Inativo" },
          ],
        },
        { name: "observacoes", label: "Observações", type: "textarea" },
      ]}
      emptyLabel="Nenhum veículo cadastrado."
    />
  ),
});
