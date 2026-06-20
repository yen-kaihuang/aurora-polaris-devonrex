# Adoption Questionnaire 表單頁 — 設計文件

- 日期：2026-06-20
- 狀態：設計定案，待使用者最終審閱
- 參考：現有網站 https://www.apdevonrex.com/adoption-questionnaire

## 1. 目標與背景

在新版 Astro 站台新增 `/en/adoption-questionnaire` 與 `/zh/adoption-questionnaire` 兩個雙語頁面，提供潛在領養人填寫申請表單；送出後以 email 通知貓舍信箱，不保存至資料庫，不進入後台。原本貓舍在 Wix 站台用 Wix Form 蒐集，新版要脫離 Wix 環境並對齊新版 Penpot 視覺。

本 spec 對應 `docs/superpowers/specs/2026-06-12-devonrex-cattery-website-design.md` 的「§2 功能需求 — 聯絡／詢問表單」與「§6 部署與 DNS — 表單流程」。

## 2. 需求

### 功能需求
- 重現原網站 18 個欄位的領養問卷，並按本 spec §4 表格做必填/必選微調。
- 送出後以 **email 通知**貓舍信箱 `info@apdevonrex.com`，不保存至資料庫、不需後台查看。
- 多語系：英文 (`/en/`) 與 簡體中文 (`/zh/`) 各一份頁面，欄位 label / 選項 / 錯誤訊息 / 感謝訊息皆翻譯。
- 送出成功後顯示 **inline 感謝訊息**取代表單區塊；網址不變。
- 表單需可在 JavaScript 失效時 fallback 至 Web3Forms 預設成功頁，保持可用性。

### 非功能需求
- 不引入 client 端 framework（React/Vue 等）；僅使用 vanilla JS。
- 不引入新的 npm 套件（Web3Forms 純走 HTTP API）。
- 不寫死 secret：Web3Forms access key 走環境變數。

### 明確排除（YAGNI）
- 不做後台保存表單紀錄。
- 不做進階分析儀表板（送出統計）。
- 不做 multi-step wizard，全部欄位在一頁。
- 不做 hCaptcha；先用 Web3Forms 內建蜜罐欄位，視日後 spam 量再加。
- 不做表單草稿暫存（localStorage 草稿留待日後 YAGNI）。

## 3. 技術選型

| 角色 | 選用 | 理由 |
|------|------|------|
| 後端 | **Web3Forms** | spec §3 已選定；免費、純 email 通知、純前端 POST、無需自建後端 |
| 前端互動 | **Vanilla JS** | 單頁、無狀態，引入 framework 過重 |
| 視覺 | **沿用既有頁面樣式** | Penpot 設計稿無此頁；按 About Cattery / About DRX 同一語系自由發揮，使全站視覺一致 |
| 驗證 | **HTML5 原生 + setCustomValidity()** | 避免重複實作 validation；i18n 透過原生 API 注入 |
| 防 bot | **Web3Forms honeypot (`botcheck`)** | 內建零成本；視日後 spam 量再升級 hCaptcha |

## 4. 內容模型

### 4.1 欄位表

| # | Field name (POST key) | 類型 | 必填 | 選項 (POST value) |
|---|---|---|---|---|
| 1 | `first_name` | text | ✅ | — |
| 2 | `last_name` | text | ✅ | — |
| 3 | `email` | email | ✅ | — |
| 4 | `phone` | tel | ✅ | — |
| 5 | `address` | text | ✅ | — |
| 6 | `alt_contact` | text | ⬜ | — (WeChat / WhatsApp / Messenger) |
| 7 | `family_members` | textarea | ⬜ | — |
| 8 | `other_pets` | textarea | ⬜ | — |
| 9 | `living_situation` | textarea | ⬜ | — |
| 10 | `interest_in_devon_rex` | textarea | ⬜ | — |
| 11 | `personality_preference` | radio | ✅ | `outgoing` / `energetic` / `vocal` / `laid_back` / `quiet` / `energetic_relaxed` / `other` |
| 12 | `personality_other` | textarea | ⬜ | — （僅當 #11 = `other` 時顯示且必填）|
| 13 | `age_preference` | radio | ✅ | `kitten` / `adult` |
| 14 | `quality_level` | radio | ✅ | `pet` / `breeding` / `show` / `retention` |
| 15 | `coat_color` | radio | ✅ | `solid` / `bicolor_van` / `calico_van` / `tabby` / `pointed` |
| 16 | `wait_time` | select | ✅ | `lt_3m` / `3_6m` / `6_12m` / `gt_12m` |
| 17 | `referral_source` | textarea | ⬜ | — |
| 18 | `additional_info` | textarea | ⬜ | — |

