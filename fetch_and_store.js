// fetch_and_store.js - Fetch all Pokémon data once and store locally
import fs from "fs/promises";
import path from "path";

const POKEAPI = "https://pokeapi.co/api/v2";
const TOTAL_POKEMON = 1025;
const CONCURRENCY = 30;

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.json();
}

async function fetchInBatches(items, fn, concurrency = CONCURRENCY) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchRes = await Promise.allSettled(batch.map(fn));
    for (const r of batchRes) {
      if (r.status === "fulfilled") results.push(r.value);
      else console.warn("Batch error:", r.reason);
    }
  }
  return results;
}

async function main() {
  const ids = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);
  const data = await fetchInBatches(ids, async (id) => {
    const [pokemon, species] = await Promise.all([
      fetchJson(`${POKEAPI}/pokemon/${id}`),
      fetchJson(`${POKEAPI}/pokemon-species/${id}`),
    ]);
    return { id, pokemon, species };
  });

  const outDir = path.resolve("data");
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "pokemon_data.json");
  await fs.writeFile(outPath, JSON.stringify(data, null, 2));
  console.log(`Wrote ${data.length} Pokémon entries to ${outPath}`);
}

main().catch((e) => {
  console.error("Fetch failed:", e);
  process.exit(1);
});
