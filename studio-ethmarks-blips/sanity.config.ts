import {defineConfig} from 'sanity'
import { markdownSchema } from 'sanity-plugin-markdown';
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'ethmarks-blips',

  projectId: 'nhqqp3l1',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), markdownSchema()],

  schema: {
    types: schemaTypes,
  },
})
