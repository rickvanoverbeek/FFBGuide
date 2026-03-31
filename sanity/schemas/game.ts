import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'game',
  title: 'Game',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'platforms',
      title: 'Platforms',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'PC', value: 'PC'},
          {title: 'PlayStation', value: 'PlayStation'},
          {title: 'Xbox', value: 'Xbox'},
        ],
      },
    }),
    defineField({
      name: 'ffbImplementation',
      title: 'How This Game Generates FFB',
      type: 'blockContent',
    }),
    defineField({
      name: 'inGameSettings',
      title: 'In-Game Settings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'setting',
              title: 'Setting',
              type: 'reference',
              to: [{type: 'ffbSetting'}],
            }),
            defineField({
              name: 'gameSpecificName',
              title: 'Name as shown in-game',
              type: 'string',
            }),
            defineField({
              name: 'explanation',
              title: 'Explanation',
              type: 'blockContent',
            }),
            defineField({
              name: 'defaultValue',
              title: 'Default Value',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'tips',
      title: 'Tips',
      type: 'blockContent',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    }),
  ],
})
