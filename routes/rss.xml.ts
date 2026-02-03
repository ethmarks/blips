import { define } from "../utils.ts";
import { fetchBlips } from "../utils/fetchBlips.ts";
import { renderMarkdown } from "../utils/renderMarkdown.ts";
import { stripMarkdown } from "../utils/stripMarkdown.ts";

export const handler = define.handlers({
  async GET() {
    const data = await fetchBlips();

    const blipsWithRenderedContent = data.blips.map((blip) => ({
      ...blip,
      renderedContent: renderMarkdown(blip.content),
    }));
    const truncatedBlips = blipsWithRenderedContent.slice(0, 15);

    const siteUrl = "https://site-ethmarks.vercel.app/blips";
    const feedUrl = `${siteUrl}/rss.xml`;

    // Escape XML special characters
    const escapeXml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&#38;")
        .replace(/</g, "&#60;")
        .replace(/>/g, "&#62;")
        .replace(/"/g, "&#34;")
        .replace(/'/g, "&#39;");
    };

    // Generate RSS items
    const items = truncatedBlips.map((blip) => {
      const pubDate = new Date(blip._createdAt).toUTCString();
      const guid = `${siteUrl}#${blip._id}`;
      const plainText = stripMarkdown(blip.content);
      const title = plainText.substring(0, 60).trim() +
        (plainText.length > 60 ? "..." : "");

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${guid}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${blip.renderedContent}]]></description>
    </item>`;
    }).join("\n");

    const lastBuildDate = blipsWithRenderedContent.length > 0
      ? new Date(blipsWithRenderedContent[0]._createdAt).toUTCString()
      : new Date().toUTCString();

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blips</title>
    <link>${siteUrl}</link>
    <description>Ethan's microblog featuring brief thoughts, activities, and interesting discoveries. A radar ping of activity.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    });
  },
});
