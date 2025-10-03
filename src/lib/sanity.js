import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'nhqqp3l1',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-10-03',
});

export async function getBlips() {
  const blips = await client.fetch('*[_type == "blip"] {_id, _createdAt, body}')
  return blips
}
