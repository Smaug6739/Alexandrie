import type { Document, Category } from './db_strustures';

export interface APIResult<Data> {
  status: 'success' | 'error';
  message?: string;
  result?: Data;
}

export interface FetchOptions<K> {
  id: string; // id of the ressource
}

export const baseUrl = import.meta.env.VITE_BASE_API?.toString() || '';
export async function makeRequest(route: string, method: string, body: Object): Promise<APIResult<Document | Category | Document[] | Category[]>> {
  try {
    const responce = await fetch(`${baseUrl}/api/v1/${route}`, {
      method: method,
      body: method == 'GET' || method == 'DELETE' ? null : JSON.stringify(body),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      credentials: 'include',
    });
    const decoded = await responce.json();
    return decoded;
  } catch (e) {
    return { status: 'error', message: (e as Error).message };
  }
}
