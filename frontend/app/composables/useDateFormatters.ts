const locale = 'en-US';

/** Format a timestamp to a readable date string (e.g., "15 Dec 2024") */
function shortDate(timestamp: number | undefined): string {
  const date = new Date(timestamp || 0);
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}

/** Format a timestamp to a numeric date string (e.g., "12/15/2024") */
function numericDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(locale, {
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

  // English version
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return shortDate(timestamp);
};

const formatRelativeDate = (timestamp?: number) => {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(timestamp).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
};

const shortDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
};

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
});

export const useDateFormatters = () => {
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
