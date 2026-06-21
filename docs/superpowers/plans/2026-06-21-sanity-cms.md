# Sanity CMS Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為網站接上 Sanity 後台，讓使用者能不碰程式碼即可維護「種貓」與「待售幼貓」內容。本階段交付完整的 Sanity Studio + Schema + 既有種貓資料的遷移 + Kings & Queens 頁面從 Sanity 即時抓資料的端到端管線。

**Architecture:** Sanity Studio 以子專案形式放在 `studio/`，由 Sanity 免費託管到 `https://[project].sanity.studio`。Astro 端用 `@sanity/client` 於 build time 從 Sanity CDN 取資料、`@sanity/image-url` 產生 CDN 圖片 URL。使用者於 Studio 按 publish → Sanity webhook 打 Cloudflare Pages Deploy Hook → 自動重建上線。雙語策略採平鋪欄位（`nameEn / nameZh / introEn / introZh`），不裝 i18n plugin，保持簡單。

**Tech Stack:** Sanity v3、`@sanity/client`、`@sanity/image-url`、Astro 6、TypeScript strict、Vitest

**Spec 參照:** `docs/superpowers/specs/2026-06-12-devonrex-cattery-website-design.md` §4.1（內容模型）、§4.3（頁面對照）、§5（i18n）、§6（部署）

---

## 檔案結構（本階段建立/異動）

```
aurora-polaris-devonrex/
├─ studio/                              # 新增：Sanity Studio 子專案
│  ├─ package.json
│  ├─ sanity.config.ts
│  ├─ sanity.cli.ts
│  ├─ tsconfig.json
│  └─ schemaTypes/
│     ├─ index.ts                       # 集中匯出 schema
│     ├─ breedingCat.ts                 # 種貓 schema（King / Queen）
│     └─ availableKitten.ts             # 待售幼貓 schema
├─ src/
│  ├─ lib/
│  │  └─ sanity/
│  │     ├─ client.ts                   # 新增：createClient（讀 env）
│  │     ├─ queries.ts                  # 新增：GROQ 查詢字串
│  │     ├─ queries.test.ts             # 新增：查詢結構單元測試
│  │     └─ imageUrl.ts                 # 新增：@sanity/image-url helper
│  └─ pages/[lang]/
│     └─ kings-and-queens.astro         # 修改：從 hardcode 改為 Sanity 即時抓取
├─ scripts/
│  └─ migrate-cats.ts                   # 新增：一次性遷移 9 隻既有貓
├─ .env.example                         # 新增：範本（PUBLIC_SANITY_* / SANITY_API_WRITE_TOKEN）
├─ .gitignore                           # 修改：新增 .env.local、studio/dist/
├─ astro.config.mjs                     # 修改：載入 vite 環境變數設定（如需）
└─ package.json                         # 修改：新增 @sanity/client、@sanity/image-url、migrate script
```

> 環境變數說明：`PUBLIC_*` 前綴的會被 Astro 注入到 client；project ID 與 dataset 都是「公開可見」資訊（Sanity 設計如此，依賴 CORS + dataset 權限保護），所以放 `PUBLIC_`。Write token 是寫入用密鑰，僅 migrate script 用，**絕不可** commit。

---

## 前置：使用者已完成

