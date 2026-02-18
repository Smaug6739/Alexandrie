import en from './locales/en-US';
import fr from './locales/fr-FR';

export type MessageSchema = typeof en;

export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
  legacy: false,
  locale: 'en',
  messages: {
    en: en,
    fr: fr,
  },
}));
