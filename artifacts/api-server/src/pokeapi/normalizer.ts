import { NAME_OVERRIDES, TYPE_COLORS, GEN_MAP, ULTRA_BEASTS, PARADOX, FORM_REGIONS } from "./constants.js";

export function formatName(apiName: string): string {
  if (NAME_OVERRIDES[apiName]) return NAME_OVERRIDES[apiName];
  return apiName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function getEnglish(entries: any[], field = "flavor_text"): string {
  const entry = [...entries].reverse().find((e: any) => e.language?.name === "en");
  return (entry?.[field] ?? "").replace(/\f/g, " ").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

export function statMap(stats: any[]): Record<string, number> {
  return Object.fromEntries((stats ?? []).map((s: any) => [s.stat.name, s.base_stat]));
}

export function normalizePokemonSummary(pokemon: any, species: any) {
  const dexId: number = species.id ?? pokemon.id;
  const stats = statMap(pokemon.stats ?? []);
  const types: string[] = (pokemon.types ?? [])
    .sort((a: any, b: any) => a.slot - b.slot)
    .map((t: any) => formatName(t.type.name));

  return {
    id: dexId,
    nationalDexNumber: dexId,
    name: formatName(species.name ?? pokemon.name),
    generation: GEN_MAP[species.generation?.name ?? "generation-i"] ?? 1,
    types,
    spriteUrl: pokemon.sprites?.front_default
      ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`,
    artworkUrl: pokemon.sprites?.other?.["official-artwork"]?.front_default
      ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`,
    shinySpriteUrl: pokemon.sprites?.front_shiny ?? null,
    shinyArtworkUrl: pokemon.sprites?.other?.["official-artwork"]?.front_shiny ?? null,
    statHp: stats.hp ?? 0,
    statAttack: stats.attack ?? 0,
    statDefense: stats.defense ?? 0,
    statSpecialAttack: stats["special-attack"] ?? 0,
    statSpecialDefense: stats["special-defense"] ?? 0,
    statSpeed: stats.speed ?? 0,
    baseStatTotal: Object.values(stats).reduce((a, b) => a + b, 0),
    isLegendary: species.is_legendary ?? false,
    isMythical: species.is_mythical ?? false,
    isParadox: PARADOX.has(dexId),
    isUltraBeast: ULTRA_BEASTS.has(dexId),
    color: species.color?.name ?? "gray",
  };
}

export function normalizePokemonDetail(pokemon: any, species: any) {
  const base = normalizePokemonSummary(pokemon, species);
  const eggGroups = (species.egg_groups ?? []).map((g: any) => g.name);
  const description = getEnglish(species.flavor_text_entries ?? []);
  const category = getEnglish(
    (species.genera ?? []).map((g: any) => ({ language: g.language, flavor_text: g.genus }))
  );
  const abilities = (pokemon.abilities ?? [])
    .sort((a: any, b: any) => a.slot - b.slot)
    .map((a: any) => ({ name: formatName(a.ability.name), isHidden: a.is_hidden, slot: a.slot }));

  const growthMap: Record<string, string> = {
    slow: "slow", "medium-slow": "medium-slow", medium: "medium",
    "medium-fast": "medium-fast", fast: "fast", erratic: "erratic", fluctuating: "fluctuating",
  };

  return {
    ...base,
    category,
    description,
    height: pokemon.height ?? 0,
    weight: pokemon.weight ?? 0,
    shape: species.shape?.name ?? "",
    habitat: species.habitat?.name ?? null,
    genderRatio: species.gender_rate === -1 ? null : (species.gender_rate / 8),
    captureRate: species.capture_rate ?? 45,
    baseFriendship: species.base_happiness ?? 70,
    growthRate: growthMap[species.growth_rate?.name ?? "medium"] ?? "medium",
    eggGroup1: eggGroups[0] ?? null,
    eggGroup2: eggGroups[1] ?? null,
    abilities,
    evolutionChainUrl: species.evolution_chain?.url ?? null,
  };
}

export function normalizeMove(m: any) {
  const catMap: Record<string, string> = { physical: "Physical", special: "Special", status: "Status" };
  return {
    id: m.id,
    name: formatName(m.name),
    type: formatName(m.type?.name ?? "normal"),
    category: catMap[m.damage_class?.name ?? "status"] ?? "Status",
    power: m.power ?? null,
    accuracy: m.accuracy ?? null,
    pp: m.pp ?? 10,
    priority: m.priority ?? 0,
    description: getEnglish(m.effect_entries ?? [], "short_effect")
      || getEnglish(m.flavor_text_entries ?? []),
  };
}

export function normalizeAbility(a: any) {
  return {
    id: a.id,
    name: formatName(a.name),
    description: getEnglish(a.effect_entries ?? [], "short_effect")
      || getEnglish(a.flavor_text_entries ?? []),
  };
}

export function normalizeForm(f: any, pokemonId: number) {
  const name: string = f.name ?? "";
  let formType: string = "alternate";
  let region: string | undefined;

  if (name.includes("-mega")) formType = "mega";
  else if (name.includes("-gmax") || name.includes("-gigantamax")) formType = "gigantamax";
  else {
    for (const [key, val] of Object.entries(FORM_REGIONS)) {
      if (name.includes(key)) { formType = "regional"; region = val; break; }
    }
  }
  const types = (f.types ?? []).sort((a: any, b: any) => a.slot - b.slot);
  const stats = statMap(f.stats ?? []);
  return {
    pokemonId,
    name: formatName(name),
    formType,
    region: region ?? null,
    spriteUrl: f.sprites?.front_default ?? "",
    artworkUrl: f.sprites?.other?.["official-artwork"]?.front_default ?? "",
    type1: types[0]?.type?.name ? formatName(types[0].type.name) : null,
    type2: types[1]?.type?.name ? formatName(types[1].type.name) : null,
    statHp: stats.hp ?? null,
    statAttack: stats.attack ?? null,
    statDefense: stats.defense ?? null,
    statSpecialAttack: stats["special-attack"] ?? null,
    statSpecialDefense: stats["special-defense"] ?? null,
    statSpeed: stats.speed ?? null,
  };
}
