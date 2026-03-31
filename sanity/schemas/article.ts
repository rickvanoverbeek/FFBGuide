import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Fundamentals', value: 'Fundamentals'},
          {title: 'Advanced', value: 'Advanced'},
          {title: 'Troubleshooting', value: 'Troubleshooting'},
          {title: 'How-To', value: 'How-To'},
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'relatedVendors',
      title: 'Related Vendors',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'vendor'}]}],
    }),
    defineField({
      name: 'relatedGames',
      title: 'Related Games',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'game'}]}],
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
})
