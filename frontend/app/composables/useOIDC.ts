/**
 * OIDC Authentication Composable
 * Handles OpenID Connect authentication flows with frontend callback
 */

import { makeRequest } from '~/stores/_utils';

export interface OIDCProvider {
  name: string;
  authorization_endpoint: string;
}

export interface OIDCProvidersResponse {
  enabled: boolean;
  providers: OIDCProvider[];
}

export interface UserOIDCProvider {
  id: string;
  user_id: string;
  provider_name: string;
  provider_user_id: string;
  created_timestamp: number;
  updated_timestamp: number;
}

export interface AuthorizeResponse {
  auth_url: string;
  state: string;
  redirect_uri: string;
}

export interface CallbackResponse {
  // Login flow response
  user?: {
    id: string;
    username: string;
    email: string;
  };
  is_new?: boolean;
  provider: string;
  // Link flow response
  linked?: boolean;
}

// Storage keys for OIDC state
const OIDC_STATE_KEY = 'oidc_state';
const OIDC_PROVIDER_KEY = 'oidc_provider';
const OIDC_REDIRECT_URI_KEY = 'oidc_redirect_uri';
const OIDC_FLOW_KEY = 'oidc_flow'; // 'login' or 'link'

export function useOIDC() {
  const providers = ref<OIDCProvider[]>([]);
  const isEnabled = ref(false);
  const isLoading = ref(false);
  const linkedProviders = ref<UserOIDCProvider[]>([]);

  /**
   * Fetch available OIDC providers from the backend
   */
  async function fetchProviders(): Promise<void> {
    isLoading.value = true;

    try {
      const response = await makeRequest<OIDCProvidersResponse>('auth/oidc/providers', 'GET', {});
      if (response.status === 'success' && response.result) {
        isEnabled.value = response.result.enabled;
        providers.value = response.result.providers || [];
      } else {
        isEnabled.value = false;
        providers.value = [];
      }
    } catch {
      isEnabled.value = false;
      providers.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Initiate OIDC login flow for a provider
   * Gets auth URL from backend, stores state, and redirects
   */
  async function loginWithProvider(providerName: string): Promise<Error | undefined> {
    try {
      const response = await makeRequest<AuthorizeResponse>(
        `auth/oidc/${providerName.toLowerCase()}/authorize?redirect_uri=${encodeURIComponent(window.location.origin + '/login/oidc/callback')}`,
        'GET',
        {},
      );

      if (response.status === 'success' && response.result) {
        // Store state and redirect_uri in sessionStorage for callback validation
        if (import.meta.client) {
          sessionStorage.setItem(OIDC_STATE_KEY, response.result.state);
          sessionStorage.setItem(OIDC_PROVIDER_KEY, providerName.toLowerCase());
          sessionStorage.setItem(OIDC_REDIRECT_URI_KEY, response.result.redirect_uri);
          sessionStorage.setItem(OIDC_FLOW_KEY, 'login');
        }
        // Redirect to the provider's authorization page
        window.location.href = response.result.auth_url;
      } else {
        throw new Error(response.message || 'Failed to get authorization URL');
      }
    } catch (e) {
      return e as Error;
    }
  }

  /**
   * Handle the OIDC callback - exchange code for session
   * Called from the callback page after provider redirects back
   */
  async function handleCallback(): Promise<CallbackResponse> {
    if (!import.meta.client) {
      throw new Error('Callback must be handled on client side');
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const errorParam = params.get('error');
    const errorDescription = params.get('error_description');

    // Handle provider errors
    if (errorParam) {
      const message = errorDescription || errorParam;
      throw new Error(message);
    }

    if (!code) {
      throw new Error('No authorization code received');
    }

    if (!state) {
      throw new Error('No state parameter received');
    }

    // Validate state matches what we stored
    const storedState = sessionStorage.getItem(OIDC_STATE_KEY);
    const storedProvider = sessionStorage.getItem(OIDC_PROVIDER_KEY);
    const storedRedirectUri = sessionStorage.getItem(OIDC_REDIRECT_URI_KEY);

    if (!storedState || storedState !== state) {
      throw new Error('Invalid state - possible CSRF attack');
    }

    if (!storedProvider) {
      throw new Error('No provider found in session');
    }

    if (!storedRedirectUri) {
      throw new Error('No redirect URI found in session');
    }

    // Clear stored state (one-time use)
    sessionStorage.removeItem(OIDC_STATE_KEY);
    sessionStorage.removeItem(OIDC_PROVIDER_KEY);
    sessionStorage.removeItem(OIDC_REDIRECT_URI_KEY);
    sessionStorage.removeItem(OIDC_FLOW_KEY);

    // Exchange code for session via backend
    const response = await makeRequest<CallbackResponse>(`auth/oidc/${storedProvider}/callback`, 'POST', {
      code,
      state,
      redirect_uri: storedRedirectUri,
    });

    if (response.status === 'success' && response.result) {
      // Only store login state for login flow (not link flow)
      if (!response.result.linked) {
        localStorage.setItem('isLoggedIn', 'true');
      }
      return response.result;
    }

    throw new Error(response.message || 'Failed to complete authentication');
  }

  /**
   * Fetch OIDC providers linked to the current user
   */
  async function fetchLinkedProviders(): Promise<void> {
    try {
      const response = await makeRequest<UserOIDCProvider[]>('auth/oidc/linked', 'GET', {});
      if (response.status === 'success' && response.result) {
        linkedProviders.value = response.result;
      }
    } catch {
      linkedProviders.value = [];
    }
  }

  /**
   * Link a new OIDC provider to the current user
   * Returns auth URL for redirect
   */
  async function linkProvider(providerName: string): Promise<Error | undefined> {
    try {
      const response = await makeRequest<AuthorizeResponse>(
        `auth/oidc/${providerName.toLowerCase()}/link?redirect_uri=${encodeURIComponent(window.location.origin + '/login/oidc/callback')}`,
        'POST',
        {},
      );

      if (response.status === 'success' && response.result) {
        // Store state for callback
        if (import.meta.client) {
          sessionStorage.setItem(OIDC_STATE_KEY, response.result.state);
          sessionStorage.setItem(OIDC_PROVIDER_KEY, providerName.toLowerCase());
          sessionStorage.setItem(OIDC_REDIRECT_URI_KEY, response.result.redirect_uri);
          sessionStorage.setItem(OIDC_FLOW_KEY, 'link');
        }

        // Redirect to provider
        window.location.href = response.result.auth_url;
      } else {
        throw new Error(response.message || 'Failed to initiate link');
      }
    } catch (e) {
      return e as Error;
    }
  }

  /**
   * Unlink an OIDC provider from the current user
   */
  async function unlinkProvider(providerName: string): Promise<Error | undefined> {
    try {
      const response = await makeRequest(`auth/oidc/${providerName.toLowerCase()}/unlink`, 'DELETE', {});
      if (response.status === 'success') {
        linkedProviders.value = linkedProviders.value.filter(p => p.provider_name.toLowerCase() !== providerName.toLowerCase());
      }
      throw new Error(response.message || 'Failed to unlink provider');
    } catch (e) {
      return e as Error;
    }
  }

  /**
   * Check if a provider is linked to the current user
   */
  function isProviderLinked(providerName: string): boolean {
    return linkedProviders.value.some(p => p.provider_name.toLowerCase() === providerName.toLowerCase());
  }

  /**
   * Check if there's an OIDC error in the URL (for direct display on login page)
   */
  function getUrlError(): string | null {
    if (!import.meta.client) return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('error') || params.get('error_description');
  }

  return {
    // State
    providers,
    isEnabled,
    isLoading,
    linkedProviders,

    // Methods
    fetchProviders,
    loginWithProvider,
    handleCallback,
    fetchLinkedProviders,
    linkProvider,
    unlinkProvider,
    isProviderLinked,
    getUrlError,
  };
}
