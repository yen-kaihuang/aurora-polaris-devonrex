# Adoption Questionnaire Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/en/adoption-questionnaire` 與 `/zh/adoption-questionnaire` 兩條路徑上線雙語領養問卷表單，透過 Web3Forms 將申請以 email 送到 `info@apdevonrex.com`，並完成樣式、互動、Nav 連結整合。

**Architecture:** 單一 Astro 頁面 + 一個 `AdoptionForm.astro` 元件（HTML form + scoped CSS + 一段 vanilla JS client script），i18n 走既有的 `src/i18n/ui.ts` 字典；client script 攔截 submit 改用 fetch 提交，成功時就地替換為感謝訊息，JS 失效時 fallback 至 Web3Forms 預設成功頁。Web3Forms access key 走環境變數 `PUBLIC_WEB3FORMS_KEY`，不寫死於 repo。

**Tech Stack:** Astro 6、TypeScript strict、Vitest、Web3Forms HTTP API、Vanilla JS（無 framework）

**Spec:** `docs/superpowers/specs/2026-06-20-adoption-questionnaire-design.md`

---

## 檔案結構（本階段建立 / 異動）

```
aurora-polaris-devonrex/
├─ src/
│  ├─ pages/[lang]/
│  │  └─ adoption-questionnaire.astro     # 新增：路由頁面（薄殼）
│  ├─ components/
│  │  ├─ AdoptionForm.astro               # 新增：表單元件（HTML + CSS + script）
│  │  └─ Nav.astro                        # 修改：adoption 連結 href
│  ├─ i18n/
│  │  ├─ ui.ts                            # 修改：新增 adoption.* 字典
│  │  └─ adoption.test.ts                 # 新增：keys 存在性測試
│  └─ config/
│     └─ forms.ts                         # 新增：Web3Forms 設定
└─ .env.example                           # 新增：列出 PUBLIC_WEB3FORMS_KEY
```

---

### Task 1：i18n 字典與 keys 測試（TDD）

**Files:**
- Create: `src/i18n/adoption.test.ts`
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1：先寫失敗的測試**

```ts
// src/i18n/adoption.test.ts
import { describe, it, expect } from 'vitest';
import { ui } from './ui';

const requiredKeys = [
  // hero / intro
  'adoption.heroTitle',
  'adoption.intro',
  // 18 field labels
  'adoption.fields.first_name',
  'adoption.fields.last_name',
  'adoption.fields.email',
  'adoption.fields.phone',
  'adoption.fields.address',
  'adoption.fields.alt_contact',
  'adoption.fields.family_members',
  'adoption.fields.other_pets',
  'adoption.fields.living_situation',
  'adoption.fields.interest_in_devon_rex',
  'adoption.fields.personality_preference',
  'adoption.fields.personality_other',
  'adoption.fields.age_preference',
  'adoption.fields.quality_level',
  'adoption.fields.coat_color',
  'adoption.fields.wait_time',
  'adoption.fields.referral_source',
  'adoption.fields.additional_info',
  // options
  'adoption.options.personality_preference.outgoing',
  'adoption.options.personality_preference.energetic',
  'adoption.options.personality_preference.vocal',
  'adoption.options.personality_preference.laid_back',
  'adoption.options.personality_preference.quiet',
  'adoption.options.personality_preference.energetic_relaxed',
  'adoption.options.personality_preference.other',
  'adoption.options.age_preference.kitten',
  'adoption.options.age_preference.adult',
  'adoption.options.quality_level.pet',
  'adoption.options.quality_level.breeding',
  'adoption.options.quality_level.show',
  'adoption.options.quality_level.retention',
  'adoption.options.coat_color.solid',
  'adoption.options.coat_color.bicolor_van',
  'adoption.options.coat_color.calico_van',
  'adoption.options.coat_color.tabby',
  'adoption.options.coat_color.pointed',
  'adoption.options.wait_time.lt_3m',
  'adoption.options.wait_time.3_6m',
  'adoption.options.wait_time.6_12m',
  'adoption.options.wait_time.gt_12m',
  // errors
  'adoption.errors.required',
  'adoption.errors.email',
  'adoption.errors.submit',
  'adoption.errors.submitWithReason',
  // buttons + thanks
  'adoption.submitButton',
  'adoption.submitButtonSending',
  'adoption.thanksTitle',
  'adoption.thanksBody',
  'adoption.backToHome',
] as const;

describe('adoption i18n keys', () => {
  for (const lang of ['en', 'zh'] as const) {
    it(`all required keys exist and are non-empty in ${lang}`, () => {
      const dict = ui[lang] as Record<string, string>;
      const missing = requiredKeys.filter((k) => !dict[k]);
      expect(missing).toEqual([]);
    });
    it(`submitWithReason in ${lang} contains {reason} placeholder`, () => {
      const dict = ui[lang] as Record<string, string>;
      expect(dict['adoption.errors.submitWithReason']).toContain('{reason}');
    });
  }
});
```

