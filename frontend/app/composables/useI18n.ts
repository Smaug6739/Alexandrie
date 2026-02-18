/* eslint-disable @typescript-eslint/unified-signatures */
import { useI18n as _useI18n } from 'vue-i18n';
import type { MessageSchema } from '../../i18n/i18n.config';

/**
 * Generate all valid dot-path keys from a nested message object type.
 * e.g. { common: { actions: { create: string } } } → 'common.actions.create'
 */
type NestedKeyOf<T extends Record<string, unknown>, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown> ? NestedKeyOf<T[K], `${Prefix}${K}.`> : `${Prefix}${K}`;
}[keyof T & string];

export type I18nKey = NestedKeyOf<MessageSchema>;

interface StrictTranslateFunction {
  (key: I18nKey): string;
  (key: I18nKey, plural: number): string;
  (key: I18nKey, named: Record<string, unknown>): string;
  (key: I18nKey, list: unknown[]): string;
  (key: I18nKey, plural: number, named: Record<string, unknown>): string;
  (key: I18nKey, defaultMsg: string): string;
}

export const useI18nT = (...args: Parameters<typeof _useI18n>) => {
  const i18n = _useI18n(...args);
  return i18n as Omit<typeof i18n, 't'> & { t: StrictTranslateFunction };
};
