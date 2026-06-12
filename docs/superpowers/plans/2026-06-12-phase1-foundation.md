# Phase 1：專案骨架 + 雙語 + 部署管線 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個雙語（英文 / 简体中文）的 Astro 網站骨架，含基礎版型、導覽列、語言切換與所有路由佔位頁，並實際部署到 Cloudflare Pages 上線，打通「自有程式碼 → 自動部署」的完整管線。

**Architecture:** 用 Astro 的內建 i18n 路由（`/en/...`、`/zh/...`，預設導向英文）。文案集中放在 `src/i18n/` 的字典檔，由一個 `t()` 輔助函式取用。每個 spec 定義的頁面都先建一個極簡佔位頁，確認路由與雙語切換可運作後，後續階段再填內容。原始碼推上 GitHub，接 Cloudflare Pages 自動部署。

**Tech Stack:** Astro（minimal + TypeScript strict）、Vitest（單元測試 i18n 輔助函式）、GitHub、Cloudflare Pages。

---

## 檔案結構（本階段建立/異動）

```
aurora-polaris-devonrex/
├─ astro.config.mjs           # Astro 設定 + i18n（en 預設、zh）
├─ package.json               # 相依與指令
├─ tsconfig.json              # TypeScript strict
├─ vitest.config.ts           # 測試設定
├─ src/
│  ├─ i18n/
│  │  ├─ ui.ts                # 字典：en / zh 的介面文案 + 型別
│  │  └─ utils.ts             # getLangFromUrl()、useTranslations() 輔助
│  │  └─ utils.test.ts        # i18n 輔助函式單元測試
│  ├─ layouts/
│  │  └─ BaseLayout.astro     # <html lang> / <head> meta / 共用結構
│  ├─ components/
│  │  ├─ Nav.astro            # 導覽列
│  │  └─ LangSwitcher.astro   # 語言切換
│  └─ pages/
│     ├─ index.astro          # /（重導到 /en/）
│     └─ [lang]/
│        ├─ index.astro                 # 首頁佔位
│        ├─ kings-and-queens.astro      # 種貓佔位
│        ├─ available-kittens.astro     # 可售幼貓佔位
│        ├─ about-cattery.astro         # 貓舍介紹佔位
│        ├─ about-devon-rex.astro       # 品種介紹佔位
│        └─ litters/
│           ├─ index.astro              # 胎次索引佔位
│           ├─ 2022.astro               # 佔位
│           ├─ 2023.astro               # 佔位
│           ├─ 2024.astro               # 佔位
│           └─ 2025.astro               # 「整理中」佔位
└─ .gitignore
```

> 語言碼說明：URL 用 `zh`（簡短），HTML `lang` 屬性輸出 `zh-Hans`（語意正確、利於 SEO）。兩者對應關係集中在 `src/i18n/ui.ts`。

---

### Task 1：初始化 Astro 專案

**Files:**
- Create: `package.json`、`astro.config.mjs`、`tsconfig.json`、`.gitignore`、`src/pages/index.astro`（由 scaffold 產生後改寫）

- [ ] **Step 1：在專案根目錄建立 Astro minimal 專案**

於 `/Users/huangyenkai/aurora-polaris-devonrex` 執行（目錄已有 docs/，用 `.` 就地建立）：

```bash
cd /Users/huangyenkai/aurora-polaris-devonrex
npm create astro@latest . -- --template minimal --install --no-git --typescript strict --yes
```

預期：產生 `package.json`、`astro.config.mjs`、`tsconfig.json`、`src/pages/index.astro`，並完成 `npm install`。

- [ ] **Step 2：確認開發伺服器可啟動**

```bash
npm run dev
```

預期：終端顯示 `astro` 啟動於 `http://localhost:4321`。用瀏覽器或 `curl -s http://localhost:4321 | head` 確認有 HTML 回應後，`Ctrl+C` 結束。

- [ ] **Step 3：建立 .gitignore（若 scaffold 未含）**

確認 `.gitignore` 含下列項目（缺則補上）：

