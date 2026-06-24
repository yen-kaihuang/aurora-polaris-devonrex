import type { Lang } from '../../i18n/ui';

const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export function formatBirthday(value: string | null | undefined, lang: Lang): string {
  if (!value) return '';
  const [yStr, mStr, dStr] = value.split('-');
  const year = Number(yStr);
  const month = Number(mStr);
  const day = Number(dStr);
  if (!year || !month || !day) return '';
  if (lang === 'zh') return `${year}年${month}月${day}日`;
  return `${EN_MONTHS[month - 1]} ${day}, ${year}`;
}
