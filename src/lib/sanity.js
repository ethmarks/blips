import { createClient } from '@sanity/client';
import { sampleBlips } from './sampleBlips'

export const sanityClient = createClient({
  projectId: 'nhqqp3l1',
  dataset: 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2025-10-03',
});

export async function getBlips(sample=false, page=1, pageSize=10) {
  if (sample) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        const allBlips = JSON.parse(sampleBlips).result;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedBlips = allBlips.slice(startIndex, endIndex);
        resolve({
          blips: paginatedBlips,
          totalCount: allBlips.length,
          hasMore: endIndex < allBlips.length,
          currentPage: page,
          totalPages: Math.ceil(allBlips.length / pageSize)
        });
      }, 300);
    });
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const totalCount = await sanityClient.fetch('count(*[_type == "blip"])');

  const blips = await sanityClient.fetch(
    `*[_type == "blip"] | order(_createdAt desc) [${startIndex}...${endIndex}] {_id, _createdAt, content}`
  );

  return {
    blips,
    totalCount,
    hasMore: endIndex < totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize)
  };
}
