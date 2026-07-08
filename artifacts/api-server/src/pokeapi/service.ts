/**
 * PokeAPI in-memory service.
 *
 * On init() all 1025 Pokémon are loaded from pokeapi.co in parallel batches
 * and stored in memory. Routes query this cache instead of the local DB.
 * Individual moves / abilities / forms are cached on first access.
 */
import { fetchPokeAPI, fetchBatch } from "./client.js";
import {
  normalizePokemonSummary,
  normalizePokemonDetail,
  normalizeMove,
  normalizeAbility,
  normalizeForm,
  formatName,
} from "./normalizer.js";
import { TOTAL_POKEMON, TYPE_COLORS, GEN_LABELS } from "./constants.js";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PokemonSummary {
  id: number; nationalDexNumber: number; name: string; generation: number;
  types: string[]; spriteUrl: string; artworkUrl: string;
  shinySpriteUrl: string | null; shinyArtworkUrl: string | null;
  statHp: number; statAttack: number; statDefense: number;
  statSpecialAttack: number; statSpecialDefense: number; statSpeed: number;
  baseStatTotal: number;
  isLegendary: boolean; isMythical: boolean; isParadox: boolean; isUltraBeast: boolean;
  color: string;
  isFavorited?: boolean;
}

export interface PokemonDetail extends PokemonSummary {
  category: string; description: string; height: number; weight: number;
  shape: string; habitat: string | null; genderRatio: number | null;
  captureRate: number; baseFriendship: number; growthRate: string;
  eggGroup1: string | null; eggGroup2: string | null;
  abilities: { name: string; isHidden: boolean; slot: number }[];
  evolutionChainUrl: string | null;
}

// ─── Service ─────────────────────────────────────────────────────────────────

class PokeAPIService {
  // pokemon cache: dexNumber → data
  private summaries = new Map<number, PokemonSummary>();
  private details = new Map<number, PokemonDetail>();
  // name (lowercase) → dexNumber
  private nameIndex = new Map<string, number>();

  // move / ability caches
  private moveCache = new Map<string, any>(); // name → normalized
  private moveList: any[] | null = null; // full list (lazy loaded)
  private abilityCache = new Map<string, any>();
  private abilityList: any[] | null = null;

  // evolution chain cache: url → raw chain data
  private chainCache = new Map<string, any>();

  public status: "idle" | "loading" | "ready" = "idle";
  public loadedCount = 0;

  async init() {
    if (this.status !== "idle") return;
    this.status = "loading";
    this.loadAllPokemon().catch(err => {
      console.error("[PokeAPI] Background load failed:", err);
      this.status = "ready"; // allow partial serving
    });
  }

