import { marked } from "marked";
import { getBlips } from "../../lib/sanity.js";

/**
 * Strip markdown syntax from text to get plain text
 * @param {string} text
 * @returns {string}
 */
function stripMarkdown(text) {
  if (!text) return "";
  return (
    text
      // Remove images ![alt](url)
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      // Remove links [text](url) - keep the text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove bold **text** or __text__
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      // Remove italic *text* or _text_
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // Remove strikethrough ~~text~~
      .replace(/~~(.*?)~~/g, "$1")
      // Remove inline code `code`
      .replace(/`([^`]+)`/g, "$1")
      // Remove headings # ## ### etc
      .replace(/^#{1,6}\s+/gm, "")
      // Remove blockquotes >
      .replace(/^>\s+/gm, "")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, "")
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, "")
      .replace(/^[\s]*\d+\.\s+/gm, "")
      // Remove URLs surrounded by <>
      .replace(/<https?:\/\/[^>\s]+>/gi, "")
      // Collapse multiple spaces/newlines
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Generate a title from content using the first sentence, max 60 chars
 * Matches the Sanity schema preview behavior, but with markdown stripped
 * @param {string} content
 * @returns {string}
 */
function generateTitle(content) {
  if (!content) return "Empty";
  const plainText = stripMarkdown(content);
  const firstSentence = plainText.split(/[.!?]/)[0];
  return firstSentence.length > 60
    ? firstSentence.substring(0, 60) + "..."
    : firstSentence;
}

const URL =
  process.env.PROD_URL ||
  process.env.SITE_URL ||
  "https://ethmarks.github.io/blips/";
const SITE_TITLE = "Blips";
const SITE_DESCRIPTION =
  "Ethan-flavoured Tumblr. Short-form blog posts about what I'm up to or random interesting things.";

/**
 * Escape special XML characters
 * @param {string} text
 * @returns {string}
 */
function escapeXml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate RSS XML from blips
 * @param {Array} blips
 * @returns {Promise<string>}
 */
async function generateRss(blips) {
  const items = await Promise.all(
    blips.map(async (blip) => {
      const pubDate = new Date(blip._createdAt).toUTCString();
      const link = `${URL}#${blip._id}`;
      const title = generateTitle(blip.content);
      // Convert markdown to HTML
      const htmlContent = await marked(blip.content);

      return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(blip._id)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${htmlContent}]]></description>
    </item>`;
    }),
  );

  const itemsStr = items.join("");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${URL}rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${itemsStr}
  </channel>
</rss>`;
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const data = await getBlips(1, 50);
    const rss = await generateRss(data.blips);

    return new Response(rss, {
      headers: {
        "Content-Type": "application/rss+xml",
        "Cache-Control": "max-age=0, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("Failed to generate RSS feed:", err);
    return new Response("Failed to generate RSS feed", { status: 500 });
  }
}

export const prerender = true;
