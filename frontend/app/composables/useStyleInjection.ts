/**
 * Manages user-injected CSS styles in a safe, encapsulated way.
 *
 * - Styles are wrapped in CSS `@layer` to keep them lower priority than app defaults
 *   (unless the user explicitly uses `!important`).
 * - Each style sheet is a dedicated `<style>` element in the `<head>`.
 * - When disabled, the elements are fully **removed** from the DOM — not just emptied —
 *   so no residual overrides (CSS variables, etc.) can leak.
 * - On cleanup (component unmount), elements are also removed.
 */

interface StyleSheet {
  id: string;
  layer: string;
  el: HTMLStyleElement | null;
}

function createSheet(id: string, layer: string): StyleSheet {
  return { id, layer, el: null };
}

function mountSheet(sheet: StyleSheet, css: string) {
  if (!css.trim()) {
    unmountSheet(sheet);
    return;
  }

  if (!sheet.el) {
    sheet.el = document.createElement('style');
    sheet.el.id = sheet.id;
    sheet.el.setAttribute('data-user-injection', 'true');
    document.head.appendChild(sheet.el);
  }

  // Wrap in @layer so user styles have lower specificity than app defaults
  sheet.el.textContent = `@layer ${sheet.layer} {\n${css}\n}`;
}

function unmountSheet(sheet: StyleSheet) {
  if (sheet.el) {
    sheet.el.remove();
    sheet.el = null;
  }
}

export function useStyleInjection() {
  const preferences = usePreferencesStore();

  const enabled = preferences.get('stylesInjectionEnabled');
  const appCss = preferences.get('stylesInjection');
  const docsCss = preferences.get('stylesDocumentsInjection');

  const appSheet = createSheet('user-styles-app', 'user-app');
  const docsSheet = createSheet('user-styles-docs', 'user-documents');

  const apply = () => {
    if (!enabled.value) {
      unmountSheet(appSheet);
      unmountSheet(docsSheet);
      return;
    }
    mountSheet(appSheet, appCss.value);
    mountSheet(docsSheet, `.document-content {\n${docsCss.value}\n}`);
  };

  watch(enabled, apply, { immediate: true });
  watch(appCss, apply);
  watch(docsCss, apply);

  // Clean up on unmount
  onScopeDispose(() => {
    unmountSheet(appSheet);
    unmountSheet(docsSheet);
  });
}
