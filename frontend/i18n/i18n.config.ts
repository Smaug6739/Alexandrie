import type en from './locales/en';
import { russianPluralRule } from './plural-rules';

export type MessageSchema = typeof en;

export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
  legacy: false,
  locale: 'en',
  pluralRules: {
    ru: russianPluralRule,
  },
}));
