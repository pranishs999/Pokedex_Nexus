import { Router, type IRouter } from "express";
import { eq, ilike, inArray, and, sql, desc, asc, or } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  pokemonTable,
  typesTable,
  pokemonTypesTable,
  pokemonAbilitiesTable,
  abilitiesTable,
  evolutionsTable,
  formsTable,
  tradingCardsTable,
  pokemonMovesTable,
  movesTable,
} from "@workspace/db";
import {
  ListPokemonQueryParams,
  GetPokemonParams,
  GetPokemonFormsParams,
  GetPokemonMovesParams,
  GetPokemonCardsParams,
  GetPokemonEvolutionChainParams,
  ComparePokemonQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Type effectiveness data (static)
const typeChart: Record<string, { doubleDamageTo: string[]; halfDamageTo: string[]; noDamageTo: string[]; doubleDamageFrom: string[]; halfDamageFrom: string[]; noDamageFrom: string[] }> = {
  Normal: { doubleDamageTo: [], halfDamageTo: ["Rock", "Steel"], noDamageTo: ["Ghost"], doubleDamageFrom: ["Fighting"], halfDamageFrom: [], noDamageFrom: ["Ghost"] },
  Fire: { doubleDamageTo: ["Grass", "Ice", "Bug", "Steel"], halfDamageTo: ["Fire", "Water", "Rock", "Dragon"], noDamageTo: [], doubleDamageFrom: ["Water", "Ground", "Rock"], halfDamageFrom: ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"], noDamageFrom: [] },
  Water: { doubleDamageTo: ["Fire", "Ground", "Rock"], halfDamageTo: ["Water", "Grass", "Dragon"], noDamageTo: [], doubleDamageFrom: ["Electric", "Grass"], halfDamageFrom: ["Fire", "Water", "Ice", "Steel"], noDamageFrom: [] },
  Electric: { doubleDamageTo: ["Water", "Flying"], halfDamageTo: ["Electric", "Grass", "Dragon"], noDamageTo: ["Ground"], doubleDamageFrom: ["Ground"], halfDamageFrom: ["Electric", "Flying", "Steel"], noDamageFrom: [] },
  Grass: { doubleDamageTo: ["Water", "Ground", "Rock"], halfDamageTo: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"], noDamageTo: [], doubleDamageFrom: ["Fire", "Ice", "Poison", "Flying", "Bug"], halfDamageFrom: ["Water", "Electric", "Grass", "Ground"], noDamageFrom: [] },
  Ice: { doubleDamageTo: ["Grass", "Ground", "Flying", "Dragon"], halfDamageTo: ["Water", "Ice"], noDamageTo: [], doubleDamageFrom: ["Fire", "Fighting", "Rock", "Steel"], halfDamageFrom: ["Ice"], noDamageFrom: [] },
  Fighting: { doubleDamageTo: ["Normal", "Ice", "Rock", "Dark", "Steel"], halfDamageTo: ["Poison", "Bug", "Psychic", "Flying", "Fairy"], noDamageTo: ["Ghost"], doubleDamageFrom: ["Flying", "Psychic", "Fairy"], halfDamageFrom: ["Bug", "Rock", "Dark"], noDamageFrom: [] },
  Poison: { doubleDamageTo: ["Grass", "Fairy"], halfDamageTo: ["Poison", "Ground", "Rock", "Ghost"], noDamageTo: ["Steel"], doubleDamageFrom: ["Ground", "Psychic"], halfDamageFrom: ["Fighting", "Poison", "Bug", "Grass", "Fairy"], noDamageFrom: [] },
  Ground: { doubleDamageTo: ["Fire", "Electric", "Poison", "Rock", "Steel"], halfDamageTo: ["Grass", "Bug"], noDamageTo: ["Flying"], doubleDamageFrom: ["Water", "Grass", "Ice"], halfDamageFrom: ["Poison", "Rock"], noDamageFrom: ["Electric"] },
  Flying: { doubleDamageTo: ["Grass", "Fighting", "Bug"], halfDamageTo: ["Electric", "Rock", "Steel"], noDamageTo: [], doubleDamageFrom: ["Electric", "Ice", "Rock"], halfDamageFrom: ["Fighting", "Bug", "Grass"], noDamageFrom: ["Ground"] },
  Psychic: { doubleDamageTo: ["Fighting", "Poison"], halfDamageTo: ["Psychic", "Steel"], noDamageTo: ["Dark"], doubleDamageFrom: ["Bug", "Ghost", "Dark"], halfDamageFrom: ["Fighting", "Psychic"], noDamageFrom: [] },
  Bug: { doubleDamageTo: ["Grass", "Psychic", "Dark"], halfDamageTo: ["Fire", "Fighting", "Flying", "Ghost", "Steel", "Fairy"], noDamageTo: [], doubleDamageFrom: ["Fire", "Flying", "Rock"], halfDamageFrom: ["Fighting", "Ground", "Grass"], noDamageFrom: [] },
  Rock: { doubleDamageTo: ["Fire", "Ice", "Flying", "Bug"], halfDamageTo: ["Fighting", "Ground", "Steel"], noDamageTo: [], doubleDamageFrom: ["Water", "Grass", "Fighting", "Ground", "Steel"], halfDamageFrom: ["Normal", "Fire", "Poison", "Flying"], noDamageFrom: [] },
  Ghost: { doubleDamageTo: ["Psychic", "Ghost"], halfDamageTo: ["Dark"], noDamageTo: ["Normal"], doubleDamageFrom: ["Ghost", "Dark"], halfDamageFrom: ["Poison", "Bug"], noDamageFrom: ["Normal", "Fighting"] },
  Dragon: { doubleDamageTo: ["Dragon"], halfDamageTo: ["Steel"], noDamageTo: ["Fairy"], doubleDamageFrom: ["Ice", "Dragon", "Fairy"], halfDamageFrom: ["Fire", "Water", "Electric", "Grass"], noDamageFrom: [] },
  Dark: { doubleDamageTo: ["Psychic", "Ghost"], halfDamageTo: ["Fighting", "Dark", "Fairy"], noDamageTo: [], doubleDamageFrom: ["Fighting", "Bug", "Fairy"], halfDamageFrom: ["Ghost", "Dark"], noDamageFrom: ["Psychic"] },
  Steel: { doubleDamageTo: ["Ice", "Rock", "Fairy"], halfDamageTo: ["Fire", "Water", "Electric", "Steel"], noDamageTo: [], doubleDamageFrom: ["Fire", "Fighting", "Ground"], halfDamageFrom: ["Normal", "Grass", "Ice", "Flying", "Psychic", "Bug", "Rock", "Dragon", "Steel", "Fairy"], noDamageFrom: ["Poison"] },
  Fairy: { doubleDamageTo: ["Fighting", "Dragon", "Dark"], halfDamageTo: ["Fire", "Poison", "Steel"], noDamageTo: [], doubleDamageFrom: ["Poison", "Steel"], halfDamageFrom: ["Fighting", "Bug", "Dark"], noDamageFrom: ["Dragon"] },
};

/**
 * Compute a Pokémon's defensive type effectiveness using proper multiplicative
 * composition — e.g. Bug→Grass/Psychic dual type gets 0.25× from Fire (½×½),
 * 4× from Flying (2×2), and immunity overrides all multipliers.
 *
 * Returns categorised buckets: immune / quarter / half / neutral / double / quadruple.
 */
function computeEffectiveness(types: string[]) {
  const allTypes = Object.keys(typeChart);

  // Build a multiplier map for every attacking type against this defender
  const multipliers: Record<string, number> = {};
  for (const atk of allTypes) multipliers[atk] = 1;

  for (const defType of types) {
    const eff = typeChart[defType];
    if (!eff) continue;
    for (const atk of eff.doubleDamageFrom) multipliers[atk] = (multipliers[atk] ?? 1) * 2;
    for (const atk of eff.halfDamageFrom)   multipliers[atk] = (multipliers[atk] ?? 1) * 0.5;
    for (const atk of eff.noDamageFrom)     multipliers[atk] = 0; // immunity — not overrideable
  }

  const immune: string[]    = [];
  const quarter: string[]   = [];
  const half: string[]      = [];
  const doubleDmg: string[] = [];
  const quadruple: string[] = [];

  for (const [atk, mult] of Object.entries(multipliers)) {
    if (mult === 0)    immune.push(atk);
    else if (mult <= 0.25) quarter.push(atk);
    else if (mult <  1)    half.push(atk);
    else if (mult === 4)   quadruple.push(atk);
    else if (mult >  1)    doubleDmg.push(atk);
  }

  // Offensive effectiveness (unchanged — single-type attack so no composition needed)
  const offensiveSets = { doubleDamageTo: new Set<string>(), halfDamageTo: new Set<string>(), noDamageTo: new Set<string>() };
  for (const defType of types) {
    const eff = typeChart[defType];
    if (!eff) continue;
    eff.doubleDamageTo.forEach(t => offensiveSets.doubleDamageTo.add(t));
    eff.halfDamageTo.forEach(t => offensiveSets.halfDamageTo.add(t));
    eff.noDamageTo.forEach(t => offensiveSets.noDamageTo.add(t));
  }

  return {
    // Defensive (incoming attacks)
    doubleDamageFrom: doubleDmg,
    quadrupleDamageFrom: quadruple,
    halfDamageFrom: half,
    quarterDamageFrom: quarter,
    noDamageFrom: immune,
    // Offensive (moves this Pokémon uses)
    doubleDamageTo: [...offensiveSets.doubleDamageTo],
    halfDamageTo:   [...offensiveSets.halfDamageTo],
    noDamageTo:     [...offensiveSets.noDamageTo],
  };
}

async function getPokemonTypes(pokemonId: number): Promise<string[]> {
  const rows = await db
    .select({ name: typesTable.name })
    .from(pokemonTypesTable)
    .innerJoin(typesTable, eq(pokemonTypesTable.typeId, typesTable.id))
    .where(eq(pokemonTypesTable.pokemonId, pokemonId))
    .orderBy(pokemonTypesTable.slot);
  return rows.map((r) => r.name);
}

function buildSummary(p: typeof pokemonTable.$inferSelect, types: string[], isFavorited = false) {
  return {
    id: p.id,
    nationalDexNumber: p.nationalDexNumber,
    name: p.name,
    generation: p.generation,
    types,
    spriteUrl: p.spriteUrl,
    artworkUrl: p.artworkUrl,
    baseStatTotal: p.statHp + p.statAttack + p.statDefense + p.statSpecialAttack + p.statSpecialDefense + p.statSpeed,
    isLegendary: p.isLegendary,
    isMythical: p.isMythical,
    isParadox: p.isParadox,
    isUltraBeast: p.isUltraBeast,
    color: p.color,
    isFavorited,
  };
}

// GET /pokemon
router.get("/pokemon", async (req, res): Promise<void> => {
  const parsed = ListPokemonQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { page, limit, generation, type, legendary, mythical, sortBy, sortOrder } = parsed.data;

  const conditions = [];
  if (generation) conditions.push(eq(pokemonTable.generation, generation));
  if (legendary !== undefined) conditions.push(eq(pokemonTable.isLegendary, legendary));
  if (mythical !== undefined) conditions.push(eq(pokemonTable.isMythical, mythical));

  let baseQuery = db.select().from(pokemonTable);

  let pokemonRows: (typeof pokemonTable.$inferSelect)[];
  let total: number;

  if (type) {
    // Join through types
    const typeRow = await db.select().from(typesTable).where(ilike(typesTable.name, type)).limit(1);
    if (!typeRow.length) {
      res.json({ data: [], total: 0, page: page ?? 1, limit: limit ?? 24 });
      return;
    }
    const typeId = typeRow[0].id;
    const joinedRows = await db
      .select({ pokemon: pokemonTable })
      .from(pokemonTable)
      .innerJoin(pokemonTypesTable, eq(pokemonTypesTable.pokemonId, pokemonTable.id))
      .where(and(eq(pokemonTypesTable.typeId, typeId), ...conditions))
      .orderBy(sortBy === "name" ? (sortOrder === "desc" ? desc(pokemonTable.name) : asc(pokemonTable.name))
        : sortBy === "baseStatTotal" ? (sortOrder === "desc"
            ? desc(sql`${pokemonTable.statHp}+${pokemonTable.statAttack}+${pokemonTable.statDefense}+${pokemonTable.statSpecialAttack}+${pokemonTable.statSpecialDefense}+${pokemonTable.statSpeed}`)
            : asc(sql`${pokemonTable.statHp}+${pokemonTable.statAttack}+${pokemonTable.statDefense}+${pokemonTable.statSpecialAttack}+${pokemonTable.statSpecialDefense}+${pokemonTable.statSpeed}`))
        : sortOrder === "desc" ? desc(pokemonTable.nationalDexNumber) : asc(pokemonTable.nationalDexNumber));
    total = joinedRows.length;
    pokemonRows = joinedRows.slice(((page ?? 1) - 1) * (limit ?? 24), ((page ?? 1) - 1) * (limit ?? 24) + (limit ?? 24)).map(r => r.pokemon);
  } else {
    const allRows = await db
      .select()
      .from(pokemonTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(
        sortBy === "name" ? (sortOrder === "desc" ? desc(pokemonTable.name) : asc(pokemonTable.name))
          : sortOrder === "desc" ? desc(pokemonTable.nationalDexNumber) : asc(pokemonTable.nationalDexNumber)
      );
    total = allRows.length;
    pokemonRows = allRows.slice(((page ?? 1) - 1) * (limit ?? 24), ((page ?? 1) - 1) * (limit ?? 24) + (limit ?? 24));
  }

  const data = await Promise.all(
    pokemonRows.map(async (p) => {
      const types = await getPokemonTypes(p.id);
      return buildSummary(p, types);
    })
  );

  res.json({ data, total, page: page ?? 1, limit: limit ?? 24 });
});

// GET /pokemon/featured
router.get("/pokemon/featured", async (_req, res): Promise<void> => {
  const featured = await db
    .select()
    .from(pokemonTable)
    .where(or(eq(pokemonTable.isLegendary, true), eq(pokemonTable.isMythical, true)))
    .limit(8);

  // If not enough legendary, fill with random popular ones
  let rows = featured;
  if (rows.length < 8) {
    const fill = await db.select().from(pokemonTable).limit(8 - rows.length);
    rows = [...rows, ...fill];
  }

  const data = await Promise.all(
    rows.map(async (p) => {
      const types = await getPokemonTypes(p.id);
      return buildSummary(p, types);
    })
  );
  res.json(data);
});

// GET /pokemon/random
router.get("/pokemon/random", async (_req, res): Promise<void> => {
  const count = await db.select({ count: sql<number>`count(*)` }).from(pokemonTable);
  const total = Number(count[0].count);
  if (total === 0) {
    res.status(404).json({ error: "No Pokémon found" });
    return;
  }
  const offset = Math.floor(Math.random() * total);
  const [p] = await db.select().from(pokemonTable).limit(1).offset(offset);
  const types = await getPokemonTypes(p.id);
  res.json(buildSummary(p, types));
});

// GET /pokemon/compare
router.get("/pokemon/compare", async (req, res): Promise<void> => {
  const parsed = ComparePokemonQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const ids = Array.isArray(parsed.data.ids) ? parsed.data.ids : [parsed.data.ids];
  const details = await Promise.all(ids.map(async (id) => {
    const idStr = Array.isArray(id) ? id[0] : id;
    const isNum = !isNaN(Number(idStr));
    const [p] = isNum
      ? await db.select().from(pokemonTable).where(eq(pokemonTable.id, Number(idStr))).limit(1)
      : await db.select().from(pokemonTable).where(ilike(pokemonTable.name, idStr)).limit(1);
    if (!p) return null;
    const types = await getPokemonTypes(p.id);
    const abilities = await db
      .select({ name: abilitiesTable.name, description: abilitiesTable.description, isHidden: pokemonAbilitiesTable.isHidden })
      .from(pokemonAbilitiesTable)
      .innerJoin(abilitiesTable, eq(pokemonAbilitiesTable.abilityId, abilitiesTable.id))
      .where(eq(pokemonAbilitiesTable.pokemonId, p.id));
    return {
      id: p.id, nationalDexNumber: p.nationalDexNumber, name: p.name, category: p.category,
      description: p.description, generation: p.generation, height: p.height, weight: p.weight,
      color: p.color, shape: p.shape, habitat: p.habitat, genderRatio: p.genderRatio,
      captureRate: p.captureRate, baseFriendship: p.baseFriendship, growthRate: p.growthRate,
      isLegendary: p.isLegendary, isMythical: p.isMythical, isParadox: p.isParadox, isUltraBeast: p.isUltraBeast,
      types, stats: { hp: p.statHp, attack: p.statAttack, defense: p.statDefense, specialAttack: p.statSpecialAttack, specialDefense: p.statSpecialDefense, speed: p.statSpeed, total: p.statHp + p.statAttack + p.statDefense + p.statSpecialAttack + p.statSpecialDefense + p.statSpeed },
      abilities: abilities.map(a => ({ name: a.name, description: a.description, isHidden: a.isHidden })),
      spriteUrl: p.spriteUrl, artworkUrl: p.artworkUrl, shinySpriteUrl: p.shinySpriteUrl, shinyArtworkUrl: p.shinyArtworkUrl,
      typeEffectiveness: computeEffectiveness(types),
      eggGroups: [p.eggGroup1, p.eggGroup2].filter(Boolean) as string[],
      isFavorited: false,
    };
  }));
  res.json(details.filter(Boolean));
});

// GET /pokemon/:id
router.get("/pokemon/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const isNum = !isNaN(Number(rawId));

  const [p] = isNum
    ? await db.select().from(pokemonTable).where(eq(pokemonTable.nationalDexNumber, Number(rawId))).limit(1)
    : await db.select().from(pokemonTable).where(ilike(pokemonTable.name, rawId)).limit(1);

  if (!p) {
    res.status(404).json({ error: "Pokémon not found" });
    return;
  }

  const [types, abilities] = await Promise.all([
    getPokemonTypes(p.id),
    db
      .select({ name: abilitiesTable.name, description: abilitiesTable.description, isHidden: pokemonAbilitiesTable.isHidden })
      .from(pokemonAbilitiesTable)
      .innerJoin(abilitiesTable, eq(pokemonAbilitiesTable.abilityId, abilitiesTable.id))
      .where(eq(pokemonAbilitiesTable.pokemonId, p.id)),
  ]);

  res.json({
    id: p.id,
    nationalDexNumber: p.nationalDexNumber,
    name: p.name,
    category: p.category,
    description: p.description,
    generation: p.generation,
    height: p.height,
    weight: p.weight,
    color: p.color,
    shape: p.shape,
    habitat: p.habitat,
    genderRatio: p.genderRatio,
    captureRate: p.captureRate,
    baseFriendship: p.baseFriendship,
    growthRate: p.growthRate,
    isLegendary: p.isLegendary,
    isMythical: p.isMythical,
    isParadox: p.isParadox,
    isUltraBeast: p.isUltraBeast,
    types,
    stats: {
      hp: p.statHp,
      attack: p.statAttack,
      defense: p.statDefense,
      specialAttack: p.statSpecialAttack,
      specialDefense: p.statSpecialDefense,
      speed: p.statSpeed,
      total: p.statHp + p.statAttack + p.statDefense + p.statSpecialAttack + p.statSpecialDefense + p.statSpeed,
    },
    abilities: abilities.map((a) => ({ name: a.name, description: a.description, isHidden: a.isHidden })),
    spriteUrl: p.spriteUrl,
    artworkUrl: p.artworkUrl,
    shinySpriteUrl: p.shinySpriteUrl,
    shinyArtworkUrl: p.shinyArtworkUrl,
    typeEffectiveness: computeEffectiveness(types),
    eggGroups: [p.eggGroup1, p.eggGroup2].filter(Boolean) as string[],
    isFavorited: false,
  });
});

// GET /pokemon/:id/evolution-chain
router.get("/pokemon/:id/evolution-chain", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const isNum = !isNaN(Number(rawId));
  const [p] = isNum
    ? await db.select().from(pokemonTable).where(eq(pokemonTable.nationalDexNumber, Number(rawId))).limit(1)
    : await db.select().from(pokemonTable).where(ilike(pokemonTable.name, rawId)).limit(1);

  if (!p) {
    res.status(404).json({ error: "Pokémon not found" });
    return;
  }

  // Find root of chain
  async function findRoot(pokemonId: number): Promise<number> {
    const [prev] = await db.select().from(evolutionsTable).where(eq(evolutionsTable.toPokemonId, pokemonId)).limit(1);
    if (!prev) return pokemonId;
    return findRoot(prev.fromPokemonId);
  }

  async function buildChain(pokemonId: number, evolutionDetails?: { trigger: string; minLevel: number | null; item: string | null; friendship: number | null; timeOfDay: string | null; heldItem: string | null; specialRequirement: string | null }): Promise<object> {
    const [poke] = await db.select().from(pokemonTable).where(eq(pokemonTable.id, pokemonId)).limit(1);
    if (!poke) return {};
    const types = await getPokemonTypes(poke.id);
    const summary = buildSummary(poke, types);

    const nextEvolutions = await db.select().from(evolutionsTable).where(eq(evolutionsTable.fromPokemonId, pokemonId));
    const evolvesTo = await Promise.all(nextEvolutions.map((e) =>
      buildChain(e.toPokemonId, { trigger: e.trigger, minLevel: e.minLevel, item: e.item, friendship: e.friendship, timeOfDay: e.timeOfDay, heldItem: e.heldItem, specialRequirement: e.specialRequirement })
    ));

    return {
      pokemon: summary,
      evolutionDetails: evolutionDetails ?? null,
      evolvesTo,
    };
  }

  const rootId = await findRoot(p.id);
  const chain = await buildChain(rootId);
  res.json({ chain });
});

// GET /pokemon/:id/forms
router.get("/pokemon/:id/forms", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const isNum = !isNaN(Number(rawId));
  const [p] = isNum
    ? await db.select().from(pokemonTable).where(eq(pokemonTable.nationalDexNumber, Number(rawId))).limit(1)
    : await db.select().from(pokemonTable).where(ilike(pokemonTable.name, rawId)).limit(1);

  if (!p) {
    res.status(404).json({ error: "Pokémon not found" });
    return;
  }

  const forms = await db.select().from(formsTable).where(eq(formsTable.pokemonId, p.id));
  res.json(forms.map((f) => ({
    id: f.id,
    name: f.name,
    formType: f.formType,
    region: f.region,
    spriteUrl: f.spriteUrl,
    artworkUrl: f.artworkUrl,
    types: [f.type1, f.type2].filter(Boolean) as string[],
    stats: f.statHp !== null ? {
      hp: f.statHp, attack: f.statAttack, defense: f.statDefense,
      specialAttack: f.statSpecialAttack, specialDefense: f.statSpecialDefense, speed: f.statSpeed,
      total: (f.statHp ?? 0) + (f.statAttack ?? 0) + (f.statDefense ?? 0) + (f.statSpecialAttack ?? 0) + (f.statSpecialDefense ?? 0) + (f.statSpeed ?? 0),
    } : null,
  })));
});

// GET /pokemon/:id/moves
router.get("/pokemon/:id/moves", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const isNum = !isNaN(Number(rawId));
  const [p] = isNum
    ? await db.select().from(pokemonTable).where(eq(pokemonTable.nationalDexNumber, Number(rawId))).limit(1)
    : await db.select().from(pokemonTable).where(ilike(pokemonTable.name, rawId)).limit(1);

  if (!p) {
    res.status(404).json({ error: "Pokémon not found" });
    return;
  }

  const moves = await db
    .select({
      move: movesTable,
      learnMethod: pokemonMovesTable.learnMethod,
      levelLearnedAt: pokemonMovesTable.levelLearnedAt,
    })
    .from(pokemonMovesTable)
    .innerJoin(movesTable, eq(pokemonMovesTable.moveId, movesTable.id))
    .where(eq(pokemonMovesTable.pokemonId, p.id))
    .orderBy(pokemonMovesTable.levelLearnedAt);

  res.json(moves.map((m) => ({
    move: {
      id: m.move.id,
      name: m.move.name,
      type: m.move.type,
      category: m.move.category,
      power: m.move.power,
      accuracy: m.move.accuracy,
      pp: m.move.pp,
      priority: m.move.priority,
      description: m.move.description,
    },
    learnMethod: m.learnMethod,
    levelLearnedAt: m.levelLearnedAt,
  })));
});

// GET /pokemon/:id/cards
router.get("/pokemon/:id/cards", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const isNum = !isNaN(Number(rawId));
  const [p] = isNum
    ? await db.select().from(pokemonTable).where(eq(pokemonTable.nationalDexNumber, Number(rawId))).limit(1)
    : await db.select().from(pokemonTable).where(ilike(pokemonTable.name, rawId)).limit(1);

  if (!p) {
    res.json([]);
    return;
  }

  const cards = await db.select().from(tradingCardsTable).where(eq(tradingCardsTable.pokemonId, p.id));
  res.json(cards.map((c) => ({
    id: c.id,
    name: c.name,
    set: c.set,
    cardNumber: c.cardNumber,
    hp: c.hp,
    rarity: c.rarity,
    illustrator: c.illustrator,
    imageUrl: c.imageUrl,
  })));
});

export default router;
