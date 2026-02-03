import { createClient } from "sanity";

export const sanityClient = createClient({
  projectId: "nhqqp3l1",
  dataset: "production",
  useCdn: false,
  apiVersion: "2025-10-03",
});

export interface Blip {
  _id: string;
  _createdAt: string;
  content: string;
  renderedContent: string;
}

export interface FetchBlipsResult {
  blips: Blip[];
  allBlipsShown: boolean;
}

export async function fetchBlips(
  pageSize = 50,
): Promise<FetchBlipsResult> {
  const blips = await sanityClient.fetch<Blip[]>(
    `*[_type == "blip"] | order(_createdAt desc) [0...${pageSize}] {_id, _createdAt, content}`,
  );

  const earliestBlip = blips.at(-1);
  const originalBlipContent = "Lo and behold, for this is my first Blip.";
  const allBlipsShown = earliestBlip?.content === originalBlipContent;

  return {
    blips,
    allBlipsShown,
  };
}
