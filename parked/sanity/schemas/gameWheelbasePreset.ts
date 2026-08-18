import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'gameWheelbasePreset',
  title: 'Game Wheelbase Preset',
  type: 'document',
  fields: [
    defineField({
      name: 'game',
      title: 'Game',
      type: 'reference',
      to: [{type: 'game'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'wheelbase',
      title: 'Wheelbase',
      type: 'reference',
      to: [{type: 'wheelbase'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'vendorSoftwareSettings',
      title: 'Vendor Software Settings',
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
              name: 'value',
              title: 'Value',
              type: 'string',
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              type: 'text',
            }),
          ],
        },
      ],
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
              name: 'value',
              title: 'Value',
              type: 'string',
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              type: 'text',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'overallNotes',
      title: 'Overall Notes',
      type: 'blockContent',
    }),
    defineField({
      name: 'difficultyLevel',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'Beginner'},
          {title: 'Intermediate', value: 'Intermediate'},
          {title: 'Advanced', value: 'Advanced'},
        ],
      },
    }),
    defineField({
      name: 'lastVerified',
      title: 'Last Verified',
      type: 'date',
    }),
  ],
  preview: {
    select: {
      gameName: 'game.name',
      wheelbaseName: 'wheelbase.name',
    },
    prepare({gameName, wheelbaseName}) {
      return {
        title: `${gameName || 'Unknown Game'} + ${wheelbaseName || 'Unknown Wheelbase'}`,
      }
    },
  },
})
