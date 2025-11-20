/**
 * Automatically adds target="_blank" and rel="noopener" to external links.
 * Links are considered external if they don't point to ethmarks.github.io domain.
 * Uses regex-based string manipulation for SSR compatibility.
 */

/**
 * Post-processor function that can be chained after marked processing
 * @param {string} html - HTML output from marked
 * @returns {string} - HTML with external links modified to open in new tabs
 */
export function postProcessExternalLinks(html) {
    const siteUrl = 'ethmarks.github.io';
    
    // Match all <a> tags with href attributes
    const linkRegex = /<a\s+([^>]*href=["']([^"']*)["'][^>]*)>/gi;
    
    return html.replace(linkRegex, (match, attributes, href) => {
        // Skip if href is empty or null
        if (!href) return match;
        
        // Skip internal links (relative URLs, fragments, mailto, tel, etc.)
        if (href.startsWith('#') || 
            href.startsWith('/') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            !href.includes('://')) {
            return match;
        }
        
        // Check if the link already has target="_blank"
        if (attributes.includes('target=')) {
            return match;
        }
        
        // Check if the link points to the same domain
        try {
            const url = new URL(href);
            const hostname = url.hostname;
            
            // If it's not our domain, make it external
            if (!hostname.includes(siteUrl)) {
                // Add target and rel attributes
                return `<a ${attributes} target="_blank" rel="noopener">`;
            }
        } catch (e) {
            // If URL parsing fails, treat as external for safety
            return `<a ${attributes} target="_blank" rel="noopener">`;
        }
        
        // Internal link, return unchanged
        return match;
    });
}