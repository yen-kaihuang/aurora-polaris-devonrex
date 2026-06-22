import {defineField, defineType} from 'sanity'

export const availableKitten = defineType({
  name: 'availableKitten',
  title: '待售幼貓',
  type: 'document',
  fields: [
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
      title: '照片',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (r) => r.required().min(1).max(8),
    }),
    defineField({
      name: 'gender',
      title: '性別',
      type: 'string',
      options: {
        list: [
          {title: 'Male', value: 'male'},
          {title: 'Female', value: 'female'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'color', title: '毛色', type: 'string'}),
    defineField({name: 'birthday', title: '生日', type: 'date'}),
    defineField({
      name: 'status',
      title: '狀態',
      type: 'string',
      options: {
        list: [
          {title: 'Available（可預約）', value: 'available'},
          {title: 'Reserved（已預訂）', value: 'reserved'},
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (r) => r.required(),
    }),
    defineField({name: 'introEn', title: '介紹（英）', type: 'text', rows: 4}),
    defineField({name: 'introZh', title: '介紹（简体中文）', type: 'text', rows: 4}),
    defineField({
      name: 'parents',
      title: '父母（選用，關聯到種貓）',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'breedingCat'}]}],
      validation: (r) => r.max(2),
    }),
  ],
  preview: {
    select: {title: 'nameEn', subtitle: 'status', media: 'photos.0'},
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle === 'available' ? '✅ Available' : '🔒 Reserved',
        media,
      }
    },
  },
})
