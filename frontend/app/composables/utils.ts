import type { User } from '@/stores/db_strustures';

export const CDN = import.meta.env.VITE_BASE_CDN;
export const API = `${import.meta.env.VITE_BASE_API}/api`;

// Little screen size
export const isMobile = () => (import.meta.client ? window.innerWidth <= 768 : false);
// Intermediate screen size
export const isTablet = () => (import.meta.client ? window.innerWidth <= 1280 : false);

export function useAvatar(user?: User): string {
  return user?.avatar ? CDN + '/' + user.id + '/avatar' : '/default_avatar.avif';
}

export const appColors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'teal', 'grey'];
export function getAppColor(index: number = 0, defaultPrimary?: boolean): string {
  if (defaultPrimary && !index) return 'primary';
  return appColors[index % appColors.length] || 'primary';
}

export const readableFileSize = (size: number): string => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};
export function formatDate(timestamp: number | undefined): string {
  const date = new Date(timestamp || 0);
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}
export function debounce(fn: Function, wait: number) {
  let timer: NodeJS.Timeout;
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer); // clear any pre-existing timer
    }
    // @ts-ignore
    const context = this; // get the current context
    timer = setTimeout(() => {
      fn.apply(context, args); // call the function if time expires
    }, wait);
  };
}

export function setAppColor(color: string | number) {
  if (typeof color === 'number') {
    color = getAppColor(color);
  }
  if (color === 'primary') color = 'default';
  document.documentElement.style.setProperty('--primary', `var(--${color})`);
  document.documentElement.style.setProperty('--primary-bg', `var(--${color}-bg)`);
  document.documentElement.style.setProperty('--primary-border', `var(--${color}-border)`);
}