- [ ] **Step 2：執行測試，確認失敗**

```bash
npm test -- src/i18n/adoption.test.ts
```

預期：FAIL — 50+ keys missing。

- [ ] **Step 3：在 `src/i18n/ui.ts` 新增 adoption keys（en 區塊）**

在 `en` 區塊現有的 `'litters.kLocation': 'Location',` 之後、`}` 之前插入：

```ts
    // 領養問卷
    'adoption.heroTitle': 'Adoption Questionnaire',
    'adoption.intro': "We've opened 20 new spots on our 2026 waiting list. Please complete the questionnaire below so we can find the perfect match for each pet and prospective owner.",

    'adoption.fields.first_name': 'First name',
    'adoption.fields.last_name': 'Last name',
    'adoption.fields.email': 'Email',
    'adoption.fields.phone': 'Phone number',
    'adoption.fields.address': 'Address',
    'adoption.fields.alt_contact': 'Alternative contact (WeChat / WhatsApp / Messenger, etc.)',
    'adoption.fields.family_members': 'Family members (name, age, relationship)',
    'adoption.fields.other_pets': 'Other pets (breed, age, sex, and your introduction plan)',
    'adoption.fields.living_situation': 'Living situation (employment, home ownership / rental, pet-friendliness, smoking status)',
    'adoption.fields.interest_in_devon_rex': 'Why are you interested in Devon Rex?',
    'adoption.fields.personality_preference': 'Personality preference',
    'adoption.fields.personality_other': 'Please describe the personality you are looking for',
    'adoption.fields.age_preference': 'Age preference',
    'adoption.fields.quality_level': 'Quality level',
    'adoption.fields.coat_color': 'Coat color',
    'adoption.fields.wait_time': 'Acceptable wait time',
    'adoption.fields.referral_source': 'How did you hear about us? Any prior adoption history or personal connections?',
    'adoption.fields.additional_info': 'Additional information',

    'adoption.options.personality_preference.outgoing': 'Outgoing / friendly',
    'adoption.options.personality_preference.energetic': 'Very energetic',
    'adoption.options.personality_preference.vocal': 'Vocal',
    'adoption.options.personality_preference.laid_back': 'Laid back',
    'adoption.options.personality_preference.quiet': 'Quiet',
    'adoption.options.personality_preference.energetic_relaxed': 'Energetic with relaxation',
    'adoption.options.personality_preference.other': 'Other',

    'adoption.options.age_preference.kitten': 'Kitten (4–5 months)',
    'adoption.options.age_preference.adult': 'Adult cat (4–5 years)',

    'adoption.options.quality_level.pet': 'Pet Quality (CA$2,500–3,000)',
    'adoption.options.quality_level.breeding': 'Breeding Quality (CA$3,100–4,000)',
    'adoption.options.quality_level.show': 'Show Quality (CA$4,100–5,000)',
    'adoption.options.quality_level.retention': 'Retention Quality (CA$5,100+)',

    'adoption.options.coat_color.solid': 'Solid color',
    'adoption.options.coat_color.bicolor_van': 'Bi-color / van',
    'adoption.options.coat_color.calico_van': 'Calico / van calico',
    'adoption.options.coat_color.tabby': 'Tabby',
    'adoption.options.coat_color.pointed': 'Pointed',

    'adoption.options.wait_time.lt_3m': 'Less than 3 months',
    'adoption.options.wait_time.3_6m': '3–6 months',
    'adoption.options.wait_time.6_12m': '6–12 months',
    'adoption.options.wait_time.gt_12m': 'More than 12 months',

    'adoption.errors.required': 'Please fill out this field.',
    'adoption.errors.email': 'Please enter a valid email address.',
    'adoption.errors.submit': "We couldn't send your application. Please try again, or email us at info@apdevonrex.com.",
    'adoption.errors.submitWithReason': "We couldn't send your application: {reason}. Please try again, or email us at info@apdevonrex.com.",

    'adoption.submitButton': 'Submit Application',
    'adoption.submitButtonSending': 'Sending…',
    'adoption.thanksTitle': 'Thank you!',
    'adoption.thanksBody': "We've received your application and will be in touch soon.",
    'adoption.backToHome': 'Back to home',
```

