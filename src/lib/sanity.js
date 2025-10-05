import { createClient } from '@sanity/client';
import { sampleBlips } from './sampleBlips'

export const sanityClient = createClient({
  projectId: 'nhqqp3l1',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-10-03',
});

export async function getBlips(sample=false) {
  if (sample) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(JSON.parse(sampleBlips).result);
      }, 300);
    });
  }

  const blips = await sanityClient.fetch('*[_type == "blip"] | order(_createdAt desc) {_id, _createdAt, content}')
  return blips
}
