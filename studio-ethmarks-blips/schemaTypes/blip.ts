import { defineField, defineType } from 'sanity';

export const blip = defineType({
  name: 'blip',
  title: 'Blip',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      type: 'markdown',
      title: 'Content'
    }),
  ],
  preview: {
    select: {
       content: 'content'
    },
    prepare(selection) {
      const { content } = selection;
      const firstLine = content ? content.split('\n')[0] : 'Empty';

      return {
        title: firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine,
      };
    }
  }
})
