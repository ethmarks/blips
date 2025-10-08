/**
 * Automatically adds target="_blank" and rel="noopener" to external links.
 * Links are considered external if they don't point to ethmarks.github.io domain.
 */

/**
 * Post-processor function that can be chained after marked processing
 * @param {string} html - HTML output from marked
 * @returns {string} - HTML with external links modified to open in new tabs
 */
export function postProcessExternalLinks(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const links = tempDiv.querySelectorAll('a[href]');
    const siteUrl = 'ethmarks.github.io';
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip if href is empty or null
        if (!href) return;
        
        // Skip internal links (relative URLs, fragments, mailto, tel, etc.)
        if (href.startsWith('#') || 
            href.startsWith('/') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            !href.includes('://')) {
            return;
        }
        
        // Check if the link points to the same domain
        try {
            const url = new URL(href);
            const hostname = url.hostname;
            
            // If it's not our domain, make it external
            if (!hostname.includes(siteUrl)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener');
            }
        } catch (e) {
            // If URL parsing fails, treat as external for safety
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
        }
    });
    
    return tempDiv.innerHTML;
}