- [ ] **Step 4：在 `src/i18n/ui.ts` 新增 adoption keys（zh 區塊）**

在 `zh` 區塊現有的 `'litters.kLocation': '所在地',` 之後、`}` 之前插入：

```ts
    // 領養問卷
    'adoption.heroTitle': '领养问卷',
    'adoption.intro': '我们已开放 2026 年等候名单的 20 个新名额。请填写以下问卷，让我们为每只猫咪与未来主人找到最合适的搭配。',

    'adoption.fields.first_name': '名字 (First name)',
    'adoption.fields.last_name': '姓氏 (Last name)',
    'adoption.fields.email': '电子邮件',
    'adoption.fields.phone': '电话',
    'adoption.fields.address': '地址',
    'adoption.fields.alt_contact': '其他联系方式（WeChat / WhatsApp / Messenger 等）',
    'adoption.fields.family_members': '家庭成员（姓名、年龄、关系）',
    'adoption.fields.other_pets': '家中其他宠物（品种、年龄、性别，以及介绍计划）',
    'adoption.fields.living_situation': '居住情况（工作、自有或租屋、是否宠物友善、是否吸烟）',
    'adoption.fields.interest_in_devon_rex': '为什么对德文卷毛猫感兴趣？',
    'adoption.fields.personality_preference': '希望的个性',
    'adoption.fields.personality_other': '请描述您理想中的猫咪个性',
    'adoption.fields.age_preference': '年龄偏好',
    'adoption.fields.quality_level': '品质等级',
    'adoption.fields.coat_color': '毛色偏好',
    'adoption.fields.wait_time': '可接受的等候时间',
    'adoption.fields.referral_source': '您是如何认识我们的？是否有过去领养经验或熟人介绍？',
    'adoption.fields.additional_info': '其他想告诉我们的事',

    'adoption.options.personality_preference.outgoing': '亲人 / 友善',
    'adoption.options.personality_preference.energetic': '非常活泼',
    'adoption.options.personality_preference.vocal': '爱说话',
    'adoption.options.personality_preference.laid_back': '悠闲随和',
    'adoption.options.personality_preference.quiet': '安静',
    'adoption.options.personality_preference.energetic_relaxed': '活泼但能放松',
    'adoption.options.personality_preference.other': '其他',

    'adoption.options.age_preference.kitten': '幼猫（4–5 个月）',
    'adoption.options.age_preference.adult': '成猫（4–5 岁）',

    'adoption.options.quality_level.pet': '宠物级 (CA$2,500–3,000)',
    'adoption.options.quality_level.breeding': '繁育级 (CA$3,100–4,000)',
    'adoption.options.quality_level.show': '赛级 (CA$4,100–5,000)',
    'adoption.options.quality_level.retention': '保留级 (CA$5,100+)',

    'adoption.options.coat_color.solid': '纯色',
    'adoption.options.coat_color.bicolor_van': '双色 / van',
    'adoption.options.coat_color.calico_van': '玳瑁 / van 玳瑁',
    'adoption.options.coat_color.tabby': '虎斑',
    'adoption.options.coat_color.pointed': '重点色',

    'adoption.options.wait_time.lt_3m': '少于 3 个月',
    'adoption.options.wait_time.3_6m': '3–6 个月',
    'adoption.options.wait_time.6_12m': '6–12 个月',
    'adoption.options.wait_time.gt_12m': '超过 12 个月',

    'adoption.errors.required': '请填写此栏。',
    'adoption.errors.email': '请输入有效的电子邮件地址。',
    'adoption.errors.submit': '送出失败，请再试一次，或直接来信 info@apdevonrex.com。',
    'adoption.errors.submitWithReason': '送出失败：{reason}。请再试一次，或直接来信 info@apdevonrex.com。',

    'adoption.submitButton': '送出申请',
    'adoption.submitButtonSending': '送出中…',
    'adoption.thanksTitle': '感谢您的申请！',
    'adoption.thanksBody': '我们已收到您的资料，会尽快与您联系。',
    'adoption.backToHome': '回首页',
```

