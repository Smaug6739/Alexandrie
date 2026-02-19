export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay = 500) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let called = false;

  return (...args: Parameters<T>) => {
    if (!called) {
      fn(...args);
      called = true;
      timeout = setTimeout(() => {
        called = false;
        timeout = null;
      }, delay);
    } else {
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
