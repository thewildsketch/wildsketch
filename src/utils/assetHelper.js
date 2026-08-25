/**
 * Resolves static asset URL based on environment configuration.
 * 
 * Local Dev: Uses relative path (e.g. /assets/animals/...)
 * Phase 1 (Vercel Blob): Uses VITE_ASSET_BASE_URL set in Vercel Dashboard
 * Phase 2 (Cloudflare Domain / R2): Update VITE_ASSET_BASE_URL to Cloudflare CDN URL
 *
 * @param {string} path - Relative asset path (e.g., '/assets/animals/cat/cover.jpg')
 * @returns {string} Fully resolved asset URL
 */
export function getAssetUrl(path) {
  if (!path) return '';
  
  // Return directly if already an absolute HTTP/HTTPS or data URL
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  const baseUrl = import.meta.env.VITE_ASSET_BASE_URL || '';
  if (!baseUrl) return path;

  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBase}${cleanPath}`;
}

/**
 * Replaces all relative /assets/ paths inside HTML string with CDN base URL if configured.
 * 
 * @param {string} html - Raw HTML content
 * @returns {string} Processed HTML with resolved CDN asset URLs
 */
export function resolveHtmlAssetUrls(html) {
  if (!html || typeof html !== 'string') return html;
  const baseUrl = import.meta.env.VITE_ASSET_BASE_URL || '';
  if (!baseUrl) return html;

  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return html.replace(/src=["'](\/assets\/[^"']+)["']/g, (_match, p1) => `src="${cleanBase}${p1}"`);
}

