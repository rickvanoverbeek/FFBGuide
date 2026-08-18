import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'wheelbase',
  title: 'Wheelbase',
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
      name: 'vendor',
      title: 'Vendor',
      type: 'reference',
      to: [{type: 'vendor'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'driveType',
      title: 'Drive Type',
      type: 'string',
      options: {
        list: [
          {title: 'Direct Drive', value: 'Direct Drive'},
          {title: 'Belt Drive', value: 'Belt Drive'},
          {title: 'Gear Drive', value: 'Gear Drive'},
        ],
      },
    }),
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'object',
      fields: [
        defineField({
          name: 'peakTorque',
          title: 'Peak Torque',
          type: 'string',
        }),
        defineField({
          name: 'continuousTorque',
          title: 'Continuous Torque',
          type: 'string',
        }),
        defineField({
          name: 'rotationRange',
          title: 'Rotation Range',
          type: 'string',
        }),
        defineField({
          name: 'connectivity',
          title: 'Connectivity',
          type: 'string',
        }),
        defineField({
          name: 'platformSupport',
          title: 'Platform Support',
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
      ],
    }),
    defineField({
      name: 'settingDefaults',
      title: 'Setting Defaults',
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
              name: 'recommendedValue',
              title: 'Recommended Value',
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
  ],
})
