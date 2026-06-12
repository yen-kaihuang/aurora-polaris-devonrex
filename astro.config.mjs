// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: true, // 連 en 也帶前綴：/en/、/zh/，利於 SEO 對稱
    },
  },

  adapter: cloudflare(),
});