- [ ] **Step 5：執行測試，確認通過**

```bash
npm test -- src/i18n/adoption.test.ts
```

預期：兩個 describe 區塊全 PASS。

- [ ] **Step 6：執行全部測試確認沒退化**

```bash
npm test
```

預期：所有現有測試 + 新測試皆 PASS。

- [ ] **Step 7：Commit**

```bash
git add src/i18n/adoption.test.ts src/i18n/ui.ts
git commit -m "feat(i18n): 新增 Adoption Questionnaire 字典與 keys 測試"
```

---

### Task 2：Web3Forms 設定模組

**Files:**
- Create: `src/config/forms.ts`
- Create: `.env.example`

- [ ] **Step 1：建立設定模組**

```ts
// src/config/forms.ts
export const web3formsAccessKey = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';
export const web3formsEndpoint = 'https://api.web3forms.com/submit';
```

- [ ] **Step 2：建立 .env.example**

```
# Web3Forms access key — register at https://web3forms.com
PUBLIC_WEB3FORMS_KEY=
```

- [ ] **Step 3：型別檢查**

```bash
npm run astro check
```

預期：通過（無新增錯誤）。

- [ ] **Step 4：Commit**

```bash
git add src/config/forms.ts .env.example
git commit -m "feat(forms): 新增 Web3Forms 設定模組與 env 範本"
```

---

### Task 3：頁面路由與表單骨架（純 HTML，無樣式、無互動）

**Files:**
- Create: `src/pages/[lang]/adoption-questionnaire.astro`
- Create: `src/components/AdoptionForm.astro`

- [ ] **Step 1：建立頁面路由**

```astro
---
// src/pages/[lang]/adoption-questionnaire.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import AdoptionForm from '../../components/AdoptionForm.astro';
import { useTranslations } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';

export function getStaticPaths() {
  return [{ params: { lang: 'en' } }, { params: { lang: 'zh' } }];
}

const lang = Astro.params.lang as Lang;
const t = useTranslations(lang);
---

<BaseLayout title={t('adoption.heroTitle')}>
  <AdoptionForm lang={lang} />
</BaseLayout>
```

- [ ] **Step 2：建立 AdoptionForm 骨架（全部 18 欄位 + hidden + honeypot，無樣式）**

