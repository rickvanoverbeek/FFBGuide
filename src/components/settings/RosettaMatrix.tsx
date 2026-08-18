"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { cn } from "@/lib/utils";

export interface MatrixColumn {
  slug: string;
  name: string;
  software: string;
  href: string;
}

export interface MatrixEntry {
  term: string;
  href: string;
  isDraft: boolean;
}

export interface MatrixRowData {
  slug: string;
  label: string;
  summary: string;
  /** One list per column, in the same order as `columns`. */
  cells: MatrixEntry[][];
}

export interface MatrixSectionData {
  category: string;
  label: string;
  rows: MatrixRowData[];
}

interface RosettaMatrixProps {
  columns: MatrixColumn[];
  sections: MatrixSectionData[];
}

/**
 * Concept rows × manufacturer columns. An empty cell is information, not a gap:
 * it means that manufacturer exposes no equivalent control.
 *
 * Columns can be switched off, which turns the matrix into a comparison of just
 * the brands you own. Rows that no selected manufacturer exposes are hidden by
 * default, since with a narrow selection they are mostly noise.
 */
export function RosettaMatrix({ columns, sections }: RosettaMatrixProps) {
  const [query, setQuery] = useState("");
  const [enabled, setEnabled] = useState<string[]>(() =>
    columns.map((column) => column.slug)
  );
  const [hideEmptyRows, setHideEmptyRows] = useState(true);

  function toggleColumn(slug: string) {
    setEnabled((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  // Column order always follows the source data, not the click order.
  const visibleIndexes = useMemo(
    () =>
      columns
        .map((column, index) => (enabled.includes(column.slug) ? index : -1))
        .filter((index) => index >= 0),
    [columns, enabled]
  );

  const visibleColumns = visibleIndexes.map((index) => columns[index]);
  const allOn = visibleIndexes.length === columns.length;

  const { filtered, hiddenEmptyCount } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cellsOf = (row: MatrixRowData) =>
      visibleIndexes.map((index) => row.cells[index]);
    const isEmptyRow = (row: MatrixRowData) =>
      cellsOf(row).every((entries) => entries.length === 0);

    const emptyRowCount = sections
      .flatMap((section) => section.rows)
      .filter(isEmptyRow).length;

    const result = sections
      .map((section) => ({
        ...section,
        rows: section.rows.filter((row) => {
          if (hideEmptyRows && isEmptyRow(row)) return false;
          if (!q) return true;

          if (
            row.label.toLowerCase().includes(q) ||
            row.summary.toLowerCase().includes(q) ||
            section.label.toLowerCase().includes(q)
          ) {
            return true;
          }

          return cellsOf(row).some((entries, position) =>
            entries.some(
              (entry) =>
                entry.term.toLowerCase().includes(q) ||
                columns[visibleIndexes[position]]?.name.toLowerCase().includes(q)
            )
          );
        }),
      }))
      .filter((section) => section.rows.length > 0);

    return {
      filtered: result,
      hiddenEmptyCount: hideEmptyRows ? emptyRowCount : 0,
    };
  }, [query, sections, columns, visibleIndexes, hideEmptyRows]);

  const rowCount = filtered.reduce((n, section) => n + section.rows.length, 0);

  return (
    <div>
      {/* Manufacturer filter */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-muted-foreground">
            Manufacturers
          </span>
          {columns.map((column) => {
            const on = enabled.includes(column.slug);
            return (
              <button
                key={column.slug}
                type="button"
                onClick={() => toggleColumn(column.slug)}
                aria-pressed={on}
                title={column.software}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
                  on
                    ? "border-primary/40 bg-primary/10 text-link"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Check
                  className={cn("h-3.5 w-3.5", on ? "opacity-100" : "opacity-0")}
                  aria-hidden="true"
                />
                {column.name}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setEnabled(allOn ? [] : columns.map((column) => column.slug))
            }
            className="ml-1 text-sm text-link hover:underline"
          >
            {allOn ? "Clear all" : "Select all"}
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search a term — DPR, damping, smoothing…"
          className="sm:max-w-sm"
        />
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <p className="text-sm text-muted-foreground">
            {rowCount} concept{rowCount === 1 ? "" : "s"} ·{" "}
            {visibleColumns.length} of {columns.length} manufacturers
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={hideEmptyRows}
              onChange={(event) => setHideEmptyRows(event.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--primary)]"
            />
            Hide concepts none of them expose
            {hideEmptyRows && hiddenEmptyCount > 0 && ` (${hiddenEmptyCount})`}
          </label>
        </div>
      </div>

      {visibleColumns.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          Select at least one manufacturer.
        </p>
      ) : rowCount === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          {query
            ? `Nothing matches "${query}".`
            : "No concepts to show for this selection."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th
                  scope="col"
                  className="sticky left-0 z-10 min-w-[190px] bg-muted/50 px-4 py-3 text-left font-medium text-foreground backdrop-blur"
                >
                  Concept
                </th>
                {visibleColumns.map((column) => (
                  <th
                    key={column.slug}
                    scope="col"
                    className="min-w-[150px] px-4 py-3 text-left font-medium text-foreground"
                  >
                    <Link href={column.href} className="hover:text-link">
                      {column.name}
                    </Link>
                    <span className="block text-xs font-normal text-muted-foreground">
                      {column.software}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {filtered.map((section) => (
              <tbody key={section.category}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={visibleColumns.length + 1}
                    className="border-y border-border bg-muted/30 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {section.label}
                  </th>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.slug} id={row.slug} className="border-b border-border/50">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-card px-4 py-3 text-left align-top font-medium text-foreground"
                    >
                      {row.label}
                      <span className="mt-0.5 block max-w-[220px] text-xs font-normal leading-5 text-muted-foreground">
                        {row.summary}
                      </span>
                    </th>
                    {visibleIndexes.map((index) => {
                      const entries = row.cells[index];
                      return (
                        <td key={columns[index].slug} className="px-4 py-3 align-top">
                          {entries.length === 0 ? (
                            <span
                              className="text-muted-foreground/50"
                              title="No equivalent setting documented"
                            >
                              —
                            </span>
                          ) : (
                            <ul className="space-y-1">
                              {entries.map((entry) => (
                                <li key={entry.href}>
                                  <Link
                                    href={entry.href}
                                    className="text-link hover:underline"
                                  >
                                    {entry.term}
                                  </Link>
                                  {entry.isDraft && (
                                    <span
                                      className="ml-1 text-xs text-muted-foreground"
                                      title="Draft — not yet checked against official documentation"
                                    >
                                      ·draft
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}