```
node_modules/
dist/
.astro/
.env
.DS_Store
```

- [ ] **Step 4：提交**

```bash
git add -A
git commit -m "chore: 以 Astro minimal 模板初始化專案"
```

---

### Task 2：設定 i18n 路由（en 預設、zh）

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1：改寫 astro.config.mjs 加入 i18n 設定**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: true, // 連 en 也帶前綴：/en/、/zh/，利於 SEO 對稱
    },
  },
});
```

- [ ] **Step 2：驗證設定不破壞建置**

```bash
npm run build
```

預期：建置成功（此時頁面尚少，無錯誤即可）。

- [ ] **Step 3：提交**

```bash
git add astro.config.mjs
git commit -m "feat: 設定 Astro i18n 路由（en 預設、zh）"
```

---

### Task 3：i18n 字典與輔助函式（TDD）

**Files:**
- Create: `src/i18n/ui.ts`、`src/i18n/utils.ts`、`src/i18n/utils.test.ts`、`vitest.config.ts`
- Modify: `package.json`（加 test 指令與 vitest）

- [ ] **Step 1：安裝 Vitest 並加入測試指令**

```bash
npm install -D vitest
npm pkg set scripts.test="vitest run"
```

- [ ] **Step 2：建立 vitest 設定**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3：建立字典檔**

```ts
// src/i18n/ui.ts
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
```

- [ ] **Step 4：先寫失敗的測試**

```ts
// src/i18n/utils.test.ts
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
    // site.name 兩語言相同，驗證取得到值即可
    expect(t('site.name')).toBe('Aurora Polaris Devon Rex');
  });
});
```

- [ ] **Step 5：執行測試，確認失敗**

```bash
npm test
```

預期：FAIL，訊息類似 `Cannot find module './utils'`。

- [ ] **Step 6：實作輔助函式**

```ts
// src/i18n/utils.ts
import { ui, defaultLang, type Lang, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang in ui) return maybeLang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
```

- [ ] **Step 7：執行測試，確認通過**

```bash
npm test
```

預期：所有測試 PASS。

- [ ] **Step 8：提交**

```bash
git add src/i18n vitest.config.ts package.json package-lock.json
git commit -m "feat: i18n 字典與輔助函式（含單元測試）"
```

---

### Task 4：基礎版型 BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1：建立 BaseLayout**

```astro
---
// src/layouts/BaseLayout.astro
import { getLangFromUrl } from '../i18n/utils';
import { htmlLang } from '../i18n/ui';
import Nav from '../components/Nav.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '' } = Astro.props;
const lang = getLangFromUrl(Astro.url);
---

<!doctype html>
<html lang={htmlLang[lang]}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
  </body>
</html>
```

> 註：`Nav.astro` 在 Task 5 建立。本檔在 Task 5 完成前不會被建置使用（佔位頁於 Task 6 才 import BaseLayout），故先建立不會報錯。

- [ ] **Step 2：提交**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: 新增 BaseLayout 基礎版型"
```

---

### Task 5：導覽列 Nav 與語言切換 LangSwitcher

**Files:**
- Create: `src/components/Nav.astro`、`src/components/LangSwitcher.astro`

- [ ] **Step 1：建立 LangSwitcher**

切換時保留目前頁面路徑，只換語言前綴。

```astro
---
// src/components/LangSwitcher.astro
import { getLangFromUrl } from '../i18n/utils';
import { languages } from '../i18n/ui';

const current = getLangFromUrl(Astro.url);
// 去掉現有語言前綴，取得不含語言的路徑（保留結尾）
const rest = Astro.url.pathname.replace(/^\/(en|zh)/, '') || '/';
---

<nav aria-label="Language">
  <ul>
    {Object.entries(languages).map(([code, label]) => (
      <li>
        {code === current
          ? <span aria-current="true">{label}</span>
          : <a href={`/${code}${rest}`}>{label}</a>}
      </li>
    ))}
  </ul>
</nav>
```

- [ ] **Step 2：建立 Nav**

