export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * Geocode a free-text location to coordinates via OpenStreetMap Nominatim.
 * Free, no API key. Biased to Pakistan. Returns null on failure (fail-safe).
 * Note: Nominatim asks for ≤1 req/sec — fine for form submissions.
 */
export async function geocode(query: string): Promise<GeoPoint | null> {
  const q = query.trim();
  if (!q) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pk&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = (await res.json()) as { lat: string; lon: string }[];
    if (!data.length) return null;
    return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
  } catch {
    return null;
  }
}

/**
 * Reverse-geocode coordinates to a city/town name via Nominatim.
 * Used by "Use my location" buttons. Returns null on failure (fail-safe).
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: { city?: string; town?: string; village?: string; county?: string; state_district?: string };
    };
    const a = data.address ?? {};
    return a.city ?? a.town ?? a.village ?? a.county ?? a.state_district ?? null;
  } catch {
    return null;
  }
}
