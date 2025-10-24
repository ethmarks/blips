/**
 * Automatically adds <cite> tags to blockquotes by parsing citation patterns.
 * Replicates Hugo partial logic for extracting citations from blockquote text.
 */

/**
 * Post-processor function that can be chained after marked processing
 * @param {string} html - HTML output from marked
 * @returns {string} - HTML with processed blockquote citations
 */
export function postProcessCitations(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const blockquotes = tempDiv.querySelectorAll('blockquote');

    blockquotes.forEach(blockquote => {
        const dashPatterns = ['~ '];
        const citationLengthLimit = 2048;

        const text = blockquote.innerHTML;
        let content = text;
        let cite = '';

        // Try each dash pattern to find a citation
        for (const dashPattern of dashPatterns) {
            if (!cite && text.includes(dashPattern)) {
                const parts = text.split(dashPattern);

                if (parts.length > 1) {
                    let lastPart = parts[parts.length - 1];

                    // Remove closing </p> tag if present
                    lastPart = lastPart.replace('</p>', '');

                    // Trim whitespace
                    lastPart = lastPart.trim();

                    // Check if this looks like a valid citation
                    if (lastPart && lastPart.length < citationLengthLimit) {
                        cite = lastPart;

                        // Rebuild content without the citation
                        const contentParts = parts.slice(0, -1);
                        content = contentParts.join(dashPattern);

                        // Ensure content ends with </p> if it doesn't already
                        if (!content.endsWith('</p>')) {
                            content = content + '</p>';
                        }

                        break;
                    }
                }
            }
        }

        // If we found a citation, rebuild the blockquote
        if (cite) {
            blockquote.innerHTML = content + `\n<cite>${cite}</cite>`;
        }
    });

    return tempDiv.innerHTML;
}
