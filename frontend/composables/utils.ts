const colors = ['var(--blue)', 'var(--turquoise)', 'var(--yellow)', 'var(--pink)', 'var(--red)'];

export function useColorHash(str: string): string {
  // Calculer un hash unique pour la chaîne
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash % colors.length);
  return colors[index];
}

export interface APIResult<Data> {
  status: 'success' | 'error';
  message?: string;
  result?: Data;
}

export interface FetchOptions {
  id: string; // id of the ressource
}

export const baseUrl = import.meta.env.VITE_BASE_API?.toString() || '';
import type { DB_Document, DB_Category, DB_Ressource } from '../store/db_strustures';

export async function makeRequest(
  route: string,
  method: string,
  body: Object,
  retry = false,
): Promise<APIResult<DB_Document | DB_Category | DB_Ressource | DB_Document[] | DB_Category[] | DB_Ressource[]>> {
  const response = await fetch(`${baseUrl}/api/v1/${route}`, {
    method: method,
    body: method === 'GET' || method === 'DELETE' ? null : JSON.stringify(body),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    credentials: 'include',
  });

  if (response.status === 401 && !retry) {
    console.log('\x1b[41m[AUTH]\x1b[0m Access token invalid. Getting new access token...');
    const login = await makeRequest(`auth/refreshToken/152981937240150016`, 'GET', {}, true);
    if (login.status === 'success') {
      console.log('\x1b[42m[AUTH]\x1b[0m New access token received.');
      return await makeRequest(route, method, body, true);
    } else {
      console.log('\x1b[41m[AUTH]\x1b[0m Refresh token invalid. Please login again.');
      logOut();
      navigateTo('/login');
      return { status: 'error', message: 'Please login again.' };
    }
  }

  const decoded = await response.json();
  console.log('[SUCCESS] Response data:', decoded);
  return decoded;
}

export function logIn() {
  if (!import.meta.client) return;
  localStorage.setItem('isLoggedIn', 'true');
}
export function logOut() {
  if (!import.meta.client) return;
  localStorage.removeItem('isLoggedIn');
}
