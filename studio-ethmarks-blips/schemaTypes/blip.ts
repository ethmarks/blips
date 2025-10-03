import {defineField, defineType} from 'sanity'

export const blip = defineType({
  name: 'blip',
  title: 'Blip',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})
