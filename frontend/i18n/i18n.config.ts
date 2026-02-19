import type en from './locales/en';

export type MessageSchema = typeof en;

export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
  legacy: false,
  locale: 'en',
}));

