export function timestampToString(timestamp: number | string): string {
  const date = new Date(parseInt(timestamp as string));
  return date.toLocaleString();
}
