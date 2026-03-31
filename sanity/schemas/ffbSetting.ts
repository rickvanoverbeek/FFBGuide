import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'ffbSetting',
  title: 'FFB Setting',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Vendor Software', value: 'vendor-software'},
          {title: 'In-Game', value: 'in-game'},
          {title: 'Universal', value: 'universal'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'valueType',
      title: 'Value Type',
      type: 'string',
      options: {
        list: [
          {title: 'Percentage', value: 'percentage'},
          {title: 'Numeric', value: 'numeric'},
          {title: 'Toggle', value: 'toggle'},
          {title: 'Enum', value: 'enum'},
        ],
      },
    }),
    defineField({
      name: 'minValue',
      title: 'Min Value',
      type: 'number',
    }),
    defineField({
      name: 'maxValue',
      title: 'Max Value',
      type: 'number',
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
    }),
    defineField({
      name: 'aliases',
      title: 'Setting Aliases',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'relatedSettings',
      title: 'Related Settings',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'ffbSetting'}]}],
    }),
  ],
})
