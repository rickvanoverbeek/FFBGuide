import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'vendor',
  title: 'Vendor',
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
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'softwareName',
      title: 'Control Software Name',
      type: 'string',
      description: 'e.g. "True Drive", "Fanatec Control Panel"',
    }),
    defineField({
      name: 'softwareDescription',
      title: 'Software Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'commonSettings',
      title: 'Common Settings',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'ffbSetting'}]}],
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
