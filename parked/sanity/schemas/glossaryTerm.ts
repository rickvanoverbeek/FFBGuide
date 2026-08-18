import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'glossaryTerm',
  title: 'Glossary Term',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      title: 'Term',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'term',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'definition',
      title: 'Definition',
      type: 'blockContent',
    }),
    defineField({
      name: 'shortDefinition',
      title: 'Short Definition',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'relatedTerms',
      title: 'Related Terms',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'glossaryTerm'}]}],
    }),
    defineField({
      name: 'relatedSettings',
      title: 'Related Settings',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'ffbSetting'}]}],
    }),
  ],
})
