export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T;
  sortable?: boolean;
}

export interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowSelect?: (item: T) => void;
  ariaLabel: string;
}

/**
 * ARIA invariants for an accessible Data Grid:
 *
 * 1. role="grid":
 *    The grid container MUST use role="grid" and have an accessible
 *    name provided by ariaLabel via aria-label.
 *
 * 2. role="row":
 *    Each logical row, including the header row, MUST use role="row".
 *
 * 3. role="gridcell":
 *    Each data cell MUST use role="gridcell" and belong to a row.
 *    Column headers SHOULD use role="columnheader".
 *
 * 4. aria-sort:
 *    Each sortable column header MUST expose its current sorting state
 *    using aria-sort when sorting is active. Valid values include
 *    "ascending", "descending", "none", and "other".
 *    This communicates the sort direction to assistive technologies.
 *    Only the currently sorted column should expose a non-"none"
 *    aria-sort value at a time for single-column sorting.
 */