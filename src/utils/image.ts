import { imageConfig } from "@/config/images";

/**
 * Resolves an image path to a full URL, combining it with a configured CDN or base asset path prefix.
 * This allows all images to be redirected to an external CDN later by simply changing the `baseUrl` in config.
 * 
 * @param path - The image asset path (e.g., "/images/luxury-hero.png" or "http://some-site.com/image.jpg")
 * @returns The resolved image URL string
 */
export function getImageUrl(path: string): string {
  if (!path) return "";

  // If path is already a fully qualified absolute URL, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = imageConfig.baseUrl || "";
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  // If baseUrl is specified, prefix it, otherwise return as a root relative path
  return cleanBaseUrl ? `${cleanBaseUrl}/${cleanPath}` : `/${cleanPath}`;
}
