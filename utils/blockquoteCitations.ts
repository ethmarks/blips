/**
 * Automatically adds <cite> tags to blockquotes by parsing citation patterns.
 * Replicates Hugo partial logic for extracting citations from blockquote text.
 * Uses regex-based string manipulation for SSR compatibility.
 */

export default function postProcessCitations(html: string) {
  const dashPatterns = ["~ "];
  const citationLengthLimit = 2048;

  // Match blockquote tags and their content
  const blockquoteRegex = /<blockquote>([\s\S]*?)<\/blockquote>/g;

  return html.replace(blockquoteRegex, (match, content) => {
    let modifiedContent = content;
    let cite = "";

    // Try each dash pattern to find a citation
    for (const dashPattern of dashPatterns) {
      if (!cite && content.includes(dashPattern)) {
        const parts = content.split(dashPattern);

        if (parts.length > 1) {
          let lastPart = parts[parts.length - 1];

          // Remove closing </p> tag if present
          lastPart = lastPart.replace(/<\/p>\s*$/, "");

          // Trim whitespace
          lastPart = lastPart.trim();

          // Check if this looks like a valid citation
          if (lastPart && lastPart.length < citationLengthLimit) {
            cite = lastPart;

            // Rebuild content without the citation
            const contentParts = parts.slice(0, -1);
            modifiedContent = contentParts.join(dashPattern);

            // Ensure content ends with </p> if it doesn't already
            if (!modifiedContent.trim().endsWith("</p>")) {
              modifiedContent = modifiedContent + "</p>";
            }

            break;
          }
        }
      }
    }

    // If we found a citation, rebuild the blockquote
    if (cite) {
      return `<blockquote>${modifiedContent}\n<cite>${cite}</cite></blockquote>`;
    }

    return match;
  });
}