```astro
---
// src/components/AdoptionForm.astro
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';
import { web3formsAccessKey, web3formsEndpoint } from '../config/forms';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = useTranslations(lang);

if (!web3formsAccessKey) {
  console.warn('[adoption-questionnaire] PUBLIC_WEB3FORMS_KEY is not set. Form submissions will fail.');
}

const personalityOptions = ['outgoing', 'energetic', 'vocal', 'laid_back', 'quiet', 'energetic_relaxed', 'other'] as const;
const ageOptions = ['kitten', 'adult'] as const;
const qualityOptions = ['pet', 'breeding', 'show', 'retention'] as const;
const colorOptions = ['solid', 'bicolor_van', 'calico_van', 'tabby', 'pointed'] as const;
const waitOptions = ['lt_3m', '3_6m', '6_12m', 'gt_12m'] as const;
---

<section class="adoption">
  <header class="adoption-hero">
    <h1>{t('adoption.heroTitle')}</h1>
    <p>{t('adoption.intro')}</p>
  </header>

  <div class="adoption-card">
    <div class="adoption-error" data-error hidden></div>

    <form
      class="adoption-form"
      data-form
      action={web3formsEndpoint}
      method="POST"
      novalidate
    >
      <input type="hidden" name="access_key" value={web3formsAccessKey} />
      <input type="hidden" name="from_name" data-from-name value="" />
      <input type="hidden" name="subject" data-subject value="New Adoption Application" />
      <input type="checkbox" name="botcheck" class="adoption-honeypot" tabindex="-1" autocomplete="off" />

      <div class="row two">
        <label>
          <span>{t('adoption.fields.first_name')}</span>
          <input type="text" name="first_name" data-first-name required autocomplete="given-name" />
        </label>
        <label>
          <span>{t('adoption.fields.last_name')}</span>
          <input type="text" name="last_name" data-last-name required autocomplete="family-name" />
        </label>
      </div>

      <label>
        <span>{t('adoption.fields.email')}</span>
        <input type="email" name="email" required autocomplete="email" />
      </label>

      <label>
        <span>{t('adoption.fields.phone')}</span>
        <input type="tel" name="phone" required autocomplete="tel" />
      </label>

      <label>
        <span>{t('adoption.fields.address')}</span>
        <input type="text" name="address" required autocomplete="street-address" />
      </label>

      <label>
        <span>{t('adoption.fields.alt_contact')}</span>
        <input type="text" name="alt_contact" />
      </label>

      <label>
        <span>{t('adoption.fields.family_members')}</span>
        <textarea name="family_members" rows="3"></textarea>
      </label>

      <label>
        <span>{t('adoption.fields.other_pets')}</span>
        <textarea name="other_pets" rows="3"></textarea>
      </label>

      <label>
        <span>{t('adoption.fields.living_situation')}</span>
        <textarea name="living_situation" rows="3"></textarea>
      </label>

      <label>
        <span>{t('adoption.fields.interest_in_devon_rex')}</span>
        <textarea name="interest_in_devon_rex" rows="3"></textarea>
      </label>

      <fieldset>
        <legend>{t('adoption.fields.personality_preference')}</legend>
        {personalityOptions.map((opt) => (
          <label class="radio">
            <input type="radio" name="personality_preference" value={opt} data-personality required />
            <span>{t(`adoption.options.personality_preference.${opt}` as const)}</span>
          </label>
        ))}
      </fieldset>

      <label data-personality-other hidden>
        <span>{t('adoption.fields.personality_other')}</span>
        <textarea name="personality_other" rows="3"></textarea>
      </label>

      <fieldset>
        <legend>{t('adoption.fields.age_preference')}</legend>
        {ageOptions.map((opt) => (
          <label class="radio">
            <input type="radio" name="age_preference" value={opt} required />
            <span>{t(`adoption.options.age_preference.${opt}` as const)}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>{t('adoption.fields.quality_level')}</legend>
        {qualityOptions.map((opt) => (
          <label class="radio">
            <input type="radio" name="quality_level" value={opt} required />
            <span>{t(`adoption.options.quality_level.${opt}` as const)}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>{t('adoption.fields.coat_color')}</legend>
        {colorOptions.map((opt) => (
          <label class="radio">
            <input type="radio" name="coat_color" value={opt} required />
            <span>{t(`adoption.options.coat_color.${opt}` as const)}</span>
          </label>
        ))}
      </fieldset>

      <label>
        <span>{t('adoption.fields.wait_time')}</span>
        <select name="wait_time" required>
          <option value="" disabled selected></option>
          {waitOptions.map((opt) => (
            <option value={opt}>{t(`adoption.options.wait_time.${opt}` as const)}</option>
          ))}
        </select>
      </label>

      <label>
        <span>{t('adoption.fields.referral_source')}</span>
        <textarea name="referral_source" rows="3"></textarea>
      </label>

      <label>
        <span>{t('adoption.fields.additional_info')}</span>
        <textarea name="additional_info" rows="3"></textarea>
      </label>

      <button type="submit" data-submit>{t('adoption.submitButton')}</button>
    </form>

    <div class="adoption-thanks" data-thanks hidden>
      <h2>{t('adoption.thanksTitle')}</h2>
      <p>{t('adoption.thanksBody')}</p>
      <a href={`/${lang}/`}>{t('adoption.backToHome')}</a>
    </div>
  </div>
</section>
```

- [ ] **Step 3：型別檢查 + build**

```bash
npm run astro check
npm run build
```

預期：兩者皆通過。

- [ ] **Step 4：本地預覽手動驗證**

```bash
npm run dev
```

依序開啟並確認頁面渲染、所有 18 欄位 + Submit 按鈕都看得到：
- http://localhost:4321/en/adoption-questionnaire
- http://localhost:4321/zh/adoption-questionnaire

`Ctrl+C` 結束。

- [ ] **Step 5：Commit**

```bash
git add src/pages/[lang]/adoption-questionnaire.astro src/components/AdoptionForm.astro
git commit -m "feat(adoption): 新增雙語領養問卷頁面與表單骨架"
```

---

### Task 4：表單樣式（沿用既有頁面視覺）

**Files:**
- Modify: `src/components/AdoptionForm.astro`

- [ ] **Step 1：在 AdoptionForm.astro 最下方加入 scoped style**

在 `</section>` 之後、檔案結尾新增：

