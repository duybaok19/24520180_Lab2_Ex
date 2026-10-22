
export function filterRows(rows, query, keys) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return [...rows];
  }

  return rows.filter((row) =>
    keys.some((key) =>
      String(row[key] ?? "")
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    )
  );
}
