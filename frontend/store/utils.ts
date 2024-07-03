export interface APIResult<Data> {
  status: 'success' | 'error';
  message?: string;
  result?: Data;
}

export interface FetchOptions {
  id: string; // id of the ressource
}

export const baseUrl = import.meta.env.VITE_BASE_API?.toString() || '';