**對原網站的調整：**
- 欄位 #1–#5 從「不限制」改為**必填**（原站缺此驗證，沒填 email / 電話會收到無法回覆的申請，視為 bug fix）。
- 欄位 #14 顯示時保留價格區間（例如 "Pet Quality (CA\$2,500–3,000)"），與原站一致。
- 欄位 #16 從自由輸入改為 dropdown 四選一，理由：方便貓舍依 wait time 分類處理；自由輸入會出現 "asap" / "2 months" / "as soon as possible" 等難以一致解讀的回答。

### 4.2 Web3Forms 額外 hidden 欄位

| Field | 值 | 用途 |
|---|---|---|
| `access_key` | 由環境變數注入 | Web3Forms 認證 |
| `subject` | `New Adoption Application - {first_name} {last_name}` | Email 主旨 |
| `from_name` | `{first_name} {last_name}` | Email 寄件名 |
| `botcheck` | `""` (CSS 隱藏的 checkbox) | 蜜罐：bot 會勾、人不會；Web3Forms 偵測後丟棄 |

### 4.3 雙語策略

- 路由：`/en/adoption-questionnaire` 與 `/zh/adoption-questionnaire`，與其他頁面一致。
- **顯示文字翻譯**：欄位 label、radio/select 選項文字、placeholder、HTML5 自訂驗證訊息、感謝訊息、錯誤 banner，en / zh 兩份都翻。
- **POST payload 固定英文**：欄位 name 與 radio/select 的 value 永遠是英文 key（例如使用者點「不怕生」實際送出 `personality_preference=outgoing`）。
- 收件 email：兩種語言送出的申請都進到同一個信箱 `info@apdevonrex.com`，貓舍永遠收到英文格式信件。

### 4.4 i18n 字典結構（`src/i18n/ui.ts` 內新增）

統一 namespace `adoption.*`：

```
adoption.heroTitle               # 頁面 H1
adoption.intro                   # 引言段落
adoption.fields.<fieldName>      # 18 欄 label
adoption.options.<fieldName>.<optionKey>  # radio/select 選項顯示文字
adoption.placeholders.<fieldName>  # textarea / input placeholder
adoption.errors.required         # 必填空白原生訊息
adoption.errors.email            # email 格式錯原生訊息
adoption.errors.submit           # 送出失敗 banner
adoption.submitButton            # 按鈕文字
adoption.submitButtonSending     # 送出中文字
adoption.thanksTitle             # 感謝訊息主標
adoption.thanksBody              # 感謝訊息內文
adoption.backToHome              # 感謝畫面內回首頁連結
```

## 5. 檔案結構（本階段建立 / 異動）

```
aurora-polaris-devonrex/
├─ src/
│  ├─ pages/[lang]/
│  │  └─ adoption-questionnaire.astro    # 新增：路由頁面（薄殼，import AdoptionForm）
│  ├─ components/
│  │  ├─ AdoptionForm.astro              # 新增：表單本體（HTML + scoped CSS + client script）
│  │  └─ Nav.astro                       # 修改：adoption 連結 href 從 '#' 改為實際路徑
│  ├─ i18n/
│  │  ├─ ui.ts                           # 修改：新增 adoption.* keys（en + zh）
│  │  └─ adoption.test.ts                # 新增：驗證 adoption.* keys 在兩語言皆存在
│  └─ config/
│     └─ forms.ts                        # 新增：Web3Forms 設定（讀環境變數）
├─ .env.example                          # 新增：列出 PUBLIC_WEB3FORMS_KEY
└─ docs/superpowers/specs/
   └─ 2026-06-20-adoption-questionnaire-design.md  # 本文件
```

> `AdoptionForm.astro` 採 single-file 設計（HTML + scoped style + 一段 `<script>` client 互動），不再切分子元件。若日後新增更多表單，再抽出共用 `FieldGroup` / `RadioGroup` 元件。

## 6. 送出流程

### 6.1 互動序列

```
頁面載入
  ↓
HTML <form action="https://api.web3forms.com/submit" method="POST">
（沒 JS 也可送出 → fallback 至 Web3Forms 預設成功頁）
  ↓
client script 在 DOMContentLoaded 後綁定 submit listener
  ↓
使用者點 Submit
  ↓
listener:
  ① e.preventDefault()
  ② 禁用 submit 按鈕、按鈕文字換為 "Sending..." (i18n)
  ③ 將 <form> 序列化為 FormData
  ④ fetch(action, { method: 'POST', body, headers: { Accept: 'application/json' } })
  ↓
回應處理
  ├─ res.ok && data.success === true
  │    → 用 thank-you 區塊取代整個 <form> 區塊
  └─ 其他情況（res.ok === false 或 data.success === false 或 fetch reject）
       → 在表單上方插入紅色 error banner
       → 按鈕文字回復、解除禁用
       → 不清空使用者已填內容
```

