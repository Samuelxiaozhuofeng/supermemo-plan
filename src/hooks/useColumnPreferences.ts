import { useEffect, useState } from "react";
import type { ColumnKey } from "../types";

const STORAGE_KEY = "supermemo-plan-core:columns";
const DEFAULT_COLUMNS: ColumnKey[] = ["fixedStart", "actualStart", "actualEnd"];

function loadColumns(): Set<ColumnKey> {
  if (typeof localStorage === "undefined") {
    return new Set(DEFAULT_COLUMNS);
  }
  const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as ColumnKey[] | null;
  return new Set(Array.isArray(parsed) ? parsed : DEFAULT_COLUMNS);
}

export function useColumnPreferences() {
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(() => loadColumns());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visibleColumns]));
  }, [visibleColumns]);

  return {
    visibleColumns,
    toggleColumn: (column: ColumnKey) =>
      setVisibleColumns((current) => {
        const next = new Set(current);
        if (next.has(column)) {
          next.delete(column);
        } else {
          next.add(column);
        }
        return next;
      }),
  };
}
