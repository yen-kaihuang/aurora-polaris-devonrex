// 一次性將原本 hardcode 在 KQ 頁面的 9 隻種貓資料匯入 Sanity。
// 圖片從本機 public/images/d/kq/ 讀檔後上傳到 Sanity image asset。

import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('需要 PUBLIC_SANITY_PROJECT_ID 與 SANITY_API_WRITE_TOKEN（請填 .env.local）');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false });

const PUBLIC_DIR = resolve(process.cwd(), 'public');

interface CatSource {
  role: 'king' | 'queen';
  nameEn: string;
  color: string;
  mainPath: string;
  thumbPaths: string[];
  displayOrder: number;
}

const cats: CatSource[] = [
  { role: 'king',  nameEn: 'Elijah',    color: 'Green Yellow-Eyed White',     mainPath: '/images/d/kq/elijah-main.png',    thumbPaths: ['/images/d/kq/elijah-1.png', '/images/d/kq/elijah-2.png', '/images/d/kq/elijah-3.png'],          displayOrder: 1 },
  { role: 'king',  nameEn: 'Richard',   color: 'Red with White Spots',        mainPath: '/images/d/kq/richard-main.png',   thumbPaths: ['/images/d/kq/richard-1.png', '/images/d/kq/richard-2.png', '/images/d/kq/richard-3.png'],       displayOrder: 2 },
  { role: 'king',  nameEn: 'Rio',       color: 'Cream Bicolor',               mainPath: '/images/d/kq/rio-main.png',       thumbPaths: ['/images/d/kq/rio-1.png', '/images/d/kq/rio-2.png'],                                             displayOrder: 3 },
  { role: 'queen', nameEn: 'Vivian',    color: 'Odd-Eyed White',              mainPath: '/images/d/kq/vivian-main.png',    thumbPaths: ['/images/d/kq/vivian-1.png', '/images/d/kq/vivian-2.png', '/images/d/kq/vivian-3.png'],          displayOrder: 1 },
  { role: 'queen', nameEn: 'Vanda',     color: 'Black Classic Tabby Bicolor', mainPath: '/images/d/kq/vanda-main.png',     thumbPaths: ['/images/d/kq/vanda-1.png', '/images/d/kq/vanda-2.png', '/images/d/kq/vanda-3.png'],             displayOrder: 2 },
  { role: 'queen', nameEn: 'Persimona', color: 'Red Classic Tabby',           mainPath: '/images/d/kq/persimona-main.png', thumbPaths: ['/images/d/kq/persimona-1.png', '/images/d/kq/persimona-2.png', '/images/d/kq/persimona-3.png'], displayOrder: 3 },
  { role: 'queen', nameEn: 'Arya',      color: 'Blue-Eyed White',             mainPath: '/images/d/kq/arya-main.png',      thumbPaths: ['/images/d/kq/arya-1.png', '/images/d/kq/arya-2.png', '/images/d/kq/arya-3.png'],                displayOrder: 4 },
  { role: 'queen', nameEn: 'Arina',     color: 'Lavender Lynx Pointed-White', mainPath: '/images/d/kq/arina-main.png',     thumbPaths: ['/images/d/kq/arina-1.png', '/images/d/kq/arina-2.png', '/images/d/kq/arina-3.png'],             displayOrder: 5 },
  { role: 'queen', nameEn: 'Caroline',  color: 'Pure Black',                  mainPath: '/images/d/kq/caroline-main.png',  thumbPaths: ['/images/d/kq/caroline-1.png', '/images/d/kq/caroline-2.png', '/images/d/kq/caroline-3.png'],    displayOrder: 6 },
];

async function uploadImage(relPath: string) {
  const absPath = resolve(PUBLIC_DIR, relPath.replace(/^\//, ''));
  const buffer = readFileSync(absPath);
  const filename = absPath.split(/[\\/]/).pop() ?? 'image.png';
  console.log(`  ↑ uploading ${filename}`);
  const asset = await client.assets.upload('image', buffer, { filename });
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: asset._id } };
}

async function migrate() {
  for (const cat of cats) {
    console.log(`→ ${cat.nameEn} (${cat.role})`);
    const main = await uploadImage(cat.mainPath);
    const thumbs = [];
    for (const p of cat.thumbPaths) thumbs.push(await uploadImage(p));

    await client.create({
      _type: 'breedingCat',
      role: cat.role,
      nameEn: cat.nameEn,
      nameZh: cat.nameEn, // 先用英文填，使用者於 Studio 補翻譯
      color: cat.color,
      bloodline: null,
      birthday: null,
      introEn: null,
      introZh: null,
      displayOrder: cat.displayOrder,
      photos: [main, ...thumbs],
    });
    console.log(`  ✓ created`);
  }
  console.log('\n完成！請開 Sanity Studio 確認資料是否正確。');
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