### 6.2 條件邏輯：`personality_other`

- 預設 hidden 且 `required` 為 false。
- 監聽 `personality_preference` 的 `change` 事件：
  - 選到 `other` → textarea 顯示、`required` 設 true
  - 選到其他 → textarea 隱藏且清空 `value`、`required` 設 false
- 提交時若隱藏狀態，不會被送出。

### 6.3 驗證策略

- 必填欄位用 HTML5 `required`，由瀏覽器原生 UI 處理。
- email 用 `type="email"`，由瀏覽器原生格式驗證。
- 不額外用 JS 重複驗證；瀏覽器原生訊息透過 `setCustomValidity()` 在第一次 `invalid` 事件改為 i18n 翻譯，並在 `input` 事件時清空 custom message 讓原生驗證接手。

### 6.4 錯誤處理

| 情境 | 處理 |
|---|---|
| 必填空白 / email 格式錯 | 瀏覽器原生提示（i18n 文字），不送出 |
| 網路失敗（fetch reject） | 表單上方紅色 banner：`adoption.errors.submit`，附 fallback 提示「請直接寄信至 info@apdevonrex.com」 |
| Web3Forms 回 `success: false` | 同上 banner，附 Web3Forms 回傳的 `message` 文字 |
| 蜜罐欄位 `botcheck` 被勾 | Web3Forms 端會擋；前端不顯示特殊提示（避免提示 bot），畫面照樣顯示「Thank you」 |

## 7. 設定與環境變數

`src/config/forms.ts`：

```ts
export const web3formsAccessKey = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';
export const web3formsEndpoint = 'https://api.web3forms.com/submit';
```

- 本地開發：`.env`（已在 `.gitignore`）放 `PUBLIC_WEB3FORMS_KEY=xxx`
- 線上：Cloudflare Pages 環境變數設 `PUBLIC_WEB3FORMS_KEY`
- 缺 key 時：`adoption-questionnaire.astro` 在 server 端 console.warn，頁面仍渲染但 hidden `access_key` 為空字串（送出會被 Web3Forms 拒絕，banner 顯示錯誤）
- `.env.example` 列出此變數供 onboarding 參考

## 8. 測試策略

### 自動化（Vitest）
- `src/i18n/adoption.test.ts`：對每個 `adoption.*` 必要 key 走遍 en / zh，斷言存在且非空字串。防止翻譯漏鍵。

### 人工驗證（實作完成後）
- 兩語言切換 → 欄位 label / 選項 / 按鈕文字皆翻譯
- 桌面 + 手機寬度版面正常（複用 existing breakpoints）
- 必填空白送出 → 瀏覽器原生提示出現
- 選 `personality_preference = other` → textarea 出現且變必填
- 完整填寫送出 → 感謝訊息出現 + `info@apdevonrex.com` 收到英文格式 email
- 故意填錯 access key → 錯誤 banner 出現、使用者填的內容保留

不做：
- e2e 測試（單頁、Web3Forms 是第三方、ROI 低）
- 視覺回歸測試

## 9. 部署與導覽

- 推上 GitHub 後 Cloudflare Pages 自動部署（前提：Phase 1 Task 8 已完成；若未完成，本 spec 不阻擋 — Web3Forms 在 local dev 也能跑通）。
- `Nav.astro:18` 的 `href: '#'` 同步改為 `\`${base}/adoption-questionnaire\``，雙語切換時保留正確路徑。
- Footer 不動。

## 10. 使用者需提供的資訊

實作前需要：
1. 至 https://web3forms.com 用 `info@apdevonrex.com` 註冊，取得 access key 給開發者。
2. 確認收件 email = `info@apdevonrex.com`（已在 `ui.ts` 的 `home.email`，預設沿用）。

實作中可邊做邊處理：
- 各欄位 label / 選項的 zh 翻譯文字若需貓舍方校稿，可在 i18n 完成後請使用者過目。

## 11. 待辦／開放項目

- Shipping 頁面：另開 spec，本 spec 範圍不涵蓋。
- 防 spam 升級（hCaptcha）：上線後觀察 spam 量再評估。
- 表單草稿暫存（localStorage）：暫不做。
- Web3Forms 收件 email 與帳號歸屬：上線後由貓舍方持續管理。
