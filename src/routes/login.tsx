import { createFileRoute, Link } from "@tanstack/react-router";
import { brand } from "@/config/site";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar no sistema | OSER" },
      {
        name: "description",
        content:
          "Acesse a plataforma OSER para gerenciar deslocamentos, motoristas, veículos e eventos em tempo real.",
      },
      { property: "og:title", content: "Entrar no sistema | OSER" },
      {
        property: "og:description",
        content: "Acesso à plataforma de gestão de mobilidade executiva da OSER.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-20">
      <div className="w-full max-w-sm">
        <Link to="/" className="wordmark text-lg text-foreground">
          {brand.name}
        </Link>
        <h1 className="mt-8 text-2xl font-semibold">Entrar no sistema</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Área de acesso da plataforma de gestão OSER.
        </p>

        <form className="mt-10 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="mt-2 w-full rounded-sm border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="voce@empresa.com.br"
            />
          </div>
          <div>
            <label htmlFor="senha" className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              className="mt-2 w-full rounded-sm border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-sm bg-primary px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-primary-foreground transition-all duration-300 hover:brightness-110"
          >
            Entrar
          </button>
        </form>

        <Link
          to="/"
          className="mt-8 inline-block text-xs tracking-[0.18em] uppercase text-muted-foreground transition-colors hover:text-primary"
        >
          Voltar ao site
        </Link>
      </div>
    </main>
  );
}
