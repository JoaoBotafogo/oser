import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Download, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/system/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { exportCsv, useDeleteRow, useRows, useSaveRow, type Row, type TableName } from "@/lib/system";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "datetime-local" | "textarea" | "select" | "email";
  options?: { value: string; label: string }[] | undefined;
  required?: boolean;
  span?: boolean;
  help?: string | undefined;
};

export type Column = {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
  /** valor usado em busca, ordenação e exportação */
  value?: (row: Row) => string | number;
  sortable?: boolean;
  numeric?: boolean;
};

export type Filter = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  /** compara com o valor do campo; padrão = igualdade */
  match?: (row: Row, value: string) => boolean;
};

function toFormValue(value: unknown, type?: Field["type"]) {
  if (value === null || value === undefined) return "";
  if (type === "datetime-local") return String(value).slice(0, 16);
  if (type === "date") return String(value).slice(0, 10);
  return String(value);
}

function cellValue(column: Column, row: Row): string | number {
  if (column.value) return column.value(row);
  const raw = row[column.key];
  if (raw === null || raw === undefined) return "";
  return typeof raw === "number" ? raw : String(raw);
}

const PAGE_SIZES = [10, 25, 50, 100];

export function CrudModule({
  table,
  title,
  description,
  columns,
  fields,
  filters = [],
  summary,
  emptyLabel = "Nenhum registro por aqui ainda.",
  orderBy,
}: {
  table: TableName;
  title: string;
  description?: string | undefined;
  columns: Column[];
  fields: Field[];
  filters?: Filter[];
  summary?: ((rows: Row[]) => React.ReactNode) | undefined;
  emptyLabel?: string;
  orderBy?: string | undefined;
}) {
  const { data: rows = [], isLoading } = useRows(table, orderBy);
  const save = useSaveRow(table);
  const remove = useDeleteRow(table);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const emptyForm = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, ""])) as Record<string, string>,
    [fields],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = rows.filter((row) => {
      for (const filter of filters) {
        const selected = active[filter.key];
        if (!selected) continue;
        const ok = filter.match
          ? filter.match(row, selected)
          : String(row[filter.key] ?? "") === selected;
        if (!ok) return false;
      }
      if (!term) return true;
      return columns.some((column) =>
        String(cellValue(column, row)).toLowerCase().includes(term),
      );
    });

    if (sortKey) {
      const column = columns.find((c) => c.key === sortKey);
      if (column) {
        result = [...result].sort((a, b) => {
          const va = cellValue(column, a);
          const vb = cellValue(column, b);
          const cmp =
            typeof va === "number" && typeof vb === "number"
              ? va - vb
              : String(va).localeCompare(String(vb), "pt-BR", { numeric: true });
          return sortAsc ? cmp : -cmp;
        });
      }
    }
    return result;
  }, [rows, filters, active, search, columns, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasActiveFilters = Boolean(search) || Object.values(active).some(Boolean);

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

  function clearFilters() {
    setSearch("");
    setActive({});
    setPage(1);
  }

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortAsc((v) => !v);
      return;
    }
    setSortKey(key);
    setSortAsc(true);
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
      toast.success(editing ? "Registro atualizado." : "Registro criado.");
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível salvar.";
      setError(message);
      toast.error(message);
    }
  }

  async function confirmDelete() {
    if (!confirmId) return;
    try {
      await remove.mutateAsync(confirmId);
      toast.success("Registro excluído.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível excluir.");
    } finally {
      setConfirmId(null);
    }
  }

  function handleExport() {
    exportCsv(
      `oser-${table}`,
      columns.map((c) => c.label),
      filtered.map((row) => columns.map((column) => cellValue(column, row))),
    );
    toast.success(`${filtered.length} registro(s) exportado(s).`);
  }

  return (
    <PageShell
      title={title}
      description={description}
      action={
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport} disabled={!filtered.length}>
            <Download className="size-4" /> Exportar
          </Button>
          <Button onClick={openNew} className="gap-2">
            <Plus className="size-4" /> Novo
          </Button>
        </div>
      }
    >
      {summary ? <div className="mb-8">{summary(filtered)}</div> : null}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Buscar"
            placeholder="Buscar…"
            className="pl-9"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        {filters.map((filter) => (
          <select
            key={filter.key}
            aria-label={filter.label}
            className="h-10 rounded-sm border border-input bg-background px-3 text-sm"
            value={active[filter.key] ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setActive((prev) => ({ ...prev, [filter.key]: value }));
              setPage(1);
            }}
          >
            <option value="">{filter.label}: todos</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
        {hasActiveFilters ? (
          <Button variant="ghost" className="gap-2" onClick={clearFilters}>
            <X className="size-4" /> Limpar
          </Button>
        ) : null}
      </div>

      <p className="mt-3 text-xs tracking-[0.14em] uppercase text-muted-foreground">
        {filtered.length} de {rows.length} registro(s)
      </p>

      <div className="mt-3 overflow-x-auto rounded-sm border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="text-xs tracking-[0.12em] uppercase">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.label}
                    {sortKey === column.key ? (
                      sortAsc ? (
                        <ArrowUp className="size-3" />
                      ) : (
                        <ArrowDown className="size-3" />
                      )
                    ) : null}
                  </button>
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
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                  {hasActiveFilters ? "Nenhum resultado para os filtros aplicados." : emptyLabel}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className="text-sm">
                      {column.render ? column.render(row) : (cellValue(column, row) || "—")}
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
                        onClick={() => setConfirmId(row.id)}
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <label className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase">
          Por página
          <select
            aria-label="Registros por página"
            className="h-9 rounded-sm border border-input bg-background px-2 text-xs text-foreground"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span className="text-xs tracking-[0.14em] uppercase">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>

      <AlertDialog open={Boolean(confirmId)} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação é permanente e não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                {field.help ? (
                  <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>
                ) : null}
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
