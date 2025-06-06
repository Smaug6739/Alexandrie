import type { User } from '../stores/db_strustures';

export const CDN = import.meta.env.VITE_BASE_CDN;
export const API = `${import.meta.env.VITE_BASE_API}/api`;

// Little screen size
export const isMobile = () => (import.meta.client ? window.innerWidth <= 768 : false);
// Intermediate screen size
export const isTablet = () => (import.meta.client ? window.innerWidth <= 1280 : false);

export function useAvatar(user: User): string {
  return user.avatar ? CDN + '/' + user.id + '/avatar' : CDN + '/default_avatar.png';
}

export const AppColors = ['', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'teal', 'grey'];
export function getAppColor(index: number = 0): string {
  return AppColors[index % AppColors.length] || '';
}

export const readableFileSize = (size: number): string => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};
