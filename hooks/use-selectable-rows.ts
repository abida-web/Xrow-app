import { useCallback, useMemo, useState } from "react";

export interface UseSelectableRowsResult<T> {
  selectedIds: Set<string>;
  selectAll: boolean;
  toggleAll: () => void;
  toggleRow: (id: string) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  setSelectedIds: (ids: Set<string>) => void;
}

export function useSelectableRows<T extends { id: string }>(
  items: T[],
): UseSelectableRowsResult<T> {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectAll = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items.length, selectedIds],
  );

  const toggleAll = useCallback(() => {
    if (selectAll) {
      setSelectedIds(new Set());
      return;
    }

    setSelectedIds(new Set(items.map((item) => item.id)));
  }, [items, selectAll]);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  return {
    selectedIds,
    selectAll,
    toggleAll,
    toggleRow,
    clearSelection,
    isSelected,
    setSelectedIds,
  };
}
