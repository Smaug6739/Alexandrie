/**
 * API utilities for making authenticated requests using Nuxt's $fetch
 * Handles token refresh and retry logic automatically
 * SSR-compatible with proper cookie handling
 */

import type { WatchSource } from 'vue';

export interface APIResult<Data> {
  status: 'success' | 'error';
  message: string;
  result?: Data;
}

export interface FetchOptions {
  id: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Singleton promise to prevent concurrent token refresh */
let refreshPromise: Promise<void> | null = null;

/**
 * Creates a configured $fetch instance with the API base URL
 * Uses Nuxt's native $fetch for better SSR support and automatic JSON handling
 */
function getApiBaseUrl(): string {
  const config = useRuntimeConfig();
  return `${config.public.baseApi}/api`;
}

/**
 * Normalize route by removing trailing slash
 */
function normalizeRoute(route: string): string {
  return route.endsWith('/') ? route.slice(0, -1) : route;
}

/**
 * Build request body based on method and content type
 */
function buildRequestBody(method: HttpMethod, body: object): BodyInit | undefined {
  const isBodyMethod = method !== 'GET' && method !== 'DELETE';
  if (!isBodyMethod) return undefined;

  return body instanceof FormData ? body : JSON.stringify(body);
}

/**
 * Build request headers based on body type
 */
function buildRequestHeaders(body: object): HeadersInit {
  return body instanceof FormData ? {} : { 'Content-Type': 'application/json; charset=UTF-8' };
}

/**
 * Low-level fetch using Nuxt's $fetch
 * Provides error handling and automatic response parsing
 */
async function apiFetch<T>(route: string, method: HttpMethod, body: object): Promise<APIResult<T> & { _statusCode?: number }> {
  const baseUrl = getApiBaseUrl();
  const normalizedRoute = normalizeRoute(route);

  const response = await $fetch.raw<APIResult<T>>(`${baseUrl}/${normalizedRoute}`, {
    method,
    body: buildRequestBody(method, body),
    headers: buildRequestHeaders(body),
    credentials: 'include',
    // Prevent $fetch from throwing on non-2xx responses to handle them manually
    ignoreResponseError: true,
  });

  return {
    ...(response._data as APIResult<T>),
    _statusCode: response.status,
  };
}

/**
 * Refresh the access token, ensuring only one refresh request occurs at a time.
 * Other concurrent requests will wait for the same refresh promise.
 */
async function refreshAccessToken(): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    console.log('[AUTH] Refreshing access token...');

    try {
      const baseUrl = getApiBaseUrl();
      const response = await $fetch.raw<APIResult<unknown>>(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        ignoreResponseError: true,
      });

      const data = response._data;
      if (response.status !== 200 || data?.status !== 'success') {
        throw new Error('Refresh token invalid');
      }

      console.log('[AUTH] Access token refreshed successfully.');
    } catch (error) {
      console.warn('[AUTH] Refresh failed, logging out.', error);

      // Clear user state
      useUserStore().post_logout();

      // Redirect to login (client-side only)
      if (import.meta.client) {
        navigateTo('/login', { replace: true });
      }

      throw new Error('Refresh token invalid');
    } finally {
      // Reset the promise so future refreshes can occur
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Check if error response indicates an expired/invalid token
 */
function isAuthError(response: APIResult<unknown> & { _statusCode?: number }): boolean {
  return response._statusCode === 401 && (response.message === 'Bad access token.' || response.message === 'Missing token cookies.');
}

/**
 * Main API request function with automatic token refresh and retry
 *
 * Features:
 * - Uses Nuxt's $fetch for SSR compatibility
 * - Automatic token refresh on 401 errors
 * - Single retry after successful token refresh
 * - Concurrent refresh requests are deduplicated
 *
 * @param route - API endpoint (without base URL)
 * @param method - HTTP method
 * @param body - Request body (ignored for GET/DELETE)
 * @returns APIResult with status, message, and optional result
 */
export async function makeRequest<T>(route: string, method: HttpMethod, body: object = {}): Promise<APIResult<T>> {
  try {
    const response = await apiFetch<T>(route, method, body);

    // Success case
    if (response.status === 'success') {
      return response;
    }

    // Auth error - attempt refresh and retry
    if (isAuthError(response)) {
      try {
        await refreshAccessToken();

        // Retry the original request after successful refresh
        const retryResponse = await apiFetch<T>(route, method, body);
        return retryResponse;
      } catch {
        return {
          status: 'error',
          message: response.message || 'Authentication failed.',
        };
      }
    }

    // Other error - return as-is
    return response;
  } catch (err) {
    console.error('[API ERROR]', err);
    return {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Composable for reactive API calls with Nuxt's useAsyncData
 * Use this for data that should be fetched on component mount and cached
 *
 * @param key - Unique key for caching
 * @param route - API endpoint
 * @param options - Additional options
 */
export function useApiData<T>(
  key: string,
  route: string,
  options: {
    method?: HttpMethod;
    body?: object;
    immediate?: boolean;
    watch?: WatchSource[];
  } = {},
) {
  const { method = 'GET' as HttpMethod, body = {}, immediate = true, watch: watchSources } = options;

  return useAsyncData<APIResult<T>>(key, () => makeRequest<T>(route, method, body), {
    immediate,
    watch: watchSources,
  });
}

/**
 * Composable for lazy API calls (triggered manually)
 * Useful for mutations (POST, PUT, DELETE) or conditional fetching
 *
 * @param route - API endpoint
 * @param method - HTTP method
 */
export function useApiMutation<T, TBody extends object = object>(route: string, method: HttpMethod = 'POST') {
  const pending = ref(false);
  const error = ref<string | null>(null);
  const data = ref<T | null>(null);

  async function mutate(body: TBody = {} as TBody): Promise<APIResult<T>> {
    pending.value = true;
    error.value = null;

    try {
      const response = await makeRequest<T>(route, method, body);

      if (response.status === 'success') {
        data.value = response.result ?? null;
      } else {
        error.value = response.message;
      }

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      error.value = message;
      return { status: 'error', message };
    } finally {
      pending.value = false;
    }
  }

  return {
    mutate,
    pending: readonly(pending),
    error: readonly(error),
    data: readonly(data),
  };
}
