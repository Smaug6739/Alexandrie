import fr from './locales/fr-FR';
import en from './locales/en-US';

export type MessageSchema = typeof fr;

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: en,
    fr: fr,
  },
}));
