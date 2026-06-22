import {defineField, defineType} from 'sanity'

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
          {title: 'King', value: 'king'},
          {title: 'Queen', value: 'queen'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nameEn',
      title: '名字（英）',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nameZh',
      title: '名字（简体中文）',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photos',
      title: '照片（第 1 張為主圖）',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (r) => r.required().min(1).max(6),
    }),
    defineField({name: 'color', title: '毛色花紋', type: 'string'}),
    defineField({name: 'bloodline', title: '血統 / 註冊頭銜', type: 'string'}),
    defineField({name: 'birthday', title: '生日', type: 'date'}),
    defineField({name: 'introEn', title: '介紹（英）', type: 'text', rows: 4}),
    defineField({name: 'introZh', title: '介紹（简体中文）', type: 'text', rows: 4}),
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
        {field: 'role', direction: 'asc'},
        {field: 'displayOrder', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'nameEn', subtitle: 'role', media: 'photos.0'},
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle === 'king' ? '👑 King' : '👸 Queen',
        media,
      }
    },
  },
})
