import { describe, it, expect } from 'vitest';
import { formatBirthday } from './date';

describe('formatBirthday', () => {
  it('英文格式：long month + day + year', () => {
    expect(formatBirthday('2026-05-01', 'en')).toBe('May 1, 2026');
    expect(formatBirthday('2024-11-30', 'en')).toBe('November 30, 2024');
  });

  it('中文格式：YYYY年M月D日', () => {
    expect(formatBirthday('2026-05-01', 'zh')).toBe('2026年5月1日');
    expect(formatBirthday('2024-11-30', 'zh')).toBe('2024年11月30日');
  });

  it('null / 空字串時回傳空字串避免 NaN', () => {
    expect(formatBirthday(null, 'en')).toBe('');
    expect(formatBirthday('', 'zh')).toBe('');
  });
});