```astro
<style>
  .adoption {
    background: var(--color-bg);
    font-family: var(--font-brand);
    padding: clamp(140px, 16vw, 220px) var(--page-pad) clamp(60px, 8vw, 110px);
  }

  .adoption-hero {
    max-width: 880px;
    margin: 0 auto clamp(40px, 5vw, 72px);
    text-align: center;
  }

  .adoption-hero h1 {
    font-family: var(--font-brand);
    font-weight: normal;
    font-size: clamp(38px, 5.5vw, 64px);
    color: var(--color-text);
    margin-bottom: clamp(18px, 2.5vw, 28px);
  }

  .adoption-hero p {
    font-size: clamp(16px, 1.4vw, 20px);
    line-height: 1.7;
    color: var(--color-text-light);
  }

  .adoption-card {
    max-width: 880px;
    margin: 0 auto;
    background: var(--color-band-soft);
    padding: clamp(32px, 5vw, 72px);
    border-radius: 4px;
  }

  .adoption-error {
    background: rgba(180, 60, 60, 0.12);
    border: 1px solid rgba(180, 60, 60, 0.55);
    color: #7a2b2b;
    padding: 14px 18px;
    margin-bottom: 24px;
    border-radius: 4px;
    font-size: 15px;
    line-height: 1.5;
  }

  .adoption-form {
    display: flex;
    flex-direction: column;
    gap: clamp(20px, 2.4vw, 28px);
  }

  .adoption-form label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: clamp(15px, 1.2vw, 17px);
    color: var(--color-text);
  }

  .adoption-form label > span {
    font-weight: 500;
  }

  .adoption-form input[type='text'],
  .adoption-form input[type='email'],
  .adoption-form input[type='tel'],
  .adoption-form textarea,
  .adoption-form select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid rgba(83, 86, 92, 0.35);
    background: rgba(255, 255, 255, 0.7);
    font-family: inherit;
    font-size: inherit;
    color: var(--color-text);
    border-radius: 3px;
    transition: border-color 0.15s;
  }

  .adoption-form input:focus,
  .adoption-form textarea:focus,
  .adoption-form select:focus {
    outline: none;
    border-color: var(--color-text);
  }

  .adoption-form textarea {
    resize: vertical;
    min-height: 80px;
  }

  .adoption-form .row.two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(16px, 2vw, 24px);
  }

  .adoption-form fieldset {
    border: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .adoption-form fieldset legend {
    font-size: clamp(15px, 1.2vw, 17px);
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--color-text);
  }

  .adoption-form .radio {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    font-weight: normal;
    cursor: pointer;
  }

  .adoption-form .radio input {
    accent-color: var(--color-text);
  }

  .adoption-form button[type='submit'] {
    margin-top: 16px;
    padding: 14px 32px;
    background: var(--color-text);
    color: #fff;
    border: none;
    font-family: inherit;
    font-size: clamp(15px, 1.2vw, 17px);
    cursor: pointer;
    transition: opacity 0.15s;
    align-self: center;
    min-width: 200px;
  }

  .adoption-form button[type='submit']:hover {
    opacity: 0.85;
  }

  .adoption-form button[type='submit']:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .adoption-honeypot {
    position: absolute;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
  }

  .adoption-thanks {
    text-align: center;
    padding: clamp(32px, 6vw, 72px) 0;
  }

  .adoption-thanks h2 {
    font-family: var(--font-brand);
    font-weight: normal;
    font-size: clamp(28px, 4vw, 44px);
    color: var(--color-text);
    margin-bottom: 16px;
  }

  .adoption-thanks p {
    font-size: clamp(16px, 1.4vw, 20px);
    color: var(--color-text-light);
    margin-bottom: 24px;
  }

  .adoption-thanks a {
    color: var(--color-text);
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .adoption-form .row.two {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2：本地預覽手動驗證**

```bash
npm run dev
```

桌面寬度 + DevTools 模擬手機（375px）兩個寬度，分別開 en / zh 兩條路徑，確認：
- Hero、表單卡片、輸入框、radio、submit 按鈕都套用樣式
- 響應式下 first/last name 從兩欄變單欄

`Ctrl+C` 結束。

- [ ] **Step 3：Commit**

```bash
git add src/components/AdoptionForm.astro
git commit -m "feat(adoption): 套用領養問卷頁樣式（沿用既有米色卡片風格）"
```

---

### Task 5：Client script — 送出流程（progressive enhancement）

**Files:**
- Modify: `src/components/AdoptionForm.astro`

- [ ] **Step 1：在 AdoptionForm.astro 的 `<style>` 之後加入 client script**

```astro
<script is:inline define:vars={{
  endpoint: web3formsEndpoint,
  errorMessage: t('adoption.errors.submit'),
  errorWithReason: t('adoption.errors.submitWithReason'),
  submitLabel: t('adoption.submitButton'),
  sendingLabel: t('adoption.submitButtonSending'),
}}>
(() => {
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const errorBox = document.querySelector('[data-error]');
  const thanksBox = document.querySelector('[data-thanks]');
  const submitBtn = form.querySelector('[data-submit]');
  const firstNameInput = form.querySelector('[data-first-name]');
  const lastNameInput = form.querySelector('[data-last-name]');
  const fromNameInput = form.querySelector('[data-from-name]');
  const subjectInput = form.querySelector('[data-subject]');

  function showError(reason) {
    if (!errorBox) return;
    const msg = reason
      ? errorWithReason.replace('{reason}', reason)
      : errorMessage;
    errorBox.textContent = msg;
    errorBox.hidden = false;
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setSubmitting(isSending) {
    if (!submitBtn) return;
    submitBtn.disabled = isSending;
    submitBtn.textContent = isSending ? sendingLabel : submitLabel;
  }

  form.addEventListener('submit', async (event) => {
    // Browser native validation runs first via reportValidity()
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    event.preventDefault();
    errorBox.hidden = true;

    // Populate from_name + subject from first/last name
    const fullName = `${firstNameInput.value} ${lastNameInput.value}`.trim();
    fromNameInput.value = fullName;
    subjectInput.value = `New Adoption Application - ${fullName}`;

    setSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        form.hidden = true;
        if (thanksBox) thanksBox.hidden = false;
        thanksBox?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      showError(data.message || '');
    } catch (err) {
      showError('');
    } finally {
      setSubmitting(false);
    }
  });
})();
</script>
```

> 註：因 `<form novalidate>` 我們手動呼叫 `checkValidity()` 觸發瀏覽器原生提示；`reportValidity()` 會自動顯示原生錯誤 UI。

- [ ] **Step 2：本地預覽 — 故意送出空白表單**

```bash
npm run dev
```

開 `/en/adoption-questionnaire`，直接按 Submit：
- 預期：瀏覽器原生紅框提示 `First name` 必填，不送出。

填完必填但 access key 未設（`.env` 不要建立 `PUBLIC_WEB3FORMS_KEY`），按 Submit：
- 預期：按鈕短暫變 "Sending..."，接著表單上方出現紅色錯誤 banner，按鈕回復。

`Ctrl+C` 結束。

- [ ] **Step 3：Commit**

```bash
git add src/components/AdoptionForm.astro
git commit -m "feat(adoption): 送出流程 client script（progressive enhancement）"
```

---

### Task 6：Client script — personality_other 條件邏輯 + 自訂驗證訊息

**Files:**
- Modify: `src/components/AdoptionForm.astro`

- [ ] **Step 1：擴充 client script，新增條件 textarea 與自訂錯誤訊息**

在 `<script is:inline define:vars={{ ... }}>` 的 `define:vars` 物件補上兩個 key：

```ts
  requiredMessage: t('adoption.errors.required'),
  emailMessage: t('adoption.errors.email'),