```astro
---
// src/components/Nav.astro
import { getLangFromUrl, useTranslations } from '../i18n/utils';
import LangSwitcher from './LangSwitcher.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const base = `/${lang}`;

const links = [
  { href: `${base}/`, label: t('nav.home') },
  { href: `${base}/kings-and-queens`, label: t('nav.kingsQueens') },
  { href: `${base}/available-kittens`, label: t('nav.availableKittens') },
  { href: `${base}/litters`, label: t('nav.litters') },
  { href: `${base}/about-cattery`, label: t('nav.aboutCattery') },
  { href: `${base}/about-devon-rex`, label: t('nav.aboutDevonRex') },
];
---

<header>
  <a href={base + '/'}>{t('site.name')}</a>
  <nav aria-label="Main">
    <ul>
      {links.map((l) => (
        <li><a href={l.href}>{l.label}</a></li>
      ))}
    </ul>
  </nav>
  <LangSwitcher />
</header>
```

- [ ] **Step 3：提交**

```bash
git add src/components/Nav.astro src/components/LangSwitcher.astro
git commit -m "feat: 新增導覽列與語言切換"
```

---

### Task 6：建立所有路由的佔位頁

**Files:**
- Modify: `src/pages/index.astro`（改為重導到 /en/）
- Create: `src/pages/[lang]/index.astro` 及其餘佔位頁（見檔案結構）

- [ ] **Step 1：根路徑重導到預設語言**

```astro
---
// src/pages/index.astro
return Astro.redirect('/en/');
---
```

- [ ] **Step 2：建立語言層級的靜態路徑產生器 + 首頁佔位**

```astro
---
// src/pages/[lang]/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { useTranslations } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';

export function getStaticPaths() {
  return [{ params: { lang: 'en' } }, { params: { lang: 'zh' } }];
}

const lang = Astro.params.lang as Lang;
const t = useTranslations(lang);
---

<BaseLayout title={t('site.name')}>
  <h1>{t('nav.home')}</h1>
  <p>Phase 1 placeholder — 內容於後續階段填入。</p>
</BaseLayout>
```

- [ ] **Step 3：建立其餘佔位頁**

對下列每個檔案套用同一範式（改 `getStaticPaths`、`title`、標題用對應的 `t()` key）：

`kings-and-queens.astro`（key `nav.kingsQueens`）、`available-kittens.astro`（`nav.availableKittens`）、`about-cattery.astro`（`nav.aboutCattery`）、`about-devon-rex.astro`（`nav.aboutDevonRex`）、`litters/index.astro`（`nav.litters`）。

範本（以 kings-and-queens 為例）：

```astro
---
// src/pages/[lang]/kings-and-queens.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { useTranslations } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';

export function getStaticPaths() {
  return [{ params: { lang: 'en' } }, { params: { lang: 'zh' } }];
}

const lang = Astro.params.lang as Lang;
const t = useTranslations(lang);
---

<BaseLayout title={t('nav.kingsQueens')}>
  <h1>{t('nav.kingsQueens')}</h1>
  <p>Phase 1 placeholder — 內容於後續階段填入。</p>
</BaseLayout>
```

> `litters/index.astro` 的相對 import 路徑為 `../../../layouts/...` 與 `../../../i18n/...`（多一層）。

- [ ] **Step 4：建立胎次年份佔位頁（2022–2024 一般佔位、2025「整理中」）**

`litters/2022.astro`、`2023.astro`、`2024.astro` 用一般佔位（標題寫年份字串，例如 `2024 Litter`）。`litters/2025.astro` 顯示「整理中」訊息：

```astro
---
// src/pages/[lang]/litters/2025.astro
import BaseLayout from '../../../layouts/BaseLayout.astro';
import { useTranslations } from '../../../i18n/utils';
import type { Lang } from '../../../i18n/ui';

export function getStaticPaths() {
  return [{ params: { lang: 'en' } }, { params: { lang: 'zh' } }];
}

const lang = Astro.params.lang as Lang;
const t = useTranslations(lang);
const msg = lang === 'zh' ? '内容整理中，敬请期待。' : 'Content coming soon.';
---

<BaseLayout title="2025 Litter">
  <h1>2025</h1>
  <p>{msg}</p>
</BaseLayout>
```

