export const useDateFormatters = () => {
  const { locale, t } = useI18nT();

  /** Format a timestamp to a readable date string (e.g., "15 Dec 2024") */
  function shortDate(timestamp: number | undefined): string {
    const date = new Date(timestamp || 0);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  }

  /** Format a timestamp to a numeric date string (e.g., "12/15/2024") */
  function numericDate(timestamp?: number | string): string {
    return new Date(timestamp || '').toLocaleDateString(locale.value, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  /** Format a timestamp to a relative time string (e.g., "2h ago") */
  const relativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('time.justNow');
    if (minutes < 60) return t('time.minutesAgo', { count: minutes });
    if (hours < 24) return t('time.hoursAgo', { count: hours });
    if (days === 1) return t('time.yesterday');
    if (days < 7) return t('time.daysAgo', { count: days });
    return shortDate(timestamp);
  };

  const formatRelativeDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return t('time.today');
    if (days === 1) return t('time.yesterday');
    if (days < 7) return t('time.daysAgo', { count: days });
    if (days < 30) return t('time.weeksAgo', { count: Math.floor(days / 7) });
    return new Date(timestamp).toLocaleDateString(locale.value, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const shortDateLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return t('time.today');
    if (date.toDateString() === yesterday.toDateString()) return t('time.yesterday');
    return date.toLocaleDateString(locale.value, { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(locale.value, { hour: '2-digit', minute: '2-digit' });
  };

  const todayFormatted = computed(() => {
    return new Date().toLocaleDateString(locale.value, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  });

  return {
    shortDate,
    numericDate,
    relativeTime,
    formatRelativeDate,
    shortDateLabel,
    formatTime,
    todayFormatted,
  };
};
