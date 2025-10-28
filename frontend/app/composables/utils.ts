import type { PublicUser, User } from '~/stores/db_strustures';

export function useApi() {
  const config = useRuntimeConfig();
  const CDN = config.public.baseCdn;
  const API = `${config.public.baseApi}/api`;
  return { CDN, API };
}
// Little screen size
export const isMobile = () => (import.meta.client ? window.innerWidth <= 768 : false);
// Intermediate screen size
export const isTablet = () => (import.meta.client ? window.innerWidth <= 1280 : false);

export function useAvatar(user?: User | PublicUser | null): string {
  const { CDN } = useApi();
  return user?.avatar ? CDN + '/' + user.id + '/avatar' : '/default_avatar.avif';
}

export const appColors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'teal', 'grey'];
export function getAppColor(index: number = 0, defaultPrimary?: boolean): string {
  if ((defaultPrimary && index < 0) || index == -2) return 'primary';
  if (index == -1) return '';
  return appColors[index % appColors.length] || 'primary';
}

export function formatDate(timestamp: number | undefined): string {
  const date = new Date(timestamp || 0);
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}

export function setAppColor(color: string | number) {
  if (typeof color === 'number') {
    color = getAppColor(color);
  }
  if (color === 'primary') color = 'default';
  document.documentElement.style.setProperty('--primary', `var(--${color})`);
  document.documentElement.style.setProperty('--primary-bg', `var(--${color}-bg)`);
  document.documentElement.style.setProperty('--primary-border', `var(--${color}-border)`);

  usePreferences().set('darkMode', useColorMode().value === 'dark');
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
