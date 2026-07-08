/**
 * PKMP Database Seed — All Generations (I–IX, #1–1025)
 *
 * Fetches data from PokéAPI at seed time. The running app uses only the
 * local PostgreSQL database after this script completes.
 *
 * Run: pnpm --filter @workspace/db run seed
 */
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  typesTable,
  abilitiesTable,
  pokemonTable,
  pokemonTypesTable,
  pokemonAbilitiesTable,
  evolutionsTable,
  formsTable,
} from "./schema/index.js";

const { Pool } = pg;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const POKEAPI = "https://pokeapi.co/api/v2";
const CONCURRENCY = 30; // parallel fetches per batch
const TOTAL_POKEMON = 1025; // Gen I–IX national dex

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878", fire: "#F08030", water: "#6890F0", grass: "#78C850",
  electric: "#F8D030", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
  ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
  rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
  steel: "#B8B8D0", fairy: "#EE99AC",
};

const ULTRA_BEASTS = new Set([793,794,795,796,797,798,799,803,804,805,806]);
const PARADOX = new Set([
  984,985,986,987,988,989,990,991,992,993,994,995,
  1005,1006,1007,1008,1009,1010,1020,1021,1022,1023,1024,1025,
]);

const GROWTH_RATE_MAP: Record<string, string> = {
  slow: "slow", "medium-slow": "medium-slow", medium: "medium",
  "medium-fast": "medium-fast", fast: "fast", erratic: "erratic",
  fluctuating: "fluctuating",
};

const FORM_REGION_MAP: Record<string, string> = {
  alola: "Alola", alolan: "Alola", galar: "Galar", galarian: "Galar",
  hisui: "Hisui", hisuian: "Hisui", paldea: "Paldea", paldean: "Paldea",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const cache = new Map<string, any>();

async function fetchJson(url: string): Promise<any> {
  if (cache.has(url)) return cache.get(url);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const data = await res.json();
      cache.set(url, data);
      return data;
    } catch (e) {
      if (attempt === 2) throw e;
      await sleep(500 * (attempt + 1));
    }
  }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function fetchInBatches<T, R>(
  items: T[], fn: (item: T) => Promise<R>, concurrency = CONCURRENCY
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    for (const r of batchResults) {
      if (r.status === "fulfilled") results.push(r.value);
      else console.warn("  ⚠ Batch error:", (r as PromiseRejectedResult).reason?.message);
    }
  }
  return results;
}

