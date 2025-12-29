/**
 * Core application utilities
 * Contains API configuration, screen size helpers, colors, and debounce functions
 */
import type { PublicUser, User } from '~/stores/db_strustures';

/** Provides API and CDN base URLs from runtime config */
export function useApi() {
  const config = useRuntimeConfig();
  const CDN = config.public.baseCdn;
  const API = `${config.public.baseApi}/api`;
  return { CDN, API };
}

// Screen size breakpoints
export const isMobile = () => (import.meta.client ? window.innerWidth <= 768 : false);
export const isTablet = () => (import.meta.client ? window.innerWidth <= 1280 : false);

/** Get user avatar URL or fallback to default */
export function useAvatar(user?: User | PublicUser | null): string {
  const { CDN } = useApi();
  return user?.avatar ? CDN + '/' + user.id + `/avatar?v=${user.avatar}` : '/default_avatar.avif';
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay = 500) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let called = false;

  return (...args: Parameters<T>) => {
    if (!called) {
      // premier appel : exécution immédiate
      fn(...args);
      called = true;
      timeout = setTimeout(() => {
        called = false;
        timeout = null;
      }, delay);
    } else {
      // si on spam, on relance le timer et on exécute à la fin
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn(...args);
        called = false;
        timeout = null;
      }, delay);
    }
  };
}

/**
 * Creates a debounced version of the provided function that delays its execution until after
 * a specified wait time has elapsed since the last time it was invoked. Unlike the standard
 * debounce, this version only executes the function after the delay period, and resets the timer
 * on each call (no immediate execution).
 *
 * @param fn - The function to debounce.
 * @param delay - The number of milliseconds to delay invocation (default: 2000).
 * @returns A debounced function that delays invoking `fn` until after `delay` ms have elapsed since the last call.
 */
export function debounceDelayed<T extends (...args: unknown[]) => void>(fn: T, delay = 2000) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    // Cancel the previous timer
    if (timeout) clearTimeout(timeout);

    // Launch a new timer
    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, delay);
  };
}

/**
 * Creates a debounced function similar to VueUse's useDebounceFn.
 * Useful for search inputs where you want to wait for the user to stop typing.
 * Works with both sync and async functions.
 *
 * @param fn - The function to debounce (can be async)
 * @param delay - The number of milliseconds to delay (default: 300)
 * @returns A debounced function
 */
export function useDebounceFn<T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, delay);
  };
}
