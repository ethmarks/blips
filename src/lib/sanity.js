import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "nhqqp3l1",
  dataset: "production",
  useCdn: false,
  apiVersion: "2025-10-03",
});

export async function getBlips(page = 1, pageSize = 50) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const totalCount = await sanityClient.fetch('count(*[_type == "blip"])');

  const blips = await sanityClient.fetch(
    `*[_type == "blip"] | order(_createdAt desc) [${startIndex}...${endIndex}] {_id, _createdAt, content}`,
  );

  return {
    blips,
    totalCount,
    hasMore: endIndex < totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
