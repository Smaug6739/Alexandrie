import { onMounted } from 'vue';

export function useFavicon() {
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
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setFavicon(mq.matches);
    mq.addEventListener('change', e => setFavicon(e.matches));
  });
}
