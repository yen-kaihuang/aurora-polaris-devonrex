export const languages = {
  en: 'English',
  zh: '简体中文',
} as const;

export const defaultLang = 'en';

// URL 語言碼 → HTML lang 屬性值
export const htmlLang: Record<keyof typeof languages, string> = {
  en: 'en',
  zh: 'zh-Hans',
};

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.kingsQueens': 'Kings & Queens',
    'nav.availableKittens': 'Available Kittens',
    'nav.aboutCattery': 'About the Cattery',
    'nav.aboutDevonRex': 'About Devon Rex',
    'nav.litters': 'Litters',
    'site.name': 'Aurora Polaris Devon Rex',
  },
  zh: {
    'nav.home': '首页',
    'nav.kingsQueens': '种猫',
    'nav.availableKittens': '待售幼猫',
    'nav.aboutCattery': '关于猫舍',
    'nav.aboutDevonRex': '关于德文卷毛猫',
    'nav.litters': '历年胎次',
    'site.name': 'Aurora Polaris Devon Rex',
  },
} as const;

export type Lang = keyof typeof ui;
export type UiKey = keyof (typeof ui)['en'];
