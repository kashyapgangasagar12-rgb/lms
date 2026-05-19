/**
 * Extracts the YouTube video ID from various URL formats and returns the embed URL.
 * Handles standard watch links, shortened youtu.be links, and existing embed links.
 */
export function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    
    // Regular expression to extract the 11-character video ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
        const videoId = match[2];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Fallback: if not matching any YouTube pattern, return as is (e.g. if it's already a different embeddable link)
    return url;
}
