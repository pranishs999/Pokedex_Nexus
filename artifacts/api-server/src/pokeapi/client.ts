/**
 * Low-level PokéAPI fetch client with retry and URL-keyed in-process cache.
 * All responses are cached indefinitely — PokéAPI data is static.
 */

const BASE = "https://pokeapi.co/api/v2";
const urlCache = new Map<string, any>();

export async function fetchPokeAPI(pathOrUrl: string): Promise<any> {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${BASE}/${pathOrUrl}`;
  if (urlCache.has(url)) return urlCache.get(url);

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      const data = await res.json();
      urlCache.set(url, data);
      return data;
    } catch (err: any) {
      if (err?.name === "AbortError" || attempt === 3) throw err;
      await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
    }
  }
}

export async function fetchBatch<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = 30,
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const settled = await Promise.allSettled(items.slice(i, i + concurrency).map(fn));
    for (const r of settled) {
      if (r.status === "fulfilled") out.push(r.value);
      // silently skip rejected (network blip for a single mon)
    }
  }
  return out;
}
