export interface APIResult<Data> {
  status: 'success' | 'error';
  result?: Data;
}
export const baseUrl = import.meta.env.VITE_BASE_API?.toString() || '';