```

接著在 script 內 `setSubmitting` 函式之後、`form.addEventListener('submit', ...)` 之前插入：

```ts
  // ---- personality_other conditional ----
  const personalityRadios = form.querySelectorAll('[data-personality]');
  const otherLabel = document.querySelector('[data-personality-other]');
  const otherTextarea = otherLabel?.querySelector('textarea');
  function syncPersonalityOther() {
    const selected = form.querySelector('[data-personality]:checked');
    const isOther = selected?.value === 'other';
    if (!otherLabel || !otherTextarea) return;
    otherLabel.hidden = !isOther;
    otherTextarea.required = isOther;
    if (!isOther) otherTextarea.value = '';
  }
  personalityRadios.forEach((r) => r.addEventListener('change', syncPersonalityOther));

  // ---- i18n native validation messages ----
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach((el) => {
    el.addEventListener('invalid', () => {
      if (el.validity.valueMissing) {
        el.setCustomValidity(requiredMessage);
      } else if (el.validity.typeMismatch && el.type === 'email') {
        el.setCustomValidity(emailMessage);
      }
    });
    el.addEventListener('input', () => el.setCustomValidity(''));
    el.addEventListener('change', () => el.setCustomValidity(''));
  });
```

- [ ] **Step 2：本地預覽手動驗證**

```bash
npm run dev
```

- 開 `/en/adoption-questionnaire`：
  - 點 Personality preference 的 "Other" → 下方 textarea 出現
  - 點其他選項 → textarea 隱藏
  - 選 "Other" 後不填 textarea 直接送出 → 瀏覽器提示該欄位必填
  - 把 email 填成 `not-an-email` 後 submit → 瀏覽器提示翻譯後的 email 錯誤訊息
- 切到 `/zh/adoption-questionnaire`：必填訊息與 email 訊息是中文

`Ctrl+C` 結束。

- [ ] **Step 3：Commit**

```bash
git add src/components/AdoptionForm.astro
git commit -m "feat(adoption): 條件 textarea 與 i18n 自訂驗證訊息"
```

---

### Task 7：Nav 連結同步

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1：把 adoption 連結 `href: '#'` 改為實際路徑**

在 `src/components/Nav.astro` 找到：

```astro
  { href: '#', label: t('nav.adoption') },
