export type Track = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverImageUrl: string | null;
  tags: string[];
  sortOrder: number;
};

export function httpsUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function siteOrigin(value: string | undefined): string {
  const valid = httpsUrl(value);
  if (!valid) return 'https://bandcampnation.com';
  const url = new URL(valid);
  return url.pathname === '/' && !url.search && !url.hash ? url.origin : 'https://bandcampnation.com';
}

export const SITE_ORIGIN = siteOrigin(process.env.EXPO_PUBLIC_SITE_URL);

export function parseTracks(payload: unknown): Track[] {
  if (!payload || typeof payload !== 'object' || !('songs' in payload) || !Array.isArray(payload.songs) || payload.songs.length > 500) {
    throw new Error('The radio service returned an unreadable catalog. Try again.');
  }
  const seen = new Set<string>();
  const tracks: Track[] = [];
  for (const item of payload.songs) {
    if (!item || typeof item !== 'object') continue;
    const audioUrl = httpsUrl(item.audioUrl);
    if (item.status !== 'published' || item.isRestricted !== false || typeof item.id !== 'string' || !item.id.trim() || item.id.length > 200 || seen.has(item.id) || typeof item.title !== 'string' || !item.title.trim() || !audioUrl) continue;
    seen.add(item.id);
    tracks.push({
      id: item.id, title: item.title.slice(0, 200),
      artist: typeof item.artist === 'string' ? item.artist.slice(0, 150) : 'BandCampNation',
      audioUrl, coverImageUrl: httpsUrl(item.coverImageUrl),
      tags: Array.isArray(item.tags) ? item.tags.filter((tag: unknown): tag is string => typeof tag === 'string').slice(0, 20) : [],
      sortOrder: typeof item.sortOrder === 'number' && Number.isFinite(item.sortOrder) ? item.sortOrder : 999,
    });
  }
  return tracks.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export async function fetchTracks(signal?: AbortSignal, request: typeof fetch = fetch): Promise<Track[]> {
  const response = await request(`${SITE_ORIGIN}/api/radio/songs`, { signal, credentials: 'omit', headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Radio is unavailable (${response.status}). Check your connection and try again.`);
  return parseTracks(await response.json());
}
