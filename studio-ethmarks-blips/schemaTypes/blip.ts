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
      const firstSentence = content ? content.split(/[.!?]/)[0] : 'Empty';

      return {
        title: firstSentence.length > 60 ? firstSentence.substring(0, 60) + '...' : firstSentence,
      };
    }
  }
})
