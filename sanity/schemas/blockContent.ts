import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Number', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Code', value: 'code'},
          {title: 'Strike', value: 'strike-through'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
          {
            title: 'Glossary Reference',
            name: 'glossaryReference',
            type: 'object',
            fields: [
              {
                title: 'Glossary Term',
                name: 'reference',
                type: 'reference',
                to: [{type: 'glossaryTerm'}],
              },
            ],
          },
          {
            title: 'Setting Reference',
            name: 'settingReference',
            type: 'object',
            fields: [
              {
                title: 'FFB Setting',
                name: 'reference',
                type: 'reference',
                to: [{type: 'ffbSetting'}],
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineArrayMember({
      title: 'Callout',
      name: 'callout',
      type: 'object',
      fields: [
        {
          title: 'Style',
          name: 'style',
          type: 'string',
          options: {
            list: [
              {title: 'Info', value: 'info'},
              {title: 'Warning', value: 'warning'},
              {title: 'Tip', value: 'tip'},
            ],
          },
        },
        {
          title: 'Body',
          name: 'body',
          type: 'text',
        },
      ],
    }),
  ],
})
