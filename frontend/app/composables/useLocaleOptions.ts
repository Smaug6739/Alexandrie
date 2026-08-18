import type { Locale } from 'vue-i18n';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Name of a locale written in that locale itself (endonym), e.g. 'fr' → 'Français'.
 * Falls back to the uppercased code when Intl.DisplayNames is unavailable.
 */
const localeDisplayName = (code: Locale) => {
  if (typeof Intl.DisplayNames !== 'function') return code.toUpperCase();
  return capitalize(new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code.toUpperCase());
};

/** Choices for language selectors, built from the locales declared in nuxt.config. */
export const useLocaleOptions = () => {
  const { localeCodes } = useI18nT();

  return computed(() => localeCodes.value.map(code => ({ id: code, label: localeDisplayName(code) })));
};
