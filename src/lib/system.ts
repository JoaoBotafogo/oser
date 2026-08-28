import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TableName = "clientes" | "motoristas" | "veiculos" | "viagens";

export type Row = Record<string, unknown> & { id: string };

export function useRows(table: TableName, orderBy = "created_at", ascending = false) {
  return useQuery({
    queryKey: [table],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy, { ascending });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
}

export function useSaveRow(table: TableName) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string | undefined; values: Record<string, unknown> }) => {
      if (id) {
        const { error } = await supabase.from(table).update(values as never).eq("id", id);
        if (error) throw error;
        return;
      }
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from(table)
        .insert({ ...values, user_id: userData.user?.id } as never);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [table] }),
  });
}

export function useDeleteRow(table: TableName) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [table] }),
  });
}

export const brl = (value: unknown) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(value ?? 0),
  );

export const num = (value: unknown) => Number(value ?? 0).toLocaleString("pt-BR");

export const dateTime = (value: unknown) =>
  value ? new Date(String(value)).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

export const dateOnly = (value: unknown) =>
  value ? new Date(String(value)).toLocaleDateString("pt-BR") : "—";

/* ---------- Domínio: rótulos e tons ---------- */

export type Tone = "neutral" | "positive" | "warning" | "danger" | "info";

export const viagemStatus: Record<string, { label: string; tone: Tone }> = {
  agendada: { label: "Agendada", tone: "info" },
  em_andamento: { label: "Em andamento", tone: "warning" },
  concluida: { label: "Concluída", tone: "positive" },
  cancelada: { label: "Cancelada", tone: "danger" },
};

export const viagemTipos: Record<string, string> = {
  executivo: "Transporte executivo",
  aeroporto: "Aeroporto",
  evento: "Evento",
  vip: "VIP",
  corporativa: "Viagem corporativa",
};

export const motoristaStatus: Record<string, { label: string; tone: Tone }> = {
  disponivel: { label: "Disponível", tone: "positive" },
  em_servico: { label: "Em serviço", tone: "warning" },
  folga: { label: "Folga", tone: "neutral" },
  inativo: { label: "Inativo", tone: "danger" },
};

export const veiculoStatus: Record<string, { label: string; tone: Tone }> = {
  disponivel: { label: "Disponível", tone: "positive" },
  em_operacao: { label: "Em operação", tone: "warning" },
  manutencao: { label: "Manutenção", tone: "danger" },
  inativo: { label: "Inativo", tone: "neutral" },
};

export const veiculoCategorias: Record<string, string> = {
  executivo: "Executivo",
  suv: "SUV",
  van: "Van",
  eletrico: "Elétrico",
};

/* ---------- Períodos ---------- */

export type PeriodKey = "mes" | "30d" | "90d" | "ano" | "tudo";

export const periodOptions: { value: PeriodKey; label: string }[] = [
  { value: "mes", label: "Mês atual" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "ano", label: "Ano atual" },
  { value: "tudo", label: "Todo o período" },
];

export function inPeriod(value: unknown, period: PeriodKey) {
  if (period === "tudo") return true;
  if (!value) return false;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  if (period === "mes") {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  if (period === "ano") return date.getFullYear() === now.getFullYear();
  const days = period === "30d" ? 30 : 90;
  const from = new Date(now.getTime() - days * 86_400_000);
  return date >= from;
}

/* ---------- Exportação CSV ---------- */

export function exportCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (cell: string | number) => `"${String(cell ?? "").replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((line) => line.map(escape).join(";")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
