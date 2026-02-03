/**
 * Strips markdown syntax from text, leaving only plain text content.
 * Useful for generating plain text titles from markdown content.
 */
export function stripMarkdown(markdown: string): string {
  let text = markdown;

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`[^`]+`/g, (match) => match.slice(1, -1));

  // Remove images: ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1");

  // Remove links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

  // Remove reference-style links: [text][ref] -> text
  text = text.replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1");

  // Remove headings
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Remove bold/italic: **text** or __text__ or *text* or _text_
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");

  // Remove strikethrough: ~~text~~
  text = text.replace(/~~(.*?)~~/g, "$1");

  // Remove blockquote markers
  text = text.replace(/^\s*>\s+/gm, "");

  // Remove horizontal rules
  text = text.replace(/^(\*{3,}|-{3,}|_{3,})$/gm, "");

  // Remove list markers (unordered and ordered)
  text = text.replace(/^\s*[\*\-\+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Normalize whitespace
  text = text.replace(/\n+/g, " ");
  text = text.replace(/\s+/g, " ");
  text = text.trim();

  return text;
}
