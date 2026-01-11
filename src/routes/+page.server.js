import { error } from "@sveltejs/kit";
import { getBlips } from "../lib/sanity.js";
import { marked } from "marked";
import { postProcessCitations } from "$lib/blockquoteCitations.js";

function renderMarkdown(markdown) {
  let html = marked(markdown || "");
  html = postProcessCitations(html);
  return html;
}

export async function load() {
  try {
    const data = await getBlips();

    // Render markdown server-side
    const blipsWithRenderedContent = data.blips.map((blip) => ({
      ...blip,
      renderedContent: renderMarkdown(blip.content),
    }));

    return {
      blips: blipsWithRenderedContent,
      allBlipsShown: data.allBlipsShown,
    };
  } catch (err) {
    throw error(500, `Failed to load blips: ${err.message}`);
  }
}
