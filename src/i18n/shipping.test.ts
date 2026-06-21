import { describe, it, expect } from 'vitest';
import { ui } from './ui';

const requiredKeys = [
  'shipping.heroTitle',
  'shipping.intro',
  'shipping.m1.title',
  'shipping.m1.area',
  'shipping.m1.body',
  'shipping.m2.title',
  'shipping.m2.opt1Label',
  'shipping.m2.opt1Body',
  'shipping.m2.opt2Label',
  'shipping.m2.opt2Body',
  'shipping.m3.title',
  'shipping.m3.body',
  'shipping.m4.title',
  'shipping.m4.body',
  'shipping.m4.feeNote',
] as const;

describe('shipping i18n keys', () => {
  for (const lang of ['en', 'zh'] as const) {
    it(`all required keys exist and are non-empty in ${lang}`, () => {
      const dict = ui[lang] as Record<string, string>;
      const missing = requiredKeys.filter((k) => !dict[k]);
      expect(missing).toEqual([]);
    });
  }
});
