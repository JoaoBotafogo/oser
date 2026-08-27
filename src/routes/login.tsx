import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { brand } from "@/config/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar ou cadastrar | OSER" },
      {
        name: "description",
        content:
          "Acesse ou crie sua conta na plataforma OSER para gerenciar deslocamentos, motoristas e veículos.",
      },
      { property: "og:title", content: "Entrar ou cadastrar | OSER" },
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

type Mode = "login" | "signup";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setNotice("Cadastro criado. Verifique seu e-mail para confirmar o acesso.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      navigate({ to: "/painel", replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível concluir a operação.";
      setError(translate(message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-20">
      <div className="w-full max-w-sm">
        <Link to="/" className="wordmark text-lg text-foreground">
          {brand.name}
        </Link>

        <h1 className="mt-8 text-2xl font-semibold">
          {mode === "login" ? "Entrar no sistema" : "Criar conta"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mode === "login"
            ? "Acesse a plataforma de gestão OSER."
            : "Cadastre-se para acessar a plataforma de gestão OSER."}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-px border border-border bg-border">
          {(["login", "signup"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setError(null);
                setNotice(null);
              }}
              className={cn(
                "px-4 py-3 text-xs tracking-[0.18em] uppercase transition-colors",
                mode === item
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {item === "login" ? "Entrar" : "Cadastre-se"}
            </button>
          ))}
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="text-xs tracking-[0.18em] uppercase text-muted-foreground"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-sm border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="voce@empresa.com.br"
            />
          </div>
          <div>
            <label
              htmlFor="senha"
              className="text-xs tracking-[0.18em] uppercase text-muted-foreground"
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-sm border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Mínimo de 6 caracteres"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {notice && <p className="text-sm text-primary">{notice}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-primary-foreground transition-all duration-300 hover:brightness-110 disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {mode === "login" ? "Entrar" : "Cadastrar e entrar"}
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

function translate(message: string) {
  const map: Record<string, string> = {
    "Invalid login credentials": "E-mail ou senha incorretos.",
    "User already registered": "Este e-mail já possui cadastro. Use a aba Entrar.",
    "Email not confirmed": "Confirme seu e-mail antes de entrar.",
    "Password should be at least 6 characters":
      "A senha deve ter pelo menos 6 caracteres.",
  };
  return map[message] ?? message;
}