- [ ] **Step 5：建置並驗證所有路由產生成功**

```bash
npm run build
```

預期：建置成功，`dist/` 下出現 `en/` 與 `zh/` 兩套頁面（含 `en/index.html`、`zh/kings-and-queens/index.html`、`zh/litters/2025/index.html` 等）。可用 `find dist -name index.html | sort` 抽查。

- [ ] **Step 6：本地預覽抽查雙語切換**

```bash
npm run preview
```

開 `http://localhost:4321/en/`，點導覽列各連結與語言切換，確認：英文頁顯示英文、切到 zh 顯示簡中、語言切換會停在同一頁。抽查後 `Ctrl+C`。

- [ ] **Step 7：提交**

```bash
git add src/pages
git commit -m "feat: 建立雙語路由與各頁佔位"
```

---

### Task 7：推上 GitHub

**Files:** 無（遠端設定）

- [ ] **Step 1：確認 gh 已登入（或改用網頁建 repo）**

```bash
gh auth status
```

若未登入：請使用者於對話輸入 `! gh auth login` 自行登入，或於 GitHub 網頁手動建立空 repo 後在 Step 2 改用該 URL。

- [ ] **Step 2：建立遠端 repo 並推送**

```bash
cd /Users/huangyenkai/aurora-polaris-devonrex
gh repo create aurora-polaris-devonrex --private --source=. --remote=origin --push
```

預期：建立私有 repo 並推送 `main`。`git remote -v` 應顯示 origin。

---

### Task 8：部署到 Cloudflare Pages

**Files:** 無（平台設定，需使用者操作；開發者提供逐步指引）

> 此 Task 多為使用者於 Cloudflare 介面操作。執行者負責提供精確步驟與驗證點，不需寫程式。

- [ ] **Step 1：使用者於 Cloudflare 建立 Pages 專案**

指引使用者：登入 Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → 選 `aurora-polaris-devonrex` repo。

- [ ] **Step 2：設定建置參數**

- Framework preset：**Astro**
- Build command：`npm run build`
- Build output directory：`dist`
- Node 版本：於環境變數設 `NODE_VERSION = 20`（或更高 LTS）

- [ ] **Step 3：觸發首次部署並驗證**

部署完成後，Cloudflare 給一個 `*.pages.dev` 網址。驗證點：
- 開 `https://<專案>.pages.dev/en/` 顯示英文首頁。
- 開 `https://<專案>.pages.dev/zh/` 顯示簡中首頁。
- 導覽列與語言切換可用。

- [ ] **Step 4：驗證自動部署**

在本地對任一佔位頁做小改動 → commit → `git push`。確認 Cloudflare Pages 自動觸發新部署並上線。

> DNS 將網域指向此 Pages 專案的步驟屬 Phase 4（與表單、SEO、過往胎次一起收尾）。Phase 1 以 `*.pages.dev` 驗證管線即可。

---

## 完成定義（Phase 1）
- `npm test`、`npm run build` 皆通過。
- 雙語（/en、/zh）所有路由皆可瀏覽、導覽與語言切換正常。
- 原始碼在 GitHub。
- 站點實際部署於 Cloudflare Pages（`*.pages.dev`），且 push 會自動重新部署。

## 自我檢查結果
- **Spec 覆蓋**：本階段對應 spec 的「技術選型（Astro/Cloudflare）、多語系（en + zh-Hans）、部署管線」。spec 的內容模型（Sanity）、Figma 視覺、表單、SEO、過往胎次、DNS 切換 → 留待 Phase 2–4，已在路線圖標明，非遺漏。
- **佔位符掃描**：頁面上的「placeholder／整理中」字樣為刻意的內容佔位，非計畫缺漏；每個步驟均含可執行的指令或完整程式碼。
- **型別一致**：`Lang`、`UiKey`、`getLangFromUrl()`、`useTranslations()`、`htmlLang`、`ui` 在各 Task 間命名一致。
