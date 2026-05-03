// Simple event bus for drawio cache invalidation
type Listener = (payload?: unknown) => void;

const listeners = new Set<Listener>();

export function subscribeDrawioCacheInvalidated(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notifyDrawioCacheInvalidated(payload?: unknown) {
  listeners.forEach(fn => {
    try {
      fn(payload);
    } catch (e) {
      console.error('[useDrawioCache] listener error', e);
    }
  });
}

// Backwards-compatible alias
export const onDrawioCacheInvalidated = subscribeDrawioCacheInvalidated;
