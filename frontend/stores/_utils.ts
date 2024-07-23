export interface APIResult<Data> {
  status: 'success' | 'error';
  message: string;
  result?: Data;
}

export interface FetchOptions {
  id: string; // id of the ressource
}

let is_getting_new_token = false;
export async function makeRequest<T>(route: string, method: string, body: Object, retry = false): Promise<APIResult<T>> {
  try {
    const response = await fetch(`${API}/${route}`, {
      method: method,
      body: method === 'GET' || method === 'DELETE' ? null : body instanceof FormData ? body : JSON.stringify(body),
      headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json; charset=UTF-8' },
      credentials: 'include',
    });

    if (response.status === 401 && !retry && !is_getting_new_token) {
      console.log('\x1b[41m[AUTH]\x1b[0m Access token invalid. Getting new access token...');
      is_getting_new_token = true;
      const login = await makeRequest(`auth/refreshToken`, 'GET', {}, true);
      is_getting_new_token = false;
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
    return decoded;
  } catch {
    console.log('...');
  }
  console.log(`[API] Requesting ${method} ${route}`);
}

export function logIn() {
  if (!import.meta.client) return;
  localStorage.setItem('isLoggedIn', 'true');
}
export function logOut() {
  if (!import.meta.client) return;
  localStorage.removeItem('isLoggedIn');
}
