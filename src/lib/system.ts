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
    mutationFn: async ({ id, values }: { id?: string; values: Record<string, unknown> }) => {
      if (id) {
        const { error } = await supabase.from(table).update(values).eq("id", id);
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

export const dateTime = (value: unknown) =>
  value ? new Date(String(value)).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

export const dateOnly = (value: unknown) =>
  value ? new Date(String(value)).toLocaleDateString("pt-BR") : "—";
