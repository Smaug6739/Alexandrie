import type { DB_Category, DB_Document, DB_Ressource } from './db_strustures';

export interface APIResult<Data> {
  status: 'success' | 'error';
  message?: string;
  result?: Data;
}

export interface FetchOptions {
  id: string; // id of the ressource
}

export const baseUrl = import.meta.env.VITE_BASE_API?.toString() || '';
export async function makeRequest(
  route: string,
  method: string,
  body: Object,
  retry = false,
): Promise<APIResult<DB_Document | DB_Category | DB_Ressource | DB_Document[] | DB_Category[] | DB_Ressource[]>> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/${route}`, {
      method: method,
      body: method == 'GET' || method == 'DELETE' ? null : JSON.stringify(body),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      credentials: 'include',
    });
    if (response.status == 401 && !retry) {
      console.log('[AUTH] Getting new access token...');
      const login = await makeRequest(`auth/refreshToken/152981937240150016`, 'GET', {}, true);
      if (login.status == 'success') return makeRequest(route, method, body, true);
      else throw new Error('Not connected');
    }
    const decoded = await response.json();
    return decoded;
  } catch (e) {
    return { status: 'error', message: (e as Error).message };
  }
}
