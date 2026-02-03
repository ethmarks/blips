import { render } from "gfm";
import postProcessCitations from "./blockquoteCitations.ts";

/**
 * Renders markdown to HTML and applies post-processing transformations.
 * This function is shared between the main page and RSS feed generation.
 */
export function renderMarkdown(markdown: string): string {
  let html = render(markdown);
  html = postProcessCitations(html);
  return html;
}
