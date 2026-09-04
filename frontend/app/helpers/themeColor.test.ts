import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { persistThemeColor, readStoredThemeColor, resolveThemeColorValue } from './themeColor';

function installStorageMock() {
  const store = new Map<string, string>();
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      removeItem: (key: string) => {
        store.delete(key);
      },
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    },
  };
  return store;
}

describe('resolveThemeColorValue', () => {
  test('unwraps a `var(--…)` reference into its concrete value', () => {
    const get = (name: string) => ({ '--accent': '#0c60d9' })[name] ?? '';
    assert.equal(resolveThemeColorValue('var(--accent)', get), '#0c60d9');
  });

  test('returns plain color values unchanged', () => {
    const get = () => '';
    assert.equal(resolveThemeColorValue('#1c8f59', get), '#1c8f59');
  });
});

describe('theme color persistence', () => {
  test('stores the applied color so it can be restored synchronously on next startup', () => {
    const store = installStorageMock();
    persistThemeColor('#1c8f59');

    assert.equal(store.get('alexandrie-theme-color'), '#1c8f59');
    assert.equal(readStoredThemeColor(), '#1c8f59');
  });

  test('clears the stored color when the accent is unset', () => {
    installStorageMock();
    persistThemeColor('#1c8f59');
    persistThemeColor('');

    assert.equal(readStoredThemeColor(), '');
  });
});

describe('startup restore', () => {
  test('re-applies the persisted accent color to the theme-color meta on load', () => {
    installStorageMock();
    persistThemeColor('#1c8f59');

    // Mirrors the inline head script: restore before the app renders.
    const meta = { content: '#3956e7' };
    const stored = readStoredThemeColor();
    if (stored) meta.content = stored;

    assert.equal(meta.content, '#1c8f59');
  });

  test('falls back to the default color when nothing was persisted', () => {
    installStorageMock();

    const meta = { content: '#3956e7' };
    const stored = readStoredThemeColor();
    if (stored) meta.content = stored;

    assert.equal(meta.content, '#3956e7');
  });
});