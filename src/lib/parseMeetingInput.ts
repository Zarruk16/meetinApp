/**
 * Extract a meeting room id from pasted links, paths, or raw codes.
 * Supports web URLs like https://host/join/{roomId} and app scheme blumenmeet://join/{roomId}
 */
export function parseMeetingIdentifier(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  try {
    if (trimmed.includes("://") || trimmed.startsWith("//")) {
      const url = new URL(trimmed.startsWith("//") ? `https:${trimmed}` : trimmed);
      const pathMatch = url.pathname.match(/\/join\/([^/]+)/i);
      if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);
      const q = url.searchParams.get("roomId") || url.searchParams.get("room");
      if (q) return decodeURIComponent(q);
    }
  } catch {
    // not a URL — fall through
  }

  const pathMatch = trimmed.match(/\/join\/([^/?#\s]+)/i);
  if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);

  const schemeMatch = trimmed.match(/blumenmeet:\/\/join\/([^/?#\s]+)/i);
  if (schemeMatch?.[1]) return decodeURIComponent(schemeMatch[1]);

  return trimmed.replace(/\s+/g, "");
}

export function isFullRoomId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