```

改為：

```astro
  { href: `${base}/adoption-questionnaire`, label: t('nav.adoption') },
```

- [ ] **Step 2：本地預覽**

```bash
npm run dev
```

從首頁 `/en/`、`/zh/` 點 nav 的 "Adoption Questionnaire" / "领养问卷" 連結，確認導到對應語言的問卷頁。`Ctrl+C` 結束。

- [ ] **Step 3：Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(nav): 連結 Adoption Questionnaire 至實際頁面"
```

---

### Task 8：整合驗證

**Files:** 無新增異動，純驗證

- [ ] **Step 1：跑所有測試**

```bash
npm test
```

預期：所有測試 PASS（含 Task 1 的 adoption 字典測試）。

- [ ] **Step 2：型別檢查 + production build**

```bash
npm run astro check
npm run build
```

預期：兩者皆通過。`dist/en/adoption-questionnaire/index.html` 與 `dist/zh/adoption-questionnaire/index.html` 兩個檔案存在。

- [ ] **Step 3：本地 preview 模擬正式環境**

```bash
npm run preview
```

開 `http://localhost:4321/en/adoption-questionnaire` 與 `/zh/adoption-questionnaire`：
- 桌面 + 手機（DevTools 模擬 375px）兩寬度都檢查
- Nav、Footer、Hero 與表單卡片視覺正常
- 切換語言時頁面對應切換、欄位文字翻譯

`Ctrl+C` 結束。

- [ ] **Step 4：（可選）真實 Web3Forms 測試**

> 此步驟需使用者先提供 `PUBLIC_WEB3FORMS_KEY`。若 key 尚未取得，可暫時跳過，等部署到 Cloudflare Pages 後再做真實測試。

於專案根目錄建 `.env`（已被 .gitignore 排除）：

```
PUBLIC_WEB3FORMS_KEY=<貓舍提供的 key>
```

`npm run dev` → 填好整份表單 → Submit → 確認：
- 表單區塊被感謝訊息取代
- `info@apdevonrex.com` 收到英文格式 email，欄位名稱為 `first_name=...`、`personality_preference=outgoing` 等英文 key

- [ ] **Step 5：清理 .env（如有）**

若 Step 4 有建 `.env`，留在本機即可（已被 .gitignore 排除，不會 commit）。

---

## 完成定義

- `npm test` 全 PASS（含新增的 adoption keys 測試）
- `npm run build` 成功，產出 `dist/en/adoption-questionnaire/index.html` 與 `dist/zh/adoption-questionnaire/index.html`
- 兩條路徑桌面 + 手機寬度視覺正常
- 必填欄位空白送出會被瀏覽器原生擋下（i18n 訊息）
- personality_preference 選 "Other" 會顯示條件 textarea 且必填
- Nav 的 "Adoption Questionnaire" / "领养问卷" 點下去進到實際頁面
- （部署後驗證）成功送出 → `info@apdevonrex.com` 收到英文格式 email

## 開放／後續

- Shipping 頁面：另開 spec / plan
- hCaptcha 升級：視 spam 量再評估
- dev mode access key 缺值頁面警示橫幅：reviewer advisory，未納入此計畫
