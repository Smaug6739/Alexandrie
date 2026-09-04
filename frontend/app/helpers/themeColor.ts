export const THEME_COLOR_STORAGE_KEY = 'alexandrie-theme-color';

/** Resolve a CSS custom property value, unwrapping a single `var(--…)` reference. */
export function resolveThemeColorValue(value: string, get: (name: string) => string): string {
  const reference = value.match(/^var\((--[\w-]+)\)$/);
  if (reference) {
    return get(reference[1]);
  }
  return value;
}

/** Persist the applied theme color so it can be restored synchronously on next startup. */
export function persistThemeColor(color: string): void {
  try {
    if (color) {
      window.localStorage.setItem(THEME_COLOR_STORAGE_KEY, color);
    } else {
      window.localStorage.removeItem(THEME_COLOR_STORAGE_KEY);
    }
  } catch {
    // Storage may be unavailable (e.g. private browsing); the meta tag is still updated.
  }
}

/** Read the persisted theme color, if any. */
export function readStoredThemeColor(): string {
  try {
    return window.localStorage.getItem(THEME_COLOR_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}