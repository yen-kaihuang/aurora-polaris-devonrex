import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';

if (!projectId) {
  throw new Error(
    '[sanity/client.ts] PUBLIC_SANITY_PROJECT_ID 未設定；請複製 .env.example 為 .env.local 並填入（或於 Cloudflare Pages 後台補上環境變數）',
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  // build 時走 CDN 加速；若日後接 preview mode 並帶 token，須改為 false 以避免快取
  useCdn: true,
});
