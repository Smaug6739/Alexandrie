export interface APIResult<Data> {
  status: 'success' | 'error';
  result?: Data;
}
export interface Result<T> extends APIResult<T> {
  type: 'cache' | 'api';
}
export const baseUrl = import.meta.env.VITE_BASE_API?.toString() || '';
