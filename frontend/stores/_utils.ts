export interface APIResult<Data> {
  status: 'success' | 'error';
  message: string;
  result?: Data;
}

export interface FetchOptions {
  id: string; // id of the ressource
}

let is_getting_new_token = false;
const requestQueue: { route: string; method: string; body: Object; resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];

export async function makeRequest<T>(route: string, method: string, body: Object, isTreatingQueue: boolean = false): Promise<APIResult<T>> {
  console.log(`[API] Requesting [${method}] to /${route}`);

  const promise = new Promise<APIResult<T>>((resolve, reject) => {
    if (!isTreatingQueue) requestQueue.push({ route, method, body, resolve, reject });
  });

  try {
    const response = await customFetch(method, route, body);

    if (response.status === 401) {
      if (is_getting_new_token) return promise;

      console.log('\x1b[41m[AUTH]\x1b[0m Access token invalid. Getting new access token...');
      is_getting_new_token = true;
      const login = await useAPI('GET', `auth/refreshToken`, {});
      is_getting_new_token = false;
      if (login.status === 'success') {
        console.log('\x1b[42m[AUTH]\x1b[0m New access token received.');
        treatQueue();
      } else treatQueue(false);

      return promise;
    }
    const decoded = await response.json();
    return decoded;
  } catch (e) {
    return { status: 'error', message: String(e) };
  }
}

function treatQueue(access_token: boolean = true) {
  console.log(`[API] Treating queue with access_token: ${access_token}`);

  if (!access_token) {
    for (const request of requestQueue) {
      request.resolve({ status: 'error', message: 'Failed to fetch.' });
    }
    useUserStore().logout();
    navigateTo('/login');
  } else {
    for (const request of requestQueue) {
      makeRequest(request.route, request.method, request.body, true).then(request.resolve).catch(request.reject);
    }
  }
}

function customFetch(method: string, route: string, body: Object) {
  return fetch(`${API}/${route}`, {
    method: method,
    body: method === 'GET' || method === 'DELETE' ? null : body instanceof FormData ? body : JSON.stringify(body),
    headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json; charset=UTF-8' },
    credentials: 'include',
  });
}
async function useAPI(method: string, route: string, body: Object) {
  try {
    const response = await customFetch(method, route, body);
    if (!response.ok) return { status: 'error', message: 'Failed to fetch' };
    const decoded = await response.json();
    return decoded;
  } catch {
    return { status: 'error', message: 'Failed to fetch.' };
  }
}
