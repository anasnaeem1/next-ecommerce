"use client";

import { ReactNode, useMemo, useState } from "react";

export type AdminTableColumn = {
  key: string;
  label: string;
  className?: string;
};

type AdminListTableProps<T> = {
  title: string;
  columns: AdminTableColumn[];
  rows: T[];
  searchPlaceholder?: string;
  searchBy: (row: T) => string;
  renderRow: (row: T) => ReactNode;
  rightControls?: ReactNode;
  emptyText?: string;
  containerClassName?: string;
};

export default function AdminListTable<T>({
  title,
  columns,
  rows,
  searchPlaceholder = "Search...",
  searchBy,
  renderRow,
  rightControls,
  emptyText = "No records found.",
  containerClassName = "",
}: AdminListTableProps<T>) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) => searchBy(row).toLowerCase().includes(normalized));
  }, [rows, query, searchBy]);

  return (
    <div className={`flex flex-col gap-5 h-full min-h-full ${containerClassName}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <h1 className="text-lg text-slate-900 font-semibold">{title}</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full sm:w-72 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-300"
          />
          {rightControls}
        </div>
      </div>

      <div className="w-full bg-white h-full border border-slate-300 rounded-xl overflow-hidden shadow-sm">
        <div className="max-h-[690px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide ${column.className || ""}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-8 text-sm text-slate-500">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => renderRow(row))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
