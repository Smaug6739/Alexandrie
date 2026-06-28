export function useFavicon() {
  let mediaQuery: MediaQueryList | null = null;
  let onThemeChange: ((event: MediaQueryListEvent) => void) | null = null;

  const setFavicon = (isDark: boolean) => {
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      document.head.appendChild(link);
    }
    link.href = isDark ? '/favicon-dark.ico' : '/favicon.ico';
  };

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    onThemeChange = e => setFavicon(e.matches);

    setFavicon(mediaQuery.matches);
    mediaQuery.addEventListener('change', onThemeChange);
  });

  onBeforeUnmount(() => {
    if (mediaQuery && onThemeChange) {
      mediaQuery.removeEventListener('change', onThemeChange);
    }
  });
}
