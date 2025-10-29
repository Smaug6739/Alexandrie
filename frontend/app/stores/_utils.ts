export interface APIResult<Data> {
  status: 'success' | 'error';
  message: string;
  result?: Data;
}

export interface FetchOptions {
  id: string; // id of the ressource
}

let is_getting_new_token = false;
const requestQueue: {
  route: string;
  method: string;
  body: object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value: APIResult<any> | PromiseLike<APIResult<any>>) => void;
  reject: (reason?: object) => void;
}[] = [];

export async function makeRequest<T>(route: string, method: string, body: object, isTreatingQueue: boolean = false): Promise<APIResult<T>> {
  console.log(`[API] Requesting [${method}] to /${route}`);
  if (route[route.length - 1] === '/') route = route.slice(0, -1); // Remove trailing slash if present
  const promise = new Promise<APIResult<T>>((resolve, reject) => {
    if (!isTreatingQueue) requestQueue.push({ route, method, body, resolve, reject });
  });

  try {
    const response = await customFetch(method, route, body);
    const decoded = await response.json();

    if (response.ok && decoded.status === 'success') {
      requestQueue.pop();
    }

    if ((response.status === 401 && decoded.message === 'Bad access token.') || decoded.message === 'Missing token cookies.') {
      if (is_getting_new_token) return promise;
      console.log('\x1b[41m[AUTH]\x1b[0m Access token invalid. Getting new access token...');
      is_getting_new_token = true;
      const login = await useAPI('POST', `auth/refresh`, {});
      is_getting_new_token = false;
      if (login.status === 'success') {
        console.log('\x1b[42m[AUTH]\x1b[0m New access token received.');
        treatQueue();
      } else treatQueue(false);

      return promise;
    }
    return decoded;
  } catch (e) {
    return { status: 'error', message: String(e) };
  }
}
function treatQueue(access_token: boolean = true) {
  console.log(`[API] Treating queue with access_token: ${access_token}`);
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (!request) continue;
    if (!access_token) {
      request.resolve({ status: 'error', message: 'No acccess token.' });
      requestQueue.length = 0;
      useUserStore().post_logout();
      navigateTo('/login');
    } else {
      makeRequest(request.route, request.method, request.body, true).then(request.resolve).catch(console.info);
    }
  }
}

function customFetch(method: string, route: string, body: object) {
  const { API } = useApi();
  return fetch(`${API}/${route}`, {
    method: method,
    body: method === 'GET' || method === 'DELETE' ? null : body instanceof FormData ? body : JSON.stringify(body),
    headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json; charset=UTF-8' },
    credentials: 'include',
  });
}
async function useAPI(method: string, route: string, body: object) {
  try {
    const response = await customFetch(method, route, body);
    if (!response.ok) return { status: 'error', message: 'Failed to fetch' };
    const decoded = await response.json();
    return decoded;
  } catch {
    return { status: 'error', message: 'Failed to fetch.' };
  }
}
