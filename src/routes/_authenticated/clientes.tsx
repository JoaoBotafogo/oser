import { createFileRoute } from "@tanstack/react-router";
import { CrudModule } from "@/components/system/CrudModule";

export const Route = createFileRoute("/_authenticated/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes | Sistema OSER" },
      { name: "description", content: "Cadastro de clientes corporativos e contatos da OSER." },
      { property: "og:title", content: "Clientes | Sistema OSER" },
      { property: "og:description", content: "Cadastro de clientes corporativos da OSER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudModule
      table="clientes"
      title="Clientes"
      description="Contas corporativas, contatos e preferências de atendimento."
      columns={[
        { key: "nome", label: "Nome" },
        { key: "empresa", label: "Empresa" },
        { key: "email", label: "E-mail" },
        { key: "telefone", label: "Telefone" },
      ]}
      fields={[
        { name: "nome", label: "Nome", required: true },
        { name: "empresa", label: "Empresa" },
        { name: "email", label: "E-mail", type: "email" },
        { name: "telefone", label: "Telefone" },
        { name: "observacoes", label: "Observações", type: "textarea" },
      ]}
      emptyLabel="Nenhum cliente cadastrado."
    />
  ),
});
