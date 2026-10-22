// sort.js

/**
 * Sắp xếp mảng rows và trả về mảng mới, không mutate mảng gốc.
 * @param {Object[]} rows
 * @param {string} key
 * @param {'asc' | 'desc'} direction
 * @returns {Object[]}
 */
export function sortRows(rows, key, direction) {
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...rows].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * multiplier;
    }

    return String(valueA ?? '').localeCompare(
      String(valueB ?? '')
    ) * multiplier;
  });
}

/**
 * Xoay vòng trạng thái sắp xếp:
 * none -> asc -> desc -> none.
 *
 * @param {{ key: string, direction: 'asc' | 'desc' | 'none' } | null} current
 * @param {string} key
 * @returns {{ key: string, direction: 'asc' | 'desc' | 'none' }}
 */
export function nextSortState(current, key) {
  if (!current || current.key !== key) {
    return { key, direction: 'asc' };
  }

  switch (current.direction) {
    case 'none':
      return { key, direction: 'asc' };
    case 'asc':
      return { key, direction: 'desc' };
    case 'desc':
    default:
      return { key, direction: 'none' };
  }
}

/**
 * Chuyển trạng thái sắp xếp sang giá trị ARIA.
 *
 * @param {'asc' | 'desc' | 'none'} state
 * @returns {'ascending' | 'descending' | 'none'}
 */
export function ariaSortValue(state) {
  switch (state) {
    case 'asc':
      return 'ascending';
    case 'desc':
      return 'descending';
    case 'none':
    default:
      return 'none';
  }
}