/** Unknown/new documents follow the saved sequence; other sorting breaks ties. */
export function compareManualOrder(a: string, b: string, order: unknown): number {
  if (!Array.isArray(order)) return 0;
  const rank = (id: string) => {
    const index = order.indexOf(id);
    return index < 0 ? order.length : index;
  };
  return rank(a) - rank(b);
}

/** Reorder the current siblings, dropping stale IDs and leaving the input untouched. */
export function moveDocument(ids: string[], source: string, target: string, after: boolean): string[] {
  if (source === target || !ids.includes(source) || !ids.includes(target)) return [...ids];
  const result = ids.filter(id => id !== source);
  result.splice(result.indexOf(target) + Number(after), 0, source);
  return result;
}