function formatName(apiName: string): string {
  const overrides: Record<string, string> = {
    "nidoran-f": "Nidoran♀", "nidoran-m": "Nidoran♂",
    "mr-mime": "Mr. Mime", "mime-jr": "Mime Jr.", "mr-rime": "Mr. Rime",
    "farfetchd": "Farfetch'd", "sirfetchd": "Sirfetch'd",
    "flabebe": "Flabébé", "type-null": "Type: Null",
    "jangmo-o": "Jangmo-o", "hakamo-o": "Hakamo-o", "kommo-o": "Kommo-o",
    "tapu-koko": "Tapu Koko", "tapu-lele": "Tapu Lele",
    "tapu-bulu": "Tapu Bulu", "tapu-fini": "Tapu Fini",
    "porygon-z": "Porygon-Z", "ho-oh": "Ho-Oh",
    "chi-yu": "Chi-Yu", "chien-pao": "Chien-Pao",
    "ting-lu": "Ting-Lu", "wo-chien": "Wo-Chien",
    "great-tusk": "Great Tusk", "scream-tail": "Scream Tail",
    "brute-bonnet": "Brute Bonnet", "flutter-mane": "Flutter Mane",
    "slither-wing": "Slither Wing", "sandy-shocks": "Sandy Shocks",
    "iron-treads": "Iron Treads", "iron-bundle": "Iron Bundle",
    "iron-hands": "Iron Hands", "iron-jugulis": "Iron Jugulis",
    "iron-moth": "Iron Moth", "iron-thorns": "Iron Thorns",
    "roaring-moon": "Roaring Moon", "iron-valiant": "Iron Valiant",
    "walking-wake": "Walking Wake", "iron-leaves": "Iron Leaves",
    "gouging-fire": "Gouging Fire", "raging-bolt": "Raging Bolt",
    "iron-boulder": "Iron Boulder", "iron-crown": "Iron Crown",
  };
  if (overrides[apiName]) return overrides[apiName];
  return apiName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function genNumber(genName: string): number {
  const map: Record<string, number> = {
    "generation-i": 1, "generation-ii": 2, "generation-iii": 3,
    "generation-iv": 4, "generation-v": 5, "generation-vi": 6,
    "generation-vii": 7, "generation-viii": 8, "generation-ix": 9,
  };
  return map[genName] ?? 1;
}

function getEnglishText(entries: any[], field = "flavor_text"): string {
  const entry = entries
    .filter((e: any) => e.language.name === "en")
    .at(-1);
  return (entry?.[field] ?? "").replace(/\f/g, " ").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

function safeGrowthRate(name: string): string {
  return GROWTH_RATE_MAP[name] ?? "medium";
}

// ─── EVOLUTION CHAIN WALKER ───────────────────────────────────────────────────

interface EvoPair {
  from: string; to: string;
  trigger: string; minLevel?: number; item?: string;
  heldItem?: string; timeOfDay?: string; friendship?: number;
  specialRequirement?: string;
}

function walkChain(node: any, pairs: EvoPair[]): void {
  for (const next of node.evolves_to ?? []) {
    const details = next.evolution_details?.[0] ?? {};
    pairs.push({
      from: node.species.name,
      to: next.species.name,
      trigger: details.trigger?.name ?? "level-up",
      minLevel: details.min_level ?? undefined,
      item: details.item?.name ?? undefined,
      heldItem: details.held_item?.name ?? undefined,
      timeOfDay: details.time_of_day || undefined,
      friendship: details.min_friendship ?? undefined,
      specialRequirement: details.known_move?.name
        ?? details.location?.name
        ?? details.min_beauty
        ?? details.min_affection
        ?? details.relative_physical_stats
        ?? undefined,
    });
    walkChain(next, pairs);
  }
}

// ─── REGIONAL / SPECIAL FORMS ─────────────────────────────────────────────────

interface FormData {
  pokemonId: number;
  name: string;
  formType: "regional" | "mega" | "gigantamax" | "alternate";
  region?: string;
  spriteUrl: string;
  artworkUrl: string;
  type1?: string;
  type2?: string;
  statHp?: number; statAttack?: number; statDefense?: number;
  statSpecialAttack?: number; statSpecialDefense?: number; statSpeed?: number;
}

async function fetchFormsForPokemon(
  dexId: number, speciesName: string, dbId: number
): Promise<FormData[]> {
  try {
    const species = await fetchJson(`${POKEAPI}/pokemon-species/${dexId}`);
    const forms: FormData[] = [];
    for (const variety of species.varieties ?? []) {
      if (variety.is_default) continue;
      const vName: string = variety.pokemon.name;
      // Determine form type
      let formType: FormData["formType"] = "alternate";
      let region: string | undefined;
      if (vName.includes("-mega")) formType = "mega";
      else if (vName.includes("-gmax") || vName.includes("-gigantamax")) formType = "gigantamax";
      else {
        for (const [key, val] of Object.entries(FORM_REGION_MAP)) {
          if (vName.includes(key)) { formType = "regional"; region = val; break; }
        }
      }
      try {
        const poke = await fetchJson(`${POKEAPI}/pokemon/${vName}`);
        const stats = Object.fromEntries(
          (poke.stats ?? []).map((s: any) => [s.stat.name, s.base_stat])
        );
        const types = (poke.types ?? []).sort((a: any, b: any) => a.slot - b.slot);
        forms.push({
          pokemonId: dbId,
          name: formatName(vName),
          formType,
          region,
          spriteUrl: poke.sprites?.front_default ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`,
          artworkUrl: poke.sprites?.other?.["official-artwork"]?.front_default ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`,
          type1: types[0]?.type?.name ? formatName(types[0].type.name) : undefined,
          type2: types[1]?.type?.name ? formatName(types[1].type.name) : undefined,
          statHp: stats.hp, statAttack: stats.attack, statDefense: stats.defense,
          statSpecialAttack: stats["special-attack"], statSpecialDefense: stats["special-defense"],
          statSpeed: stats.speed,
        });
      } catch { /* skip broken variety */ }
    }
    return forms;
  } catch { return []; }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🌱 Seeding PKMP database — all ${TOTAL_POKEMON} Pokémon (Gen I–IX)…`);
  console.log("  This fetches from PokéAPI and may take 2–4 minutes.\n");

  // 1. Clear existing data (order respects FK constraints)
  console.log("  Clearing existing data…");
  await db.delete(formsTable);
  await db.delete(evolutionsTable);
  await db.delete(pokemonAbilitiesTable);
  await db.delete(pokemonTypesTable);
  await db.delete(pokemonTable);
  await db.delete(abilitiesTable);
  await db.delete(typesTable);

  // 2. Insert types
  console.log("  Inserting 18 types…");
  const typeRows = await db.insert(typesTable)
    .values(Object.entries(TYPE_COLORS).map(([name, color]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), color,
    })))
    .returning();
  const typeNameToId = Object.fromEntries(typeRows.map(r => [r.name.toLowerCase(), r.id]));
  console.log(`  ✓ ${typeRows.length} types`);

  // 3. Fetch all pokemon + species in parallel batches
  console.log(`\n  Fetching Pokémon data from PokéAPI (${TOTAL_POKEMON} entries)…`);
  const ids = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);

  type PokeData = {
    id: number; pokemon: any; species: any;
  };

  const pokeData: PokeData[] = await fetchInBatches(ids, async (id) => {
    const [pokemon, species] = await Promise.all([
      fetchJson(`${POKEAPI}/pokemon/${id}`),
      fetchJson(`${POKEAPI}/pokemon-species/${id}`),
    ]);
    if (id % 100 === 0) process.stdout.write(`    …${id}/${TOTAL_POKEMON}\n`);
    return { id, pokemon, species };
  });

  console.log(`  ✓ Fetched ${pokeData.length} Pokémon`);

  // 4. Build ability map (unique abilities used across all Pokémon)
  console.log("\n  Collecting abilities…");
  const abilityUrls = new Map<string, string>(); // name -> url
  for (const { pokemon } of pokeData) {
    for (const a of pokemon.abilities ?? []) {
      const name: string = a.ability.name;
      if (!abilityUrls.has(name)) abilityUrls.set(name, a.ability.url);
    }
  }
  console.log(`  Fetching ${abilityUrls.size} ability descriptions…`);
  const abilityEntries = [...abilityUrls.entries()];
  const abilityDescs = await fetchInBatches(abilityEntries, async ([name, url]) => {
    try {
      const data = await fetchJson(url);
      const desc = getEnglishText(data.effect_entries ?? [], "short_effect")
        || getEnglishText(data.flavor_text_entries ?? [], "flavor_text")
        || "";
      return { name: formatName(name), description: desc };
    } catch { return { name: formatName(name), description: "" }; }
  });

  // Deduplicate by display name
  const uniqueAbilities = new Map<string, string>();
  for (const { name, description } of abilityDescs) {
    if (!uniqueAbilities.has(name)) uniqueAbilities.set(name, description);
  }
  const abilityRows = await db.insert(abilitiesTable)
    .values([...uniqueAbilities.entries()].map(([name, description]) => ({ name, description })))
    .onConflictDoNothing()
    .returning();
  const abilityNameToId = Object.fromEntries(abilityRows.map(r => [r.name.toLowerCase().replace(/ /g, "-"), r.id]));
  // Also map by formatted name (for lookup)
  for (const r of abilityRows) abilityNameToId[r.name.toLowerCase()] = r.id;
  console.log(`  ✓ ${abilityRows.length} abilities`);

  // 5. Insert Pokémon
  console.log("\n  Inserting Pokémon…");
  const apiNameToDbId = new Map<string, number>(); // for evolution lookups
  const pokemonInserts = [];
  for (const { id, pokemon, species } of pokeData) {
    const stats = Object.fromEntries(
      (pokemon.stats ?? []).map((s: any) => [s.stat.name, s.base_stat])
    );
    const eggGroups = (species.egg_groups ?? []).map((g: any) => g.name);
    const growthRate = safeGrowthRate(species.growth_rate?.name ?? "medium");
    const genderRatio = species.gender_rate === -1 ? null : (species.gender_rate / 8);
    const description = getEnglishText(species.flavor_text_entries ?? []);
    const category = getEnglishText(
      (species.genera ?? []).map((g: any) => ({ language: g.language, flavor_text: g.genus }))
    );

    pokemonInserts.push({
      nationalDexNumber: id,
      name: formatName(species.name),
      category,
      description,
      generation: genNumber(species.generation?.name ?? "generation-i"),
      height: pokemon.height ?? 0,
      weight: pokemon.weight ?? 0,
      color: species.color?.name ?? "gray",
      shape: species.shape?.name ?? "",
      habitat: species.habitat?.name ?? null,
      genderRatio,
      captureRate: species.capture_rate ?? 45,
      baseFriendship: species.base_happiness ?? 70,
      growthRate: growthRate as any,
      isLegendary: species.is_legendary ?? false,
      isMythical: species.is_mythical ?? false,
      isParadox: PARADOX.has(id),
      isUltraBeast: ULTRA_BEASTS.has(id),
      statHp: stats.hp ?? 0,
      statAttack: stats.attack ?? 0,
      statDefense: stats.defense ?? 0,
      statSpecialAttack: stats["special-attack"] ?? 0,
      statSpecialDefense: stats["special-defense"] ?? 0,
      statSpeed: stats.speed ?? 0,
      eggGroup1: eggGroups[0] ?? null,
      eggGroup2: eggGroups[1] ?? null,
      spriteUrl: pokemon.sprites?.front_default ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      artworkUrl: pokemon.sprites?.other?.["official-artwork"]?.front_default
        ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      shinySpriteUrl: pokemon.sprites?.front_shiny ?? null,
      shinyArtworkUrl: pokemon.sprites?.other?.["official-artwork"]?.front_shiny ?? null,
    });
  }

  // Insert in chunks to avoid query size limits
  const CHUNK = 100;
  const insertedPokemon: { id: number; nationalDexNumber: number; name: string }[] = [];
  for (let i = 0; i < pokemonInserts.length; i += CHUNK) {
    const chunk = pokemonInserts.slice(i, i + CHUNK);
    const rows = await db.insert(pokemonTable).values(chunk).returning({
      id: pokemonTable.id,
      nationalDexNumber: pokemonTable.nationalDexNumber,
      name: pokemonTable.name,
    });
    insertedPokemon.push(...rows);
  }
  const dexToDbId = Object.fromEntries(insertedPokemon.map(r => [r.nationalDexNumber, r.id]));
  // Map species API name -> DB id for evolution chains
  for (const { id, species } of pokeData) {
    apiNameToDbId.set(species.name, dexToDbId[id]);
  }
  console.log(`  ✓ ${insertedPokemon.length} Pokémon`);

  // 6. Insert type links
  console.log("\n  Inserting type links…");
  const typeLinks: { pokemonId: number; typeId: number; slot: number }[] = [];
  for (const { id, pokemon } of pokeData) {
    const dbId = dexToDbId[id];
    if (!dbId) continue;
    for (const t of (pokemon.types ?? []).sort((a: any, b: any) => a.slot - b.slot)) {
      const typeId = typeNameToId[t.type.name];
      if (typeId) typeLinks.push({ pokemonId: dbId, typeId, slot: t.slot });
    }
  }
  for (let i = 0; i < typeLinks.length; i += 500) {
    await db.insert(pokemonTypesTable).values(typeLinks.slice(i, i + 500)).onConflictDoNothing();
  }
  console.log(`  ✓ ${typeLinks.length} type links`);

  // 7. Insert ability links
  console.log("\n  Inserting ability links…");
  const abilityLinks: { pokemonId: number; abilityId: number; isHidden: boolean; slot: number }[] = [];
  for (const { id, pokemon } of pokeData) {
    const dbId = dexToDbId[id];
    if (!dbId) continue;
    for (const a of pokemon.abilities ?? []) {
      const apiName: string = a.ability.name;
      const abilityId = abilityNameToId[apiName] ?? abilityNameToId[formatName(apiName).toLowerCase()];
      if (abilityId) {
        abilityLinks.push({
          pokemonId: dbId,
          abilityId,
          isHidden: a.is_hidden ?? false,
          slot: a.slot ?? 1,
        });
      }
    }
  }
  for (let i = 0; i < abilityLinks.length; i += 500) {
    await db.insert(pokemonAbilitiesTable).values(abilityLinks.slice(i, i + 500)).onConflictDoNothing();
  }
  console.log(`  ✓ ${abilityLinks.length} ability links`);

  // 8. Fetch evolution chains
  console.log("\n  Fetching evolution chains…");
  const chainUrls = new Set<string>();
  for (const { species } of pokeData) {
    if (species.evolution_chain?.url) chainUrls.add(species.evolution_chain.url);
  }
  console.log(`  Fetching ${chainUrls.size} unique evolution chains…`);

  const allEvoPairs: EvoPair[] = [];
  await fetchInBatches([...chainUrls], async (url) => {
    try {
      const data = await fetchJson(url);
      const pairs: EvoPair[] = [];
      walkChain(data.chain, pairs);
      allEvoPairs.push(...pairs);
    } catch { /* skip broken chain */ }
  });

  const evoInserts = allEvoPairs
    .map(p => ({
      fromPokemonId: apiNameToDbId.get(p.from),
      toPokemonId: apiNameToDbId.get(p.to),
      trigger: p.trigger,
      minLevel: p.minLevel ?? null,
      item: p.item ?? null,
      heldItem: p.heldItem ?? null,
      timeOfDay: p.timeOfDay ?? null,
      friendship: p.friendship ?? null,
      specialRequirement: p.specialRequirement ? String(p.specialRequirement) : null,
    }))
    .filter(e => e.fromPokemonId && e.toPokemonId) as any[];

  for (let i = 0; i < evoInserts.length; i += 500) {
    await db.insert(evolutionsTable).values(evoInserts.slice(i, i + 500));
  }
  console.log(`  ✓ ${evoInserts.length} evolutions`);

  // 9. Insert alternate forms (Mega, Gmax, Regional)
  console.log("\n  Fetching alternate forms (Mega, Gigantamax, Regional)…");
  // Only fetch forms for Pokémon that commonly have notable alternate forms
  // to keep seed time reasonable. Covers all regional variants, all Megas.
  const allForms: FormData[] = [];
  const formResults = await fetchInBatches(
    Object.entries(dexToDbId),
    async ([dexIdStr, dbId]) => {
      const dexId = Number(dexIdStr);
      return fetchFormsForPokemon(dexId, "", dbId as number);
    },
    20 // lower concurrency for forms (each may trigger multiple fetches)
  );
  for (const forms of formResults) allForms.push(...forms);

  if (allForms.length > 0) {
    for (let i = 0; i < allForms.length; i += 200) {
      await db.insert(formsTable).values(allForms.slice(i, i + 200)).onConflictDoNothing();
    }
  }
  console.log(`  ✓ ${allForms.length} alternate forms`);

  await pool.end();
  console.log(`\n✅ Seed complete! ${insertedPokemon.length} Pokémon across all generations.`);
}

main().catch(async (e) => {
  console.error("Seed failed:", e);
  await pool.end();
  process.exit(1);
});