  private async loadAllPokemon() {
    const ids = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);
    await fetchBatch(ids, async (id) => {
      try {
        const [pokemon, species] = await Promise.all([
          fetchPokeAPI(`pokemon/${id}`),
          fetchPokeAPI(`pokemon-species/${id}`),
        ]);
        if (!pokemon || !species) return;
        const summary = normalizePokemonSummary(pokemon, species) as PokemonSummary;
        const detail = normalizePokemonDetail(pokemon, species) as PokemonDetail;
        this.summaries.set(id, summary);
        this.details.set(id, detail);
        this.nameIndex.set(summary.name.toLowerCase(), id);
        this.nameIndex.set(species.name.toLowerCase(), id); // api name
        this.loadedCount++;
        if (this.loadedCount % 100 === 0) {
          console.info(`[PokeAPI] Loaded ${this.loadedCount}/${TOTAL_POKEMON} Pokémon`);
        }
      } catch { /* skip individual failures */ }
    }, 30);
    this.status = "ready";
    console.info(`[PokeAPI] Cache ready — ${this.loadedCount} Pokémon loaded`);
  }

  // ── Pokemon queries ────────────────────────────────────────────────────────

  async getPokemon(idOrName: number | string): Promise<PokemonDetail | null> {
    let dexId: number;
    if (typeof idOrName === "number") {
      dexId = idOrName;
    } else {
      const num = Number(idOrName);
      if (!isNaN(num)) {
        dexId = num;
      } else {
        dexId = this.nameIndex.get(idOrName.toLowerCase()) ?? 0;
      }
    }
    if (!dexId || dexId < 1 || dexId > TOTAL_POKEMON) return null;

    // Return from cache if available
    if (this.details.has(dexId)) return this.details.get(dexId)!;

    // Otherwise fetch individually
    try {
      const [pokemon, species] = await Promise.all([
        fetchPokeAPI(`pokemon/${dexId}`),
        fetchPokeAPI(`pokemon-species/${dexId}`),
      ]);
      if (!pokemon || !species) return null;
      const summary = normalizePokemonSummary(pokemon, species) as PokemonSummary;
      const detail = normalizePokemonDetail(pokemon, species) as PokemonDetail;
      this.summaries.set(dexId, summary);
      this.details.set(dexId, detail);
      this.nameIndex.set(summary.name.toLowerCase(), dexId);
      this.nameIndex.set(species.name.toLowerCase(), dexId);
      return detail;
    } catch { return null; }
  }

  listPokemon(opts: {
    page?: number; limit?: number; generation?: number;
    type?: string; rarity?: string; sort?: string;
    favoriteDexNums?: Set<number>;
  }): { data: (PokemonSummary & { isFavorited: boolean })[]; total: number; page: number; limit: number } {
    const { page = 1, limit = 20, generation, type, rarity, sort = "id", favoriteDexNums } = opts;

    let items = [...this.summaries.values()];

    // Filters
    if (generation) items = items.filter(p => p.generation === generation);
    if (type) {
      const t = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      items = items.filter(p => p.types.includes(t));
    }
    if (rarity === "legendary") items = items.filter(p => p.isLegendary);
    else if (rarity === "mythical") items = items.filter(p => p.isMythical);
    else if (rarity === "ultra-beast") items = items.filter(p => p.isUltraBeast);
    else if (rarity === "paradox") items = items.filter(p => p.isParadox);

    // Sort
    if (sort === "name") items.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "stat_total") items.sort((a, b) => b.baseStatTotal - a.baseStatTotal);
    else items.sort((a, b) => a.nationalDexNumber - b.nationalDexNumber);

    const total = items.length;
    const sliced = items.slice((page - 1) * limit, page * limit);

    const data = sliced.map(p => ({
      ...p,
      isFavorited: favoriteDexNums ? favoriteDexNums.has(p.nationalDexNumber) : false,
    }));

    return { data, total, page, limit };
  }

  getFeaturedPokemon(): PokemonSummary[] {
    const all = [...this.summaries.values()];
    const legendaries = all.filter(p => p.isLegendary || p.isMythical);
    // Return up to 8 random legendaries + 4 random others
    const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
    const picks = [...shuffle(legendaries).slice(0, 8), ...shuffle(all).slice(0, 4)];
    return [...new Map(picks.map(p => [p.nationalDexNumber, p])).values()].slice(0, 12);
  }

  getRandomPokemon(): PokemonSummary | null {
    const all = [...this.summaries.values()];
    return all.length ? all[Math.floor(Math.random() * all.length)] : null;
  }

  async getEvolutionChain(dexId: number): Promise<any[]> {
    const detail = await this.getPokemon(dexId);
    if (!detail?.evolutionChainUrl) return [];
    let chain: any;
    if (this.chainCache.has(detail.evolutionChainUrl)) {
      chain = this.chainCache.get(detail.evolutionChainUrl);
    } else {
      chain = await fetchPokeAPI(detail.evolutionChainUrl);
      if (chain) this.chainCache.set(detail.evolutionChainUrl, chain);
    }
    if (!chain) return [];
    const result: any[] = [];
    const walk = async (node: any, depth: number) => {
      const nodeDexId = this.nameIndex.get(node.species.name.toLowerCase());
      const nodePokemon = nodeDexId ? this.summaries.get(nodeDexId) : null;
      result.push({
        nationalDexNumber: nodeDexId ?? 0,
        name: nodePokemon?.name ?? formatName(node.species.name),
        spriteUrl: nodePokemon?.spriteUrl ?? "",
        artworkUrl: nodePokemon?.artworkUrl ?? "",
        types: nodePokemon?.types ?? [],
        depth,
        evolvesVia: node.evolution_details?.[0] ? {
          trigger: node.evolution_details[0].trigger?.name,
          minLevel: node.evolution_details[0].min_level,
          item: node.evolution_details[0].item?.name,
          timeOfDay: node.evolution_details[0].time_of_day || null,
          friendship: node.evolution_details[0].min_friendship,
        } : null,
      });
      for (const next of node.evolves_to ?? []) await walk(next, depth + 1);
    };
    await walk(chain.chain, 0);
    return result;
  }

  async getForms(dexId: number): Promise<any[]> {
    try {
      const species = await fetchPokeAPI(`pokemon-species/${dexId}`);
      if (!species) return [];
      const forms: any[] = [];
      for (const v of species.varieties ?? []) {
        if (v.is_default) continue;
        const raw = await fetchPokeAPI(v.pokemon.url);
        if (raw) forms.push(normalizeForm(raw, dexId));
      }
      return forms;
    } catch { return []; }
  }

  async getPokemonMoves(dexId: number): Promise<any[]> {
    const detail = await this.getPokemon(dexId);
    if (!detail) return [];
    // Fetch raw pokemon to get moves list
    const raw = await fetchPokeAPI(`pokemon/${dexId}`);
    if (!raw) return [];
    // Return level-up moves sorted by level
    return (raw.moves ?? [])
      .flatMap((m: any) =>
        m.version_group_details
          .filter((v: any) => v.move_learn_method.name === "level-up" && v.level_learned_at > 0)
          .slice(0, 1) // take first version group entry
          .map((v: any) => ({
            move: { name: formatName(m.move.name), url: m.move.url },
            learnMethod: "level-up",
            levelLearnedAt: v.level_learned_at,
          }))
      )
      .sort((a: any, b: any) => a.levelLearnedAt - b.levelLearnedAt)
      .slice(0, 50);
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  getStats() {
    const all = [...this.summaries.values()];
    const gens = new Set(all.map(p => p.generation));
    const typeSet = new Set(all.flatMap(p => p.types));
    return {
      totalPokemon: this.summaries.size,
      totalTypes: typeSet.size,
      totalGenerations: gens.size,
      totalMoves: 920,     // PokeAPI total (approximate)
      totalAbilities: 307, // PokeAPI total (approximate)
      totalCards: 0,
    };
  }

  getStatsByGeneration() {
    const counts = new Map<number, number>();
    for (const p of this.summaries.values()) {
      counts.set(p.generation, (counts.get(p.generation) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([gen, count]) => ({ generation: gen, count, label: GEN_LABELS[gen] ?? `Generation ${gen}` }));
  }

  getStatsByType() {
    const counts = new Map<string, number>();
    for (const p of this.summaries.values()) {
      for (const t of p.types) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count, color: TYPE_COLORS[type.toLowerCase()] ?? "#888" }));
  }

  // ── Search ────────────────────────────────────────────────────────────────

  searchPokemon(q: string, limit: number) {
    const lower = q.toLowerCase();
    return [...this.summaries.values()]
      .filter(p => p.name.toLowerCase().includes(lower))
      .slice(0, limit)
      .map(p => ({
        id: p.nationalDexNumber,
        name: p.name,
        category: "pokemon" as const,
        imageUrl: p.spriteUrl,
        url: `/pokemon/${p.nationalDexNumber}`,
        subtitle: `#${String(p.nationalDexNumber).padStart(3, "0")} · Gen ${p.generation}`,
      }));
  }

  // ── Moves ─────────────────────────────────────────────────────────────────

  async getMoveList(page: number, limit: number, type?: string, category?: string) {
    // PokeAPI provides all moves at /move?limit=10000
    if (!this.moveList) {
      const data = await fetchPokeAPI("move?limit=10000");
      const rawMoves = await fetchBatch(
        data.results,
        (r: any) => fetchPokeAPI(r.url),
        40
      );
      this.moveList = rawMoves.filter(Boolean).map(normalizeMove);
    }

    let moves = this.moveList;
    if (type) moves = moves.filter(m => m.type.toLowerCase() === type.toLowerCase());
    if (category) moves = moves.filter(m => m.category.toLowerCase() === category.toLowerCase());
    moves = [...moves].sort((a, b) => a.name.localeCompare(b.name));

    return {
      data: moves.slice((page - 1) * limit, page * limit),
      total: moves.length,
      page,
      limit,
    };
  }

  async getAbilityList(page: number, limit: number) {
    if (!this.abilityList) {
      const data = await fetchPokeAPI("ability?limit=10000");
      const rawAbilities = await fetchBatch(
        data.results,
        (r: any) => fetchPokeAPI(r.url),
        40
      );
      this.abilityList = rawAbilities.filter(Boolean).map(a => ({
        ...normalizeAbility(a),
        pokemonCount: a.pokemon?.length ?? 0,
      }));
    }

    const abilities = [...this.abilityList].sort((a: any, b: any) => a.name.localeCompare(b.name));
    return abilities.slice((page - 1) * limit, page * limit);
  }

  async getAbility(idOrName: string) {
    const raw = await fetchPokeAPI(`ability/${idOrName.toLowerCase()}`);
    if (!raw) return null;
    return { ...normalizeAbility(raw), pokemonCount: raw.pokemon?.length ?? 0 };
  }

  // ── Types ─────────────────────────────────────────────────────────────────

  getTypes() {
    return Object.entries(TYPE_COLORS).map(([name, color], i) => ({
      id: i + 1,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      color,
    }));
  }

  getTypeWithStats(typeName: string) {
    const normalized = typeName.charAt(0).toUpperCase() + typeName.slice(1).toLowerCase();
    const color = TYPE_COLORS[typeName.toLowerCase()];
    if (!color) return null;
    const count = [...this.summaries.values()].filter(p => p.types.includes(normalized)).length;
    return { id: 0, name: normalized, color, pokemonCount: count };
  }
}

export const pokeapiService = new PokeAPIService();
