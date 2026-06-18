export const languages = {
  en: 'English',
  zh: '简体中文',
} as const;

export const defaultLang = 'en';

export const htmlLang: Record<keyof typeof languages, string> = {
  en: 'en',
  zh: 'zh-Hans',
};

export const ui = {
  en: {
    // 導覽
    'nav.home': 'Home',
    'nav.kingsQueens': 'Kings & Queens',
    'nav.availableKittens': 'Available Kitten',
    'nav.aboutCattery': 'About The Cattery',
    'nav.aboutDevonRex': 'About DRX',
    'nav.litters': 'Litter',
    'nav.shipping': 'Shipping',
    'nav.adoption': 'Adoption Questionnaire',
    'nav.contact': 'Contact Us',
    'site.name': 'Aurora Polaris Devon Rex',
    'common.learnMore': 'Learn More',

    // 首頁
    'home.heroTitle': 'Aurora Polaris Devon Rex',
    'home.welcomeLabel': 'Welcome to',
    'home.welcomeTitle': 'Aurora Polaris Devon Rex',
    'home.welcomeBody': 'Thank you for visiting Aurora Polaris Devon Rex! We are a TICA, CFA, and FIFE registered cattery located in Vancouver BC, Canada.\n\nAt APDevonRex, We strive to produce the top in line quality Devon Rex in terms of health, personality, and genetic. Each of our little curly kittens are raise with unconditional love and cherished as family members. And our cats all have five-generation European bloodline and pedigree certificates.\n\nWe understand that adopting a kitten is an emotional milestone, this is why we continue to provide the expertise and support to anyone interested in the breed. We believe that your trust and confidence in us is paramount. In light of this, we have added a two-year genetic health guarantee in our contracts with appropriate accommodations if this term is not satisfied. Devon Rex processes the intelligence and sociability perfect for families with children and other cat friendly pets.',
    'home.kittensTitle': 'Take A Look At Our Available Kittens',
    'home.whyTitle': 'Why We Do This?',
    'home.whyBody': "Our journey with Devon Rex cats began memorably at a TICA cat show in 2008, where their charm immediately captivated us. To our surprise, we found a significant lack of Devon Rex breeders within Canada, with most breeders located overseas. This striking discovery spurred us to embark on an ambitious venture: the creation of our own Devon Rex breeding program. With dedication and passion, we delved deeply into the world of breeding, committed to mastering the art and upholding the highest standards of excellence. Our aspiration extends beyond merely preserving the Devon Rex breed's unique traits; we aim to expand their presence, introducing these delightful cats to more families in Canada and around the world, thus nurturing a broader admiration and affection for this extraordinary breed.",
    'home.contactTitle': 'Contact Us',
    'home.email': 'info@apdevonrex.com',
    'home.instagram': 'aurorapolarisdr',
    'home.facebook': 'aurorapolarisdrx',
    'home.wechat': 'auroradevonrex',
    'home.copyright1': 'AP Devon Rex Canadian Cattery, Vancouver, British Columbia, CA.',
    'home.copyright2': '©Copyright of AP Devon Rex Canadian Cattery',

    // 貓舍介紹
    'cattery.heroTitle': 'About Our Cattery',
    'cattery.subtitle': 'Aurora Polaris Devon Rex',
    'cattery.section1Title': 'About Our Cattery',
    'cattery.body1': "The Kings/Queens in the AP family are adopted from reputable breeders internationally and have European championship bloodlines. They have been genetically tested for genetic diseases N/N and come with a five-generation pedigree certificate (please check the Kings/Queens page for more information).\n\nOur cattery is Located in the beautiful city of Vancouver. The Kings/Queens at AP each have their own separate rooms. There are currently five separate rooms in our cattery: a room for our kings, a room for our Queens, a nursery room for pregnant female cats/birth/sitting moons, a nursery room for kittens 2-5 months old, and an quarantine room for cats/kittens that need to be isolated. All the Devons in the AP family live under 24/7 supervision while having plenty of free time everyday to socialize and play. Our Devons can also entertain themselves at our yards.\n\nWith the outbreak of the covid-19 in Canada, we are not currently participating in any cat shows because of potential health risks. We don't know how long this will last, but we are expecting to take part in cat shows in the coming year.",
    'cattery.section2Title': 'AP Devon Rex Diet',
    'cattery.body2': "The diet for Devons at AP consist of raw meat protein, freeze-dried raw meat, and canned wet food from prominent brands.\n\nCat Food (include but not limited to): Farmina, Go Full-Time Ages Cat Food, Orijen, and Acana.\n\nFreeze-dried raw meat (include but not limited to): Ziwi, Feline Natural Freeze-Dried (K9), Meow, Vital Cat Freeze-Dried, and Stella&Chewy's Freeze-Dried.\n\nCanned (include but not limited to): Royal, Tiki, Feline Natural K9, Ziwi, Farmina(N&D) and Now Meal Packs.\n\nRaw food (include but not limited to): Buddies series and 3P.\n\nHomemade cat raw diet: Raw meat purchased from Costco.",

    // Devon Rex 介紹
    'drx.heroTitle': 'About Devon Rex',
    'drx.subtitle': 'Aurora Polaris Devon Rex',
    'drx.originTitle': 'The Origin Of Devon Rex',
    'drx.originBody': 'Devon Rex is a breed of domestic cat that emerged in England during the 1960s. The breed is known for its large ears, wavy coat, and slender body. Devon Rex cats are highly sociable and playful, often described as dog-like in their loyalty and attachment to their human companions.',
    'drx.moreTitle': 'More Facts About Devon Rex',
    'drx.charTitle': 'Unique Characteristics',
    'drx.charBody': 'Devon Rex cats are often called the "clowns" of the cat world due to their mischievous and playful personality. They are known to be highly intelligent and can learn tricks much like a dog. They thrive on human interaction and love to be the center of attention.',
    'drx.feedTitle': 'Feeding Precautions',
    'drx.feedBody': 'Devon Rex cats have a fast metabolism and tend to eat more than other breeds. They should always have access to fresh water and high-quality food. Devon Rex cats are prone to HCM (Hypertrophic Cardiomyopathy), so a heart-healthy diet is important.',
    'drx.distinguishTitle': 'How to Distinguish Aurora Bloodline from European Bloodline',
    'drx.distinguishBody': 'Aurora Polaris Devon Rex cats carry five-generation European pedigree certificates. Our breeding lines focus on health, temperament, and genetic diversity. All cats are tested N/N for common genetic diseases before entering our breeding program.',
    'drx.shedTitle': 'Common Shedding Disease',
    'drx.shedBody': 'Devon Rex cats can be prone to Hereditary Myopathy (HM), also known as Devon Rex Myopathy or Spasticity. This condition affects muscle function and can cause muscle weakness. Responsible breeders test for this condition to ensure healthy offspring.',

    // 種貓
    'kq.title': 'Kings & Queens',
    'kq.introTitle': 'Introducing Our Kings & Queens',
    'kq.intro': 'We take great pride in introducing you to our exquisite Devon Rexes, meticulously chosen to be a vital part of our esteemed breeding program, aimed at producing adorable and extraordinary kittens. Our Kings/Queens are from reputable breeders around the world. They all have five-generation bloodline, pedigree certificates, and passed the following genetic disease testing (FELV, FIV, HCM, CMS, etc.).',
    'kq.ourKings': 'Our Kings',
    'kq.ourQueens': 'Our Queens',
    'kq.labelColor': 'Color',
    'kq.labelBlood': 'Blood Type',
    'kq.comingSoon': 'King and Queen profiles are managed in our admin system. Please check back soon.',

    // 可售幼貓
    'kittens.title': 'Available Kittens',
    'kittens.tagline': 'No kittens available at this time — follow us to be the first to know!',
    'kittens.body': 'We prioritize waitlist families for the reservation of our kittens. Should there be any remaining kittens after the waitlist families have made their selections, we will open them up for reservation to the general public. At the moment, all our kittens have been reserved, and we do not have any available for reservation. We encourage you to stay updated with our latest announcements and future availability by following our social media channels on Instagram, Facebook, Twitter, or WeChat. Thank you for your interest in our kittens, and we look forward to connecting with you through our social media platforms.',

    // 胎次
    'litters.indexTitle': 'Our Graduate Babies',
    'litters.viewLitter': 'View Litter',
    'litters.2022title': '2022 Litter',
    'litters.2023title': '2023 Litter',
    'litters.2024title': '2024 Litter',
    'litters.2025title': '2025 Litter',
    'litters.comingSoon': 'Content coming soon.',
    'litters.litterOf': 'Our {year} Litter',
    'litters.kColor': 'Color',
    'litters.kSex': 'Sex',
    'litters.kBorn': 'Born',
    'litters.kStatus': 'Status',
    'litters.kBlood': 'Blood Type',
    'litters.kLocation': 'Location',
  },
  zh: {
    // 導覽
    'nav.home': '首页',
    'nav.kingsQueens': '种猫',
    'nav.availableKittens': '待售幼猫',
    'nav.aboutCattery': '关于猫舍',
    'nav.aboutDevonRex': '关于德文猫',
    'nav.litters': '历年胎次',
    'nav.shipping': '运送',
    'nav.adoption': '领养问卷',
    'nav.contact': '联系我们',
    'site.name': 'Aurora Polaris Devon Rex',
    'common.learnMore': '了解更多',

    // 首頁
    'home.heroTitle': 'Aurora Polaris Devon Rex',
    'home.welcomeLabel': '欢迎来到',
    'home.welcomeTitle': 'Aurora Polaris Devon Rex',
    'home.welcomeBody': '感谢您访问 Aurora Polaris Devon Rex！我们是一家位于加拿大不列颠哥伦比亚省温哥华的 TICA、CFA 和 FIFE 注册猫舍。\n\n在 APDevonRex，我们致力于在健康、个性和基因方面培育顶级德文卷毛猫。我们的每一只小卷毛猫都在无条件的爱中成长，被视为家庭成员。我们所有的猫都拥有五代欧洲血统和血统证书。\n\n我们了解领养一只小猫是一个重要的情感时刻，这就是为什么我们继续为任何对该品种感兴趣的人提供专业知识和支持。我们认为您对我们的信任和信心是最重要的。为此，我们在合同中加入了两年遗传健康保障，并提供适当的保障措施。德文卷毛猫具有完美适合有儿童和其他友好宠物家庭的智慧和社交性。',
    'home.kittensTitle': '查看我们的待售幼猫',
    'home.whyTitle': '我们为什么这样做？',
    'home.whyBody': '我们与德文卷毛猫的旅程始于 2008 年在 TICA 猫展上的难忘相遇，它们的魅力立刻令我们着迷。令我们惊讶的是，加拿大境内的德文卷毛猫育种者极为稀少，大多数育种者都在海外。这一发现促使我们踏上一段雄心勃勃的旅程：建立我们自己的德文卷毛猫育种计划。带着奉献与热情，我们深入钻研育种世界，致力于掌握这门艺术并坚守最高标准。我们的愿望不仅仅是保护德文卷毛猫的独特特质，更希望扩大它们的存在，将这些迷人的猫咪带给加拿大和世界各地更多的家庭，从而培养对这一非凡品种更广泛的欣赏与热爱。',
    'home.contactTitle': '联系我们',
    'home.email': 'info@apdevonrex.com',
    'home.instagram': 'aurorapolarisdr',
    'home.facebook': 'aurorapolarisdrx',
    'home.wechat': 'auroradevonrex',
    'home.copyright1': 'AP Devon Rex Canadian Cattery, Vancouver, British Columbia, CA.',
    'home.copyright2': '©Copyright of AP Devon Rex Canadian Cattery',

    // 貓舍介紹
    'cattery.heroTitle': '关于我们的猫舍',
    'cattery.subtitle': 'Aurora Polaris Devon Rex',
    'cattery.section1Title': '关于我们的猫舍',
    'cattery.body1': 'AP 家族的种猫均来自国际知名育种者，拥有欧洲冠军血统。它们均已通过 N/N 遗传病基因检测，并附有五代血统证书（详情请参阅种猫页面）。\n\n我们的猫舍位于美丽的温哥华市。AP 每只种猫都有独立的房间。目前猫舍共有五个独立房间：公猫室、母猫室、孕猫/月子/育儿室、2-5 个月幼猫室，以及需要隔离的猫只隔离室。AP 家族的所有德文猫在 24 小时全天候照看下生活，每天享有充足的社交和玩耍时间，还可以在院子里自在活动。\n\n由于加拿大新冠疫情的爆发，我们目前因潜在的健康风险暂停参加任何猫展。我们不确定这种情况将持续多久，但预计将在未来一年重新参与猫展活动。',
    'cattery.section2Title': 'AP 德文猫饮食',
    'cattery.body2': "AP 的德文猫饮食由生肉蛋白质、冻干生肉和知名品牌罐头湿粮组成。\n\n猫粮（包括但不限于）：Farmina、Go Full-Time 全阶段猫粮、Orijen、Acana。\n\n冻干生肉（包括但不限于）：Ziwi、Feline Natural 冻干（K9）、Meow、Vital Cat 冻干、Stella&Chewy's 冻干。\n\n罐头（包括但不限于）：Royal、Tiki、Feline Natural K9、Ziwi、Farmina（N&D）、Now Meal Packs。\n\n生食（包括但不限于）：Buddies 系列、3P。\n\n自制猫生食：Costco 购买的生肉。",

    // Devon Rex 介紹
    'drx.heroTitle': '关于德文卷毛猫',
    'drx.subtitle': 'Aurora Polaris Devon Rex',
    'drx.originTitle': '德文卷毛猫的起源',
    'drx.originBody': '德文卷毛猫是一种家猫品种，于 1960 年代在英国出现。该品种以其大耳朵、波浪形被毛和纤细的体型而闻名。德文卷毛猫极具社交性和玩耍性，常被描述为像狗一样忠诚地依恋其人类伴侣。',
    'drx.moreTitle': '更多关于德文卷毛猫的信息',
    'drx.charTitle': '独特特征',
    'drx.charBody': '德文卷毛猫因其顽皮和爱玩的个性，常被称为猫界的"小丑"。它们以高度智慧著称，能像狗一样学习技巧。它们喜欢与人互动，乐于成为关注的焦点。',
    'drx.feedTitle': '喂养注意事项',
    'drx.feedBody': '德文卷毛猫的新陈代谢较快，食量通常比其他品种大。它们应始终能获取新鲜饮水和优质食物。德文卷毛猫容易患上心肌肥大症（HCM），因此保持心脏健康的饮食非常重要。',
    'drx.distinguishTitle': '如何区分 Aurora 血统与欧洲血统',
    'drx.distinguishBody': 'Aurora Polaris 德文卷毛猫持有五代欧洲血统证书。我们的育种方向专注于健康、性格和基因多样性。所有进入育种计划的猫只均经过常见遗传病 N/N 检测。',
    'drx.shedTitle': '常见遗传疾病',
    'drx.shedBody': '德文卷毛猫可能患有遗传性肌病（HM），也称为德文卷毛猫肌病或痉挛症。这种疾病影响肌肉功能，可导致肌肉无力。负责任的育种者会对此进行检测，以确保后代健康。',

    // 種貓
    'kq.title': '种猫',
    'kq.introTitle': '介绍我们的种猫',
    'kq.intro': '我们非常自豪地向您介绍我们出色的德文卷毛猫。它们经过精心挑选，是我们备受推崇的育种计划的重要组成部分，旨在培育可爱而非凡的小猫。我们的种猫均来自世界各地的知名育种者，全部拥有五代血统、血统证书，并通过了以下遗传病检测（FELV、FIV、HCM、CMS 等）。',
    'kq.ourKings': '我们的公猫',
    'kq.ourQueens': '我们的母猫',
    'kq.labelColor': '毛色',
    'kq.labelBlood': '血型',
    'kq.comingSoon': '种猫资料由后台系统管理，敬请期待。',

    // 可售幼貓
    'kittens.title': '待售幼猫',
    'kittens.tagline': '目前暫無幼貓可預約，歡迎追蹤我們第一時間掌握消息！',
    'kittens.body': '我们优先为等候名单上的家庭预约幼猫。若等候家庭完成选择后仍有剩余幼猫，我们将向公众开放预约。目前所有幼猫均已被预约，暂无可供预约的幼猫。欢迎关注我们的 Instagram、Facebook、Twitter 或微信，及时获取最新公告和未来幼猫供应信息。感谢您对我们幼猫的关注，期待在社交媒体上与您互动。',

    // 胎次
    'litters.indexTitle': '我们的毕业宝宝',
    'litters.viewLitter': '查看胎次',
    'litters.2022title': '2022 胎次',
    'litters.2023title': '2023 胎次',
    'litters.2024title': '2024 胎次',
    'litters.2025title': '2025 胎次',
    'litters.comingSoon': '内容整理中，敬请期待。',
    'litters.litterOf': '{year} 年胎次',
    'litters.kColor': '毛色',
    'litters.kSex': '性别',
    'litters.kBorn': '出生',
    'litters.kStatus': '状态',
    'litters.kBlood': '血型',
    'litters.kLocation': '所在地',
  },
} as const;

export type Lang = keyof typeof ui;
export type UiKey = keyof (typeof ui)['en'];
