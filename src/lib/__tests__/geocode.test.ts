import { describe, it, expect, vi, afterEach } from 'vitest';
import { geocode } from '../geocode';

function mockFetch(impl: () => Promise<Partial<Response>>) {
  vi.stubGlobal('fetch', vi.fn(impl) as unknown as typeof fetch);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('geocode', () => {
  it('returns null for an empty query without calling the network', async () => {
    const spy = vi.fn();
    vi.stubGlobal('fetch', spy as unknown as typeof fetch);
    expect(await geocode('   ')).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('parses lat/lon from the first Nominatim result', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => [{ lat: '34.0151', lon: '71.5249' }],
    }));
    const point = await geocode('Peshawar, Pakistan');
    expect(point).toEqual({ lat: 34.0151, lng: 71.5249 });
  });

  it('biases the query to Pakistan (countrycodes=pk)', async () => {
    const spy = vi.fn(async (..._args: unknown[]) => ({ ok: true, json: async () => [{ lat: '0', lon: '0' }] }));
    vi.stubGlobal('fetch', spy as unknown as typeof fetch);
    await geocode('Lahore');
    const calledUrl = String(spy.mock.calls[0]?.[0]);
    expect(calledUrl).toContain('countrycodes=pk');
    expect(calledUrl).toContain('Lahore');
  });

  it('returns null on an empty result set', async () => {
    mockFetch(async () => ({ ok: true, json: async () => [] }));
    expect(await geocode('Nowhere-xyz')).toBeNull();
  });

  it('returns null on a non-ok response', async () => {
    mockFetch(async () => ({ ok: false, json: async () => [] }));
    expect(await geocode('Karachi')).toBeNull();
  });

  it('fails safe (null) when fetch throws', async () => {
    mockFetch(async () => {
      throw new Error('network down');
    });
    expect(await geocode('Karachi')).toBeNull();
  });
});
