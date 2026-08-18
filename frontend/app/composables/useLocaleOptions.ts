const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/** Choices for language selectors, built from the locales declared in nuxt.config. */
export const useLocaleOptions = () => {
  const { locale, localeCodes } = useI18nT();

  return computed(() => {
    const displayNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames([locale.value], { type: 'language' }) : null;

    return localeCodes.value.map(code => ({
      id: code,
      label: capitalize(displayNames?.of(code) ?? code.toUpperCase()),
    }));
  });
};
