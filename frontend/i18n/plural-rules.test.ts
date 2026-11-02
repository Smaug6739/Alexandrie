import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createI18n } from 'vue-i18n';

import en from './locales/en';
import ru from './locales/ru';
import { russianPluralRule } from './plural-rules';

const { t } = createI18n<[typeof en], 'en' | 'ru', false>({
  legacy: false,
  locale: 'ru',
  messages: { en, ru },
  pluralRules: { ru: russianPluralRule },
}).global;

describe('Russian pluralization', () => {
  test('selects Russian forms for named n and count parameters', () => {
    const cases = [
      [0, 'файлов', 'дней'],
      [1, 'файл', 'день'],
      [2, 'файла', 'дня'],
      [4, 'файла', 'дня'],
      [5, 'файлов', 'дней'],
      [11, 'файлов', 'дней'],
      [12, 'файлов', 'дней'],
      [14, 'файлов', 'дней'],
      [20, 'файлов', 'дней'],
      [21, 'файл', 'день'],
      [22, 'файла', 'дня'],
      [25, 'файлов', 'дней'],
      [101, 'файл', 'день'],
      [111, 'файлов', 'дней'],
      [112, 'файлов', 'дней'],
      [114, 'файлов', 'дней'],
    ] as const;

    for (const [count, files, days] of cases) {
      assert.equal(t('cdn.appdrop.file', { n: count }), files);
      assert.equal(t('cdn.actions.upload.multiple', { n: count }), `Загрузить ${count} ${files}`);
      assert.equal(t('time.daysAgo', { count }), `${count} ${days} назад`);
    }
  });

  test('supports explicit plural counts and singular labels', () => {
    assert.equal(t('nodes.types.document', 1), 'Документ');
    assert.equal(t('nodes.types.document', 2), 'Документы');
    assert.equal(t('nodes.category.name', 0), 'Категории');
    assert.equal(t('nodes.category.name'), 'Категория');
    assert.equal(t('settings.snippets.count', { count: 21 }), '21 сниппет');
    assert.equal(t('time.minutesAgo', { count: 22 }), '22 минуты назад');
    assert.equal(t('time.hoursAgo', { count: 11 }), '11 часов назад');
    assert.equal(t('time.weeksAgo', { count: 1 }), '1 неделю назад');
  });

  test('leaves English pluralization unchanged', () => {
    assert.equal(t('cdn.actions.upload.multiple', { n: 1 }, { locale: 'en' }), 'Upload 1 file');
    assert.equal(t('cdn.actions.upload.multiple', { n: 2 }, { locale: 'en' }), 'Upload 2 files');
    assert.equal(t('cdn.actions.upload.multiple', { n: 21 }, { locale: 'en' }), 'Upload 21 files');
  });
});
