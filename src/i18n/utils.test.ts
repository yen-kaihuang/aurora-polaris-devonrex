import { describe, it, expect } from 'vitest';
import { getLangFromUrl, useTranslations } from './utils';

describe('getLangFromUrl', () => {
  it('從 /zh/ 路徑取出 zh', () => {
    expect(getLangFromUrl(new URL('http://x.com/zh/about-cattery'))).toBe('zh');
  });
  it('從 /en/ 路徑取出 en', () => {
    expect(getLangFromUrl(new URL('http://x.com/en/'))).toBe('en');
  });
  it('未知語言碼回退到預設 en', () => {
    expect(getLangFromUrl(new URL('http://x.com/fr/'))).toBe('en');
  });
  it('無語言前綴回退到預設 en', () => {
    expect(getLangFromUrl(new URL('http://x.com/'))).toBe('en');
  });
});

describe('useTranslations', () => {
  it('回傳指定語言的文案', () => {
    const t = useTranslations('zh');
    expect(t('nav.home')).toBe('首页');
  });
  it('缺漏的 key 回退到預設語言', () => {
    const t = useTranslations('zh');
    expect(t('site.name')).toBe('Aurora Polaris Devon Rex');
  });
});
