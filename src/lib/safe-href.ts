/** Link rules shared by admin validation (server + client) and the public renderers. */

/** A site-relative path ("/…"), but not a protocol-relative URL ("//host", "/\host") or anything with whitespace. */
export function isInternalHref(value: string): boolean {
  return /^\/(?![/\\])/.test(value) && !/\s/.test(value);
}

/**
 * A link the public site may render: an absolute http(s) URL, or an internal path (see `isInternalHref`).
 * Anything else (javascript:, data:, mailto:, relative paths, protocol-relative URLs) is rejected.
 */
export function isSafeHref(value: string): boolean {
  if (value.startsWith("/")) return isInternalHref(value);
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !!url.hostname;
  } catch {
    return false;
  }
}
