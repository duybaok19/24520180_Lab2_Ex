export function setupGridKeyboardNavigation(tbody, onRowSelect) {
  const getCells = (row) =>
    Array.from(row.querySelectorAll('[role="gridcell"]'));

  const getRows = () =>
    Array.from(tbody.querySelectorAll('tr')).filter(
      (row) => getCells(row).length > 0
    );

  const getRowData = (row) =>
    Array.from(row.querySelectorAll('[role="gridcell"]')).map(
      (cell) => cell.textContent.trim()
    );

  const cells = getRows().flatMap(getCells);

  cells.forEach((cell) => {
    cell.tabIndex = -1;
  });

  if (cells.length > 0) {
    cells[0].tabIndex = 0;
  }

  // A single delegated keyboard listener on tbody.
  tbody.addEventListener('keydown', (event) => {
    const key = event.key;
    const navigationKeys = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight'
    ];

    if (navigationKeys.includes(key) || key === ' ') {
      event.preventDefault();
    }

    if (!(event.target instanceof Element)) {
      return;
    }

    const currentCell = event.target.closest('[role="gridcell"]');

    if (!currentCell || !tbody.contains(currentCell)) {
      return;
    }

    const rows = getRows();
    const currentRow = currentCell.closest('tr');
    const rowIndex = rows.indexOf(currentRow);
    const rowCells = getCells(currentRow);
    const colIndex = rowCells.indexOf(currentCell);

    let targetRowIndex = rowIndex;
    let targetColIndex = colIndex;

    switch (key) {
      case 'ArrowUp':
        targetRowIndex = Math.max(0, rowIndex - 1);
        break;

      case 'ArrowDown':
        targetRowIndex = Math.min(rows.length - 1, rowIndex + 1);
        break;

      case 'ArrowLeft':
        targetColIndex = Math.max(0, colIndex - 1);
        break;

      case 'ArrowRight':
        targetColIndex = Math.min(rowCells.length - 1, colIndex + 1);
        break;

      case 'Enter':
        onRowSelect?.(getRowData(currentRow));
        return;

      case ' ':
        currentRow.setAttribute(
          'aria-selected',
          currentRow.getAttribute('aria-selected') === 'true'
            ? 'false'
            : 'true'
        );
        return;

      default:
        return;
    }

    const targetRow = rows[targetRowIndex];
    if (!targetRow) return;

    const targetCells = getCells(targetRow);
    const targetCell = targetCells[
      Math.min(targetColIndex, targetCells.length - 1)
    ];

    if (!targetCell) return;

    currentCell.tabIndex = -1;
    targetCell.tabIndex = 0;
    targetCell.focus();
  });
}