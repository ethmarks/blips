import {defineField, defineType} from 'sanity'

export const blip = defineType({
  name: 'blip',
  title: 'Blip',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      type: 'text',
    }),
  ],
})
