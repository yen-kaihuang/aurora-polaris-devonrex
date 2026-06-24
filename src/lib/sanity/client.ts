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
  // 走 API 而非 CDN。原因：Sanity webhook 在 publish 後立即觸發 Cloudflare build，
  // 但 apicdn 同步約需 30–60 秒，常出現「部署成功但網站沒新資料」。走 API 雖然
  // 慢一點，但能確保 build 拿到最新內容。
  useCdn: false,
});
