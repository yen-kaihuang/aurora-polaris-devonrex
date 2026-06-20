# Shipping Page Design Spec

## Goal

在 `/en/shipping` 與 `/zh/shipping` 上線雙語運送資訊頁，內容對應現有 apdevonrex.com/shipping，視覺風格沿用本站米色卡片設計語言。

## Architecture

靜態資訊頁，無互動、無表單、無後端。

```
aurora-polaris-devonrex/
├─ src/
│  ├─ pages/[lang]/
│  │  └─ shipping.astro          # 新增：路由薄殼
│  ├─ components/
│  │  └─ ShippingInfo.astro      # 新增：頁面內容元件（HTML + scoped CSS）
│  ├─ i18n/
│  │  ├─ ui.ts                   # 修改：新增 shipping.* keys（en + zh）
│  │  └─ shipping.test.ts        # 新增：keys 存在性測試
│  └─ components/
│     └─ Nav.astro               # 修改：shipping href 從 '#' 改為實際路徑
```

## i18n Keys

| Key | en | zh |
|-----|----|----|
| `shipping.heroTitle` | Shipping Information | 运送信息 |
| `shipping.intro` | AP Devon Rex offers worldwide kitten shipping to numerous countries including Canada, USA, Italy, Thailand, and China. We partner with official pet transportation cargo companies and registered flight nannies, and always prioritize kitten well-being — encouraging local adoption when possible to reduce travel stress. | Aurora Polaris Devon Rex 提供全球幼猫运送服务，目的地包括加拿大、美国、意大利、泰国、中国等多个国家。我们与正规宠物运输公司及持证随行保姆合作，始终将幼猫福祉放在首位——在条件允许时优先推荐本地领养，以减少旅途压力。 |
| `shipping.m1.title` | Vancouver BC Delivery | 大温哥华地区送达 |
| `shipping.m1.area` | Service area: Richmond, Burnaby, Coquitlam, Surrey, White Rock, Langley, Maple Ridge | 服务范围：列治文、本拿比、高贵林、素里、白石镇、兰里、枫树岭 |
| `shipping.m1.body` | Free home delivery or in-person pickup at our cattery. | 提供免费上门送达，或可至猫舍自行取猫。 |
| `shipping.m2.title` | Vancouver Island BC Delivery | 温哥华岛送达 |
| `shipping.m2.opt1Label` | Option 1: Terminal pickup | 方案一：渡轮码头交接 |
| `shipping.m2.opt1Body` | Meet at Victoria Swartz Bay, Nanaimo Departure Bay, or an agreed terminal. Fee: ~$80–$100. | 在维多利亚 Swartz Bay、奈纳摩 Departure Bay 或约定码头交接。费用约 $80–$100。 |
| `shipping.m2.opt2Label` | Option 2: Home delivery | 方案二：上门送达 |
| `shipping.m2.opt2Body` | Direct doorstep delivery via BC Ferries. Fee: ~$200. | 搭乘 BC Ferries 直接送至府上。费用约 $200。 |
| `shipping.m3.title` | Domestic Canada Delivery | 加拿大国内运送 |
| `shipping.m3.body` | Cargo shipment via WestJet Cargo or similar service. Kittens travel in specialized kennels and are picked up at the designated cargo warehouse. Shipping fees are determined by the cargo company. | 通过 WestJet Cargo 等货运公司托运。幼猫将在专用航空笼中运输，到达后于指定货运仓库提取。运费由货运公司报价。 |
| `shipping.m4.title` | International Delivery | 国际运送 |
| `shipping.m4.body` | We partner with reputable transport companies and offer optional flight nanny services. You may choose our arranged transport or your preferred provider. | 我们与信誉良好的宠物运输公司合作，并提供随行保姆服务。您可选择由我们安排运输，或指定您信任的服务商。 |
| `shipping.m4.feeNote` | Shipping fee estimates are available on the Pet Pros Services Facebook page. | 费用估算请参考 Pet Pros Services Facebook 页面。 |

共 15 個 key。

## Visual Design

### Layout

```
<section.shipping>
  <header.shipping-hero>       ← h1 + intro，置中，淺米色背景
  <div.shipping-methods>       ← 4 張卡片，max-width 880px 置中
    <div.method-card> × 4      ← 每張卡片
      <span.method-number>     ← "#1" – "#4"，大號灰色 accent
      <h2.method-title>
      <div.method-body>        ← 說明文字 / sub-options list
```

### CSS 重點

- 背景：`var(--color-bg)`（淺米色）
- 卡片背景：`var(--color-band-soft)`
- 上方 padding：`clamp(140px, 16vw, 220px)` 避開固定 Nav
- `method-number`：`font-size: clamp(48px, 6vw, 80px)`，`color: rgba(83, 86, 92, 0.15)`，絕對定位左上角作為 watermark
- 卡片間距：`gap: clamp(20px, 2.4vw, 28px)`
- RWD：單欄，手機端 padding 由 `clamp` 自動縮放

### Vancouver Island 子選項

Method 2 的兩個 sub-option 用帶 label 的 `<dl>` 或 `<div class="sub-option">` 呈現，label 加粗，內文縮排。

## Testing

- `src/i18n/shipping.test.ts`：Vitest 測試所有 15 個 key 在 en / zh 中均存在且非空
- `astro check`：0 errors
- `npm run build`：`dist/en/shipping/index.html` 與 `dist/zh/shipping/index.html` 存在

## Out of Scope

- Contact section（全站 Footer 已涵蓋）
- 費用計算器或互動元素
- 圖片（原站無圖）
