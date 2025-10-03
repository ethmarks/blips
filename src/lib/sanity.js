import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'nhqqp3l1',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-10-03',
});

export async function getBlips() {
  const blips = await sanityClient.fetch('*[_type == "blip"] | order(_createdAt desc) {_id, _createdAt, content}')
  return blips
}
