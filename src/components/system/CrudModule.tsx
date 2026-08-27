import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageShell } from "@/components/system/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteRow, useRows, useSaveRow, type Row, type TableName } from "@/lib/system";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "datetime-local" | "textarea" | "select" | "email";
  options?: { value: string; label: string }[];
  required?: boolean;
  span?: boolean;
};

export type Column = {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
};

function toFormValue(value: unknown, type?: Field["type"]) {
  if (value === null || value === undefined) return "";
  if (type === "datetime-local") return String(value).slice(0, 16);
  if (type === "date") return String(value).slice(0, 10);
  return String(value);
}

export function CrudModule({
  table,
  title,
  description,
  columns,
  fields,
  emptyLabel = "Nenhum registro por aqui ainda.",
  orderBy,
}: {
  table: TableName;
  title: string;
  description?: string;
  columns: Column[];
  fields: Field[];
  emptyLabel?: string;
  orderBy?: string;
}) {
  const { data: rows = [], isLoading } = useRows(table, orderBy);
  const save = useSaveRow(table);
  const remove = useDeleteRow(table);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const emptyForm = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, ""])) as Record<string, string>,
    [fields],
  );

  function openNew() {
    setEditing(null);
    setValues(emptyForm);
    setError(null);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setValues(
      Object.fromEntries(
        fields.map((f) => [f.name, toFormValue(row[f.name], f.type)]),
      ) as Record<string, string>,
    );
    setError(null);
    setOpen(true);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = values[field.name] ?? "";
      if (raw === "") {
        payload[field.name] = field.type === "number" ? 0 : null;
        continue;
      }
      payload[field.name] = field.type === "number" ? Number(raw) : raw;
    }
    try {
      await save.mutateAsync({ id: editing?.id, values: payload });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    }
  }

  return (
    <PageShell
      title={title}
      description={description}
      action={
        <Button onClick={openNew} className="gap-2">
          <Plus className="size-4" /> Novo
        </Button>
      }
    >
      <div className="overflow-x-auto rounded-sm border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="text-xs tracking-[0.12em] uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                  Carregando…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                  {emptyLabel}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className="text-sm">
                      {column.render ? column.render(row) : ((row[column.key] as string) ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => openEdit(row)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Excluir"
                        onClick={() => remove.mutate(row.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar registro" : `Novo em ${title}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.span || field.type === "textarea" ? "sm:col-span-2" : undefined}
              >
                <Label htmlFor={field.name} className="text-xs tracking-[0.12em] uppercase">
                  {field.label}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    className="mt-2"
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.name}
                    className="mt-2 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
                    value={values[field.name] ?? ""}
                    required={field.required}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  >
                    <option value="">Selecione</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type ?? "text"}
                    className="mt-2"
                    required={field.required}
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            {error ? <p className="sm:col-span-2 text-sm text-destructive">{error}</p> : null}
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Salvando…" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
