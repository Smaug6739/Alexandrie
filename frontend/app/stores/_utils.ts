export interface APIResult<Data> {
  status: 'success' | 'error';
  message: string;
  result?: Data;
}

export interface FetchOptions {
  id: string; // id of the ressource
}
function customFetch(route: string, method: string, body: object) {
  const { API } = useApi();
  if (route.endsWith('/')) route = route.slice(0, -1);
  return fetch(`${API}/${route}`, {
    method: method,
    body: method === 'GET' || method === 'DELETE' ? null : body instanceof FormData ? body : JSON.stringify(body),
    headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json; charset=UTF-8' },
    credentials: 'include',
  });
}

let refreshPromise: Promise<void> | null = null;

/**
 * Refresh the access token, ensuring only one refresh request occurs at a time.
 * Other requests wait for this refresh.
 */

async function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      console.log('[AUTH] Refreshing access token...');
      try {
        const res = await customFetch('auth/refresh', 'POST', {});
        const data = await res.json();

        if (!res.ok || data.status !== 'success') throw new Error('Refresh token invalid');

        console.log('[AUTH] Access token refreshed.');
      } catch {
        console.warn('[AUTH] Refresh failed, logging out.');

        useUserStore().post_logout();

        // Stop the navigation and redirect to login
        window.location.replace('/login');
        throw new Error('Refresh token invalid');
      }
    })();

    // reset the promise when done
    refreshPromise.finally(() => (refreshPromise = null));
  }

  return refreshPromise;
}

/**
 * Main function: sends an API request,
 * attempts a refresh if the token is expired,
 * and retries the request once if needed.
 */
export async function makeRequest<T>(route: string, method: string, body: object): Promise<APIResult<T>> {
  try {
    const response = await customFetch(route, method, body);
    const data = await response.json();

    if (response.ok && data.status === 'success') {
      return data;
    }

    // Invalid or expired token case -> try to refresh and retry
    if (response.status === 401 && (data.message === 'Bad access token.' || data.message === 'Missing token cookies.')) {
      try {
        await refreshAccessToken();

        // Retry the request once after refresh
        const retry = await customFetch(route, method, body);
        const retryData = await retry.json();
        return retryData;
      } catch {
        return { status: 'error', message: data.message || 'Authentication failed.' };
      }
    }

    return data;
  } catch (err) {
    console.error('[API ERROR]', err);
    return { status: 'error', message: String(err) };
  }
}
