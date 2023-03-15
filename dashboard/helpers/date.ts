export function timestampToString(timestamp: number | string): string {
  const date = new Date(parseInt(timestamp as string));
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: undefined,
    minute: undefined,
    second: undefined,
  });
}
