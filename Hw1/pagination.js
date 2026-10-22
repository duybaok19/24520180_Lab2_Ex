// paginate.js

export function paginate(rows, page, pageSize) {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError('pageSize must be a positive integer');
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(
    Math.max(1, Math.floor(page) || 1),
    totalPages
  );

  const startIndex = (currentPage - 1) * pageSize;
  const items = rows.slice(startIndex, startIndex + pageSize);

  return {
    items,
    page: currentPage,
    totalPages
  };
}