- [x] 註冊 Sanity 帳號（[sanity.io](https://sanity.io)，用 Google 登入）

## 前置：使用者於本計畫進行中需配合的事

- Task 1：在終端跑 `npx sanity@latest init` 時，瀏覽器會彈出 Sanity 登入頁，請使用者完成授權
- Task 5：到 [sanity.io/manage](https://sanity.io/manage) → 專案 → API → Tokens → 生成 `Editor` 權限的 token，貼進 `.env.local`
- Task 6：到 Cloudflare Pages dashboard 取 Deploy Hook URL；到 Sanity manage 設定 webhook

---

### Task 1：建立 Sanity 專案 + Studio 子專案

**Files:**
- Create: `studio/` 子目錄（由 Sanity CLI 產生）
- Modify: `.gitignore`

- [ ] **Step 1：使用 Sanity CLI 在 `studio/` 子目錄初始化**

在 repo 根目錄執行：

```powershell
npx sanity@latest init --output-path studio --template clean --typescript
```

CLI 會互動式詢問：
- **Login**：選 Google（瀏覽器開啟，使用者授權）
- **Create new project or select existing**：Create new
- **Project name**：`aurora-polaris-devonrex`
- **Use the default dataset configuration**：Yes（dataset name = `production`、Public）
- **Add sample data**：No

完成後產生 `studio/` 含 `package.json`、`sanity.config.ts`、`sanity.cli.ts`、`schemaTypes/`。CLI 會印出 **Project ID**，請保留下來（之後寫進 `.env.example` 與 Astro 端設定）。

- [ ] **Step 2：記錄 Project ID 與 dataset 名稱**

從 `studio/sanity.config.ts` 確認：

```ts
projectId: 'xxxxxxxx',  // 8 字元的 ID
dataset: 'production',
```

把這兩個值記下來，後續 Task 3 與 Task 5 會用到。

- [ ] **Step 3：本地啟動 Studio 確認可開**

```powershell
cd studio
npm run dev
```

預期：瀏覽器自動開 `http://localhost:3333/`，顯示空白 Studio（還沒 schema）。`Ctrl+C` 結束。

- [ ] **Step 4：更新 .gitignore**

於專案根的 `.gitignore` 結尾加入：

```
# Sanity Studio
studio/dist/
studio/node_modules/

# 本機環境變數（含 Sanity write token）
.env.local
```

- [ ] **Step 5：提交**

```powershell
git add studio/ .gitignore
git commit -m "feat(cms): 以 Sanity CLI 初始化 Studio 子專案"
```

---

### Task 2：定義 Schema（breedingCat + availableKitten）

**Files:**
- Create: `studio/schemaTypes/breedingCat.ts`、`studio/schemaTypes/availableKitten.ts`
- Modify: `studio/schemaTypes/index.ts`

- [ ] **Step 1：建立 breedingCat schema**

```ts
// studio/schemaTypes/breedingCat.ts
import { defineField, defineType } from 'sanity';

export const breedingCat = defineType({
  name: 'breedingCat',
  title: '種貓 King/Queen',
  type: 'document',
  fields: [
    defineField({
      name: 'role',
      title: '角色',
      type: 'string',
      options: {
        list: [
          { title: 'King', value: 'king' },
          { title: 'Queen', value: 'queen' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'nameEn', title: '名字（英）', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'nameZh', title: '名字（简体中文）', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'photos',
      title: '照片（第 1 張為主圖）',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (r) => r.required().min(1).max(6),
    }),
    defineField({ name: 'color', title: '毛色花紋', type: 'string' }),
    defineField({ name: 'bloodline', title: '血統 / 註冊頭銜', type: 'string' }),
    defineField({ name: 'birthday', title: '生日', type: 'date' }),
    defineField({ name: 'introEn', title: '介紹（英）', type: 'text', rows: 4 }),
    defineField({ name: 'introZh', title: '介紹（简体中文）', type: 'text', rows: 4 }),
    defineField({
      name: 'displayOrder',
      title: '顯示順序（小到大，預設往最後排）',
      type: 'number',
      initialValue: 999,
    }),
  ],
  orderings: [
    {
      title: '預設（角色 + 順序）',
      name: 'roleAndOrder',
      by: [
        { field: 'role', direction: 'asc' },
        { field: 'displayOrder', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'nameEn', subtitle: 'role', media: 'photos.0' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle === 'king' ? '👑 King' : '👸 Queen', media };
    },
  },
});
```

- [ ] **Step 2：建立 availableKitten schema**

```ts
// studio/schemaTypes/availableKitten.ts
import { defineField, defineType } from 'sanity';

export const availableKitten = defineType({
  name: 'availableKitten',
  title: '待售幼貓',
  type: 'document',
  fields: [
    defineField({ name: 'nameEn', title: '名字（英）', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'nameZh', title: '名字（简体中文）', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'photos',
      title: '照片',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (r) => r.required().min(1).max(8),
    }),
    defineField({
      name: 'gender',
      title: '性別',
      type: 'string',
      options: { list: [
        { title: 'Male', value: 'male' },
        { title: 'Female', value: 'female' },
      ], layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'color', title: '毛色', type: 'string' }),
    defineField({ name: 'birthday', title: '生日', type: 'date' }),
    defineField({
      name: 'status',
      title: '狀態',
      type: 'string',
      options: { list: [
        { title: 'Available（可預約）', value: 'available' },
        { title: 'Reserved（已預訂）', value: 'reserved' },
      ], layout: 'radio' },
      initialValue: 'available',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'introEn', title: '介紹（英）', type: 'text', rows: 4 }),
    defineField({ name: 'introZh', title: '介紹（简体中文）', type: 'text', rows: 4 }),
    defineField({
      name: 'parents',
      title: '父母（選用，關聯到種貓）',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'breedingCat' }] }],
      validation: (r) => r.max(2),
    }),
  ],
  preview: {
    select: { title: 'nameEn', subtitle: 'status', media: 'photos.0' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle === 'available' ? '✅ Available' : '🔒 Reserved', media };
    },
  },
});
```

- [ ] **Step 3：在 schemaTypes/index.ts 匯出**

```ts
// studio/schemaTypes/index.ts
import { breedingCat } from './breedingCat';
import { availableKitten } from './availableKitten';

export const schemaTypes = [breedingCat, availableKitten];
```

- [ ] **Step 4：本地啟動 Studio 驗證 schema 載入**

```powershell
cd studio
npm run dev
```

預期：`http://localhost:3333/structure` 顯示 `種貓 King/Queen` 與 `待售幼貓` 兩個 document type，點進去能看到欄位表單。`Ctrl+C` 結束。

- [ ] **Step 5：提交**

```powershell
git add studio/schemaTypes/
git commit -m "feat(cms): 定義 breedingCat 與 availableKitten schema"
```

---

### Task 3：Astro 端 Sanity client + image URL helper（TDD）

**Files:**
- Create: `src/lib/sanity/client.ts`、`src/lib/sanity/queries.ts`、`src/lib/sanity/queries.test.ts`、`src/lib/sanity/imageUrl.ts`
- Create: `.env.example`
- Modify: `package.json`（新增依賴）

- [ ] **Step 1：安裝依賴**

```powershell
npm install @sanity/client @sanity/image-url
```

- [ ] **Step 2：建立 .env.example 範本**

```
# Sanity CMS — public（會 inline 進前端 bundle，僅是 routing 資訊不是 secret）
PUBLIC_SANITY_PROJECT_ID=替換成你的 project id
PUBLIC_SANITY_DATASET=production

# Sanity 寫入用 token（僅 migrate script 用，絕不可上 commit）
SANITY_API_WRITE_TOKEN=
```

- [ ] **Step 3：寫失敗的查詢測試（TDD）**

```ts
// src/lib/sanity/queries.test.ts
import { describe, it, expect } from 'vitest';
import { allBreedingCatsQuery, parseCats } from './queries';

describe('allBreedingCatsQuery', () => {
  it('查詢字串包含必要欄位', () => {
    expect(allBreedingCatsQuery).toContain('breedingCat');
    expect(allBreedingCatsQuery).toContain('nameEn');
    expect(allBreedingCatsQuery).toContain('nameZh');
    expect(allBreedingCatsQuery).toContain('role');
    expect(allBreedingCatsQuery).toContain('photos');
  });
});

describe('parseCats', () => {
  const sample = [
    { _id: '1', role: 'king', nameEn: 'Elijah', nameZh: '伊利亚', photos: [{ asset: { _ref: 'image-a' } }], color: 'White', bloodline: null, introEn: null, introZh: null, displayOrder: 1 },
    { _id: '2', role: 'queen', nameEn: 'Vivian', nameZh: '薇薇安', photos: [{ asset: { _ref: 'image-b' } }], color: 'Odd-Eyed', bloodline: null, introEn: null, introZh: null, displayOrder: 1 },
  ];

  it('依 role 分組為 kings / queens', () => {
    const { kings, queens } = parseCats(sample);
    expect(kings).toHaveLength(1);
    expect(queens).toHaveLength(1);
    expect(kings[0].nameEn).toBe('Elijah');
    expect(queens[0].nameEn).toBe('Vivian');
  });

  it('空陣列時各組皆為空', () => {
    const { kings, queens } = parseCats([]);
    expect(kings).toEqual([]);
    expect(queens).toEqual([]);
  });
});
```

- [ ] **Step 4：執行測試確認 FAIL**

```powershell
npm test
```

預期：FAIL（`Cannot find module './queries'`）。

- [ ] **Step 5：實作 client**

```ts
// src/lib/sanity/client.ts
import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';

if (!projectId) {
  throw new Error('[sanity/client.ts] PUBLIC_SANITY_PROJECT_ID 未設定；請複製 .env.example 為 .env.local 並填入（或於 Cloudflare Pages 後台補上環境變數）');
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  // build 時走 CDN 加速；若日後接 preview mode 並帶 token，須改為 false 以避免快取
  useCdn: true,
});
```

- [ ] **Step 6：實作 queries**

```ts
// src/lib/sanity/queries.ts
export interface BreedingCat {
  _id: string;
  role: 'king' | 'queen';
  nameEn: string;
  nameZh: string;
  photos: { asset: { _ref: string } }[];
  color: string | null;
  bloodline: string | null;
  introEn: string | null;
  introZh: string | null;
  displayOrder: number;
}

export const allBreedingCatsQuery = `*[_type == "breedingCat"] | order(role asc, displayOrder asc) {
  _id,
  role,
  nameEn,
  nameZh,
  photos,
  color,
  bloodline,
  introEn,
  introZh,
  displayOrder
}`;

export function parseCats(cats: BreedingCat[]): { kings: BreedingCat[]; queens: BreedingCat[] } {
  return {
    kings: cats.filter((c) => c.role === 'king'),
    queens: cats.filter((c) => c.role === 'queen'),
  };
}
```

- [ ] **Step 7：實作 imageUrl helper**

```ts
// src/lib/sanity/imageUrl.ts
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

- [ ] **Step 8：執行測試確認 PASS**

```powershell
npm test
```

預期：所有測試 PASS（含原有 12 個 + 新增 4 個）。

- [ ] **Step 9：建立 .env.local（本機開發用，不 commit）**

複製 `.env.example` 為 `.env.local`，填入 Task 1 取得的 Project ID。

- [ ] **Step 10：提交**

```powershell
git add src/lib/sanity/ .env.example package.json package-lock.json
git commit -m "feat(cms): Astro 端 Sanity client、查詢與 image URL helper"
```

---

### Task 4：改寫 Kings & Queens 頁面從 Sanity 即時抓取

**Files:**
- Modify: `src/pages/[lang]/kings-and-queens.astro`

- [ ] **Step 1：以 Sanity 查詢替換 hardcode 陣列**

修改 `src/pages/[lang]/kings-and-queens.astro` 的 frontmatter：

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import CatProfile from '../../components/CatProfile.astro';
import { useTranslations } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';
import { sanityClient } from '../../lib/sanity/client';
import { allBreedingCatsQuery, parseCats, type BreedingCat } from '../../lib/sanity/queries';
import { urlFor } from '../../lib/sanity/imageUrl';

export function getStaticPaths() {
  return [{ params: { lang: 'en' } }, { params: { lang: 'zh' } }];
}

const lang = Astro.params.lang as Lang;
const t = useTranslations(lang);

const allCats = await sanityClient.fetch<BreedingCat[]>(allBreedingCatsQuery);
const { kings, queens } = parseCats(allCats);

function toProfile(cat: BreedingCat) {
  const [main, ...rest] = cat.photos;
  // 若 zh 翻譯尚未填，fallback 到英文，避免畫面空白
  return {
    name: lang === 'zh' ? (cat.nameZh || cat.nameEn) : cat.nameEn,
    color: cat.color ?? '',
    main: urlFor(main).width(800).url(),
    thumbs: rest.slice(0, 3).map((p) => urlFor(p).width(300).url()),
  };
}

const kingsProfiles = kings.map(toProfile);
const queensProfiles = queens.map(toProfile);

const bloodType = 'A/b';
const labelColor = t('kq.labelColor');
const labelBlood = t('kq.labelBlood');
---
```

接著把 template 中的 `kings.map` / `queens.map` 改用 `kingsProfiles` / `queensProfiles`，其餘 markup 不動。為了避免 Sanity 暫時空資料時頁面看起來像 bug，在兩個 `kq-list` 加 fallback 訊息：

```astro
<div class="kq-list">
  {kingsProfiles.length === 0 ? (
    <p class="kq-empty">{lang === 'zh' ? '内容整理中，敬请期待。' : 'Content coming soon.'}</p>
  ) : kingsProfiles.map((cat, i) => (
    <CatProfile {...cat} bloodType={bloodType} side={i % 2 === 0 ? 'left' : 'right'} labelColor={labelColor} labelBlood={labelBlood} />
  ))}
</div>
```

queens 區塊同樣處理（注意 `side` 預設邏輯保持 `i % 2 === 0 ? 'right' : 'left'`）。`kq-empty` 用既有 `.prose` 樣式或簡單置中即可。

- [ ] **Step 2：本地驗證**

```powershell
npm run dev
```

開 `http://localhost:4321/en/kings-and-queens`。預期：頁面結構正常，但因為 Sanity 還沒有資料，**`kings` 與 `queens` 區塊內為空**（沒有貓卡片）。這是正常的 — Task 5 會把資料匯入。

驗證點：Console / build 沒有錯誤、頁面標題與 hero 都正常顯示。`Ctrl+C` 結束。

- [ ] **Step 3：跑 lint 與 test**

```powershell
npx astro check
npm test
```

預期：astro check 0 errors、12+4 tests pass。

- [ ] **Step 4：提交**

```powershell
git add src/pages/[lang]/kings-and-queens.astro
git commit -m "feat(cms): KQ 頁面改為從 Sanity 即時抓取資料"
```

---

### Task 5：Migrate script — 匯入既有 9 隻種貓資料

**Files:**
- Create: `scripts/migrate-cats.ts`
- Modify: `package.json`（新增 `migrate` 指令 + 安裝 tsx）

- [ ] **Step 0：使用者生 Sanity write token 並貼進 .env.local**

到 [sanity.io/manage](https://sanity.io/manage) → 你的專案 → API → Tokens → `Add API token`：
- Name：`migrate`
- Permissions：`Editor`
- 複製 token（**只會顯示一次**），貼進專案根 `.env.local` 的 `SANITY_API_WRITE_TOKEN=`。

自我驗證 token 已寫入（不會印出 token 內容，只看 key 存在）：

```powershell
Get-Content .env.local | Select-String -Pattern "^SANITY_API_WRITE_TOKEN="
```

預期：印出 `SANITY_API_WRITE_TOKEN=sk...`（值有東西）。

- [ ] **Step 1：安裝 tsx 以執行 TS script**

```powershell
npm install -D tsx dotenv
npm pkg set scripts.migrate="tsx scripts/migrate-cats.ts"
```

- [ ] **Step 2：建立 migrate script**

```ts
// scripts/migrate-cats.ts
// 一次性將原本 hardcode 在 KQ 頁面的 9 隻種貓資料匯入 Sanity。
// 圖片從本機 public/images/d/kq/ 讀檔後上傳到 Sanity image asset。

import 'dotenv/config';
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
  mainPath: string;     // 相對 /public/
  thumbPaths: string[]; // 相對 /public/
  displayOrder: number;
}

const cats: CatSource[] = [
  { role: 'king',  nameEn: 'Elijah',    color: 'Green Yellow-Eyed White',  mainPath: '/images/d/kq/elijah-main.png',    thumbPaths: ['/images/d/kq/elijah-1.png', '/images/d/kq/elijah-2.png', '/images/d/kq/elijah-3.png'],       displayOrder: 1 },
  { role: 'king',  nameEn: 'Richard',   color: 'Red with White Spots',     mainPath: '/images/d/kq/richard-main.png',   thumbPaths: ['/images/d/kq/richard-1.png', '/images/d/kq/richard-2.png', '/images/d/kq/richard-3.png'],    displayOrder: 2 },
  { role: 'king',  nameEn: 'Rio',       color: 'Cream Bicolor',            mainPath: '/images/d/kq/rio-main.png',       thumbPaths: ['/images/d/kq/rio-1.png', '/images/d/kq/rio-2.png'],                                          displayOrder: 3 },
  { role: 'queen', nameEn: 'Vivian',    color: 'Odd-Eyed White',           mainPath: '/images/d/kq/vivian-main.png',    thumbPaths: ['/images/d/kq/vivian-1.png', '/images/d/kq/vivian-2.png', '/images/d/kq/vivian-3.png'],       displayOrder: 1 },
  { role: 'queen', nameEn: 'Vanda',     color: 'Black Classic Tabby Bicolor', mainPath: '/images/d/kq/vanda-main.png', thumbPaths: ['/images/d/kq/vanda-1.png', '/images/d/kq/vanda-2.png', '/images/d/kq/vanda-3.png'],          displayOrder: 2 },
  { role: 'queen', nameEn: 'Persimona', color: 'Red Classic Tabby',        mainPath: '/images/d/kq/persimona-main.png', thumbPaths: ['/images/d/kq/persimona-1.png', '/images/d/kq/persimona-2.png', '/images/d/kq/persimona-3.png'], displayOrder: 3 },
  { role: 'queen', nameEn: 'Arya',      color: 'Blue-Eyed White',          mainPath: '/images/d/kq/arya-main.png',      thumbPaths: ['/images/d/kq/arya-1.png', '/images/d/kq/arya-2.png', '/images/d/kq/arya-3.png'],             displayOrder: 4 },
  { role: 'queen', nameEn: 'Arina',     color: 'Lavender Lynx Pointed-White', mainPath: '/images/d/kq/arina-main.png', thumbPaths: ['/images/d/kq/arina-1.png', '/images/d/kq/arina-2.png', '/images/d/kq/arina-3.png'],          displayOrder: 5 },
  { role: 'queen', nameEn: 'Caroline',  color: 'Pure Black',               mainPath: '/images/d/kq/caroline-main.png',  thumbPaths: ['/images/d/kq/caroline-1.png', '/images/d/kq/caroline-2.png', '/images/d/kq/caroline-3.png'], displayOrder: 6 },
];

async function uploadImage(relPath: string): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } }> {
  const absPath = resolve(PUBLIC_DIR, relPath.replace(/^\//, ''));
  const buffer = readFileSync(absPath);
  const filename = absPath.split(/[\\/]/).pop() ?? 'image.png';
  console.log(`  ↑ uploading ${filename}`);
  const asset = await client.assets.upload('image', buffer, { filename });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
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
      birthday: null,    // 顯式留空；使用者於 Studio 補
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
```

- [ ] **Step 3：執行 migrate**

```powershell
npm run migrate
```

預期：終端逐隻顯示 `→ Elijah (king)` / `↑ uploading elijah-main.png` / `✓ created` 共 9 隻。

- [ ] **Step 4：本地 Studio 驗證**

```powershell
cd studio
npm run dev
```

開 `http://localhost:3333/`，點 `種貓 King/Queen`：應看到 9 筆資料，每筆有照片 thumbnail、名字、role 圖示。請使用者在 Studio 把每筆的 `nameZh` 改成正確的簡體中文翻譯（範例：Elijah → 伊利亚）。

`Ctrl+C` 結束。

- [ ] **Step 5：本地網站驗證資料連通**

回專案根：

```powershell
npm run dev
```

開 `http://localhost:4321/en/kings-and-queens`：應看到 9 隻貓全部顯示，照片從 Sanity CDN 載入。切到 `/zh/...` 確認名字顯示為 nameZh（若還沒改翻譯，會顯示英文 fallback）。

- [ ] **Step 6：提交（不含 .env.local 與 node_modules）**

```powershell
git add scripts/migrate-cats.ts package.json package-lock.json
git commit -m "feat(cms): 一次性遷移既有 9 隻種貓資料至 Sanity"
```

---

### Task 6：部署 Studio + 設定自動重建 Webhook

**Files:** 無原始碼異動（皆為平台設定，本 Task 提供逐步指引）

- [ ] **Step 1：部署 Studio 到 `*.sanity.studio`**

```powershell
cd studio
npx sanity deploy
```

CLI 會問 studio hostname，建議填：`aurora-polaris-devonrex`（最終 URL 為 `https://aurora-polaris-devonrex.sanity.studio`）。

預期：上傳後印出最終 URL，使用者用 Sanity 帳號登入即可進後台。**請把這個 URL 記到 README / 1Password**。

- [ ] **Step 2：在 Cloudflare Pages 加環境變數**

到 Cloudflare Pages dashboard → 你的 `aurora-polaris-devonrex` 專案 → Settings → Environment variables → 新增（Production 環境）：

- `PUBLIC_SANITY_PROJECT_ID` = 你的 8 碼 project id
- `PUBLIC_SANITY_DATASET` = `production`

點 `Save`。

- [ ] **Step 3：在 Cloudflare Pages 取 Deploy Hook URL**

同一個 Settings 頁面 → Builds & deployments → Deploy hooks → `Add deploy hook`：

- Hook name：`sanity-publish`
- Branch：`main`

按 `Generate hook` 取得 URL（形如 `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxxxxxxx`）。**複製備用**。

- [ ] **Step 4：在 Sanity 設定 webhook**

到 [sanity.io/manage](https://sanity.io/manage) → 專案 → API → Webhooks → `Create webhook`：

- Name：`Cloudflare Rebuild`
- URL：貼 Step 3 的 deploy hook URL
- Dataset：`production`
- Trigger on：✅ Create、✅ Update、✅ Delete
- Filter：`_type in ["breedingCat", "availableKitten"]`
- HTTP method：`POST`
- 其餘預設

按 `Save`。

- [ ] **Step 5：手動觸發一次 webhook 驗證連線**

回 Sanity manage → 剛建立的 webhook → 點旁邊的 `...` → `Send test`。

到 Cloudflare Pages → Deployments → 確認有一筆「Hook trigger」的 deployment 正在跑（或剛跑完）。代表 Sanity → Cloudflare 通訊正常。

- [ ] **Step 6：端到端驗證**

到 Sanity Studio（Step 1 的 URL）→ 隨便挑一隻貓 → 改 `nameZh` → 按 Publish。

等 1–2 分鐘 → 開網站 zh 版 → 確認名字真的變了。

若沒變：
- 到 Cloudflare Pages → Deployments，看有沒有新一筆觸發
- 到 Sanity manage → Webhooks → 看 delivery log 有沒有錯

---

## 完成定義

- `npm test` 通過（原 12 + 新 4 = 16 個）。
- `npm run build` 通過。
- KQ 頁面從 Sanity 取得 9 隻種貓資料，照片走 Sanity CDN。
- Sanity Studio 部署在 `https://aurora-polaris-devonrex.sanity.studio`。
- 使用者於 Studio 改文案 / 換照片 → Publish → 2–3 分鐘自動上線。
- `.env.local` 與 `SANITY_API_WRITE_TOKEN` 未進 git。

## 自我檢查

- **Spec 覆蓋**：本計畫對應 spec §4.1（內容模型）、§4.3（KQ 頁資料來源 → Sanity）、§5（雙語平鋪欄位）、§6（Sanity webhook → Cloudflare 自動部署）。
- **不在範圍**：available-kittens 頁面的 UI 改寫留待後續計畫（schema 已建好，可隨時接）；過往胎次（2022–2024）按 spec §4.2 維持靜態。
- **可逆性**：若 Sanity 整合出問題，KQ 頁面可從 git 復原回硬編碼版本（已在 git log 中），網站不會中斷。
- **Secret 安全**：write token 僅在 `.env.local`（已 ignore），不會進 commit；webhook URL 存在 Sanity manage 後台，不會出現在 repo。
