import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, favoritesTable } from "@workspace/db";
import {
  ListPokemonQueryParams,
  GetPokemonParams,
  ComparePokemonQueryParams,
} from "@workspace/api-zod";
import { pokeapiService } from "../pokeapi/index.js";

const router: IRouter = Router();

// Type effectiveness chart (static data, never changes)
const typeChart: Record<string, {
  doubleDamageTo: string[]; halfDamageTo: string[]; noDamageTo: string[];
  doubleDamageFrom: string[]; halfDamageFrom: string[]; noDamageFrom: string[];
}> = {
  Normal:   { doubleDamageTo: [], halfDamageTo: ["Rock","Steel"], noDamageTo: ["Ghost"], doubleDamageFrom: ["Fighting"], halfDamageFrom: [], noDamageFrom: ["Ghost"] },
  Fire:     { doubleDamageTo: ["Grass","Ice","Bug","Steel"], halfDamageTo: ["Fire","Water","Rock","Dragon"], noDamageTo: [], doubleDamageFrom: ["Water","Ground","Rock"], halfDamageFrom: ["Fire","Grass","Ice","Bug","Steel","Fairy"], noDamageFrom: [] },
  Water:    { doubleDamageTo: ["Fire","Ground","Rock"], halfDamageTo: ["Water","Grass","Dragon"], noDamageTo: [], doubleDamageFrom: ["Electric","Grass"], halfDamageFrom: ["Fire","Water","Ice","Steel"], noDamageFrom: [] },
  Electric: { doubleDamageTo: ["Water","Flying"], halfDamageTo: ["Electric","Grass","Dragon"], noDamageTo: ["Ground"], doubleDamageFrom: ["Ground"], halfDamageFrom: ["Electric","Flying","Steel"], noDamageFrom: [] },
  Grass:    { doubleDamageTo: ["Water","Ground","Rock"], halfDamageTo: ["Fire","Grass","Poison","Flying","Bug","Dragon","Steel"], noDamageTo: [], doubleDamageFrom: ["Fire","Ice","Poison","Flying","Bug"], halfDamageFrom: ["Water","Electric","Grass","Ground"], noDamageFrom: [] },
  Ice:      { doubleDamageTo: ["Grass","Ground","Flying","Dragon"], halfDamageTo: ["Water","Ice"], noDamageTo: [], doubleDamageFrom: ["Fire","Fighting","Rock","Steel"], halfDamageFrom: ["Ice"], noDamageFrom: [] },
  Fighting: { doubleDamageTo: ["Normal","Ice","Rock","Dark","Steel"], halfDamageTo: ["Poison","Bug","Psychic","Flying","Fairy"], noDamageTo: ["Ghost"], doubleDamageFrom: ["Flying","Psychic","Fairy"], halfDamageFrom: ["Bug","Rock","Dark"], noDamageFrom: [] },
  Poison:   { doubleDamageTo: ["Grass","Fairy"], halfDamageTo: ["Poison","Ground","Rock","Ghost"], noDamageTo: ["Steel"], doubleDamageFrom: ["Ground","Psychic"], halfDamageFrom: ["Fighting","Poison","Bug","Grass","Fairy"], noDamageFrom: [] },
  Ground:   { doubleDamageTo: ["Fire","Electric","Poison","Rock","Steel"], halfDamageTo: ["Grass","Bug"], noDamageTo: ["Flying"], doubleDamageFrom: ["Water","Grass","Ice"], halfDamageFrom: ["Poison","Rock"], noDamageFrom: ["Electric"] },
  Flying:   { doubleDamageTo: ["Grass","Fighting","Bug"], halfDamageTo: ["Electric","Rock","Steel"], noDamageTo: [], doubleDamageFrom: ["Electric","Ice","Rock"], halfDamageFrom: ["Fighting","Bug","Grass"], noDamageFrom: ["Ground"] },
  Psychic:  { doubleDamageTo: ["Fighting","Poison"], halfDamageTo: ["Psychic","Steel"], noDamageTo: ["Dark"], doubleDamageFrom: ["Bug","Ghost","Dark"], halfDamageFrom: ["Fighting","Psychic"], noDamageFrom: [] },
  Bug:      { doubleDamageTo: ["Grass","Psychic","Dark"], halfDamageTo: ["Fire","Fighting","Flying","Ghost","Steel","Fairy"], noDamageTo: [], doubleDamageFrom: ["Fire","Flying","Rock"], halfDamageFrom: ["Fighting","Ground","Grass"], noDamageFrom: [] },
  Rock:     { doubleDamageTo: ["Fire","Ice","Flying","Bug"], halfDamageTo: ["Fighting","Ground","Steel"], noDamageTo: [], doubleDamageFrom: ["Water","Grass","Fighting","Ground","Steel"], halfDamageFrom: ["Normal","Fire","Poison","Flying"], noDamageFrom: [] },
  Ghost:    { doubleDamageTo: ["Psychic","Ghost"], halfDamageTo: ["Dark"], noDamageTo: ["Normal"], doubleDamageFrom: ["Ghost","Dark"], halfDamageFrom: ["Poison","Bug"], noDamageFrom: ["Normal","Fighting"] },
  Dragon:   { doubleDamageTo: ["Dragon"], halfDamageTo: ["Steel"], noDamageTo: ["Fairy"], doubleDamageFrom: ["Ice","Dragon","Fairy"], halfDamageFrom: ["Fire","Water","Electric","Grass"], noDamageFrom: [] },
  Dark:     { doubleDamageTo: ["Psychic","Ghost"], halfDamageTo: ["Fighting","Dark","Fairy"], noDamageTo: [], doubleDamageFrom: ["Fighting","Bug","Fairy"], halfDamageFrom: ["Ghost","Dark"], noDamageFrom: ["Psychic"] },
  Steel:    { doubleDamageTo: ["Ice","Rock","Fairy"], halfDamageTo: ["Fire","Water","Electric","Steel"], noDamageTo: [], doubleDamageFrom: ["Fire","Fighting","Ground"], halfDamageFrom: ["Normal","Grass","Ice","Flying","Psychic","Bug","Rock","Dragon","Steel","Fairy"], noDamageFrom: ["Poison"] },
  Fairy:    { doubleDamageTo: ["Fighting","Dragon","Dark"], halfDamageTo: ["Fire","Poison","Steel"], noDamageTo: [], doubleDamageFrom: ["Poison","Steel"], halfDamageFrom: ["Fighting","Bug","Dark"], noDamageFrom: ["Dragon"] },
};

function computeTypeEffectiveness(types: string[]) {
  const multipliers: Record<string, number> = {};
  for (const type of types) {
    const chart = typeChart[type];
    if (!chart) continue;
    for (const t of chart.doubleDamageFrom) multipliers[t] = (multipliers[t] ?? 1) * 2;
    for (const t of chart.halfDamageFrom) multipliers[t] = (multipliers[t] ?? 1) * 0.5;
    for (const t of chart.noDamageFrom) multipliers[t] = 0;
  }
  return multipliers;
}

async function getUserFavorites(req: any): Promise<Set<number>> {
  const userId = req.session?.userId as number | undefined;
  if (!userId) return new Set();
  const rows = await db.select({ dexNumber: favoritesTable.dexNumber })
    .from(favoritesTable)
    .where(eq(favoritesTable.userId, userId));
  return new Set(rows.map(r => r.dexNumber));
}

// GET /pokemon
router.get("/pokemon", async (req, res): Promise<void> => {
  const parsed = ListPokemonQueryParams.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { page = 1, limit = 20, generation, type, sortBy } = parsed.data;
  const favoriteDexNums = await getUserFavorites(req);

  const result = pokeapiService.listPokemon({
    page, limit,
    generation: generation ? Number(generation) : undefined,
    type: type ?? undefined,
    sort: sortBy ?? "id",
    favoriteDexNums,
  });

  res.json(result);
});

// GET /pokemon/featured
router.get("/pokemon/featured", async (req, res): Promise<void> => {
  const favoriteDexNums = await getUserFavorites(req);
  const featured = pokeapiService.getFeaturedPokemon();
  res.json(featured.map(p => ({ ...p, isFavorited: favoriteDexNums.has(p.nationalDexNumber) })));
});

// GET /pokemon/random
router.get("/pokemon/random", async (req, res): Promise<void> => {
  const favoriteDexNums = await getUserFavorites(req);
  const p = pokeapiService.getRandomPokemon();
  if (!p) { res.status(503).json({ error: "Pokémon data still loading" }); return; }
  res.json({ ...p, isFavorited: favoriteDexNums.has(p.nationalDexNumber) });
});

// GET /pokemon/compare
router.get("/pokemon/compare", async (req, res): Promise<void> => {
  const parsed = ComparePokemonQueryParams.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const ids: string[] = parsed.data.ids.map((s: string) => s.trim());
  const favoriteDexNums = await getUserFavorites(req);

  const pokemon = await Promise.all(ids.map((id: string) => pokeapiService.getPokemon(isNaN(Number(id)) ? id : Number(id))));
  const results = pokemon.filter(Boolean).map(p => ({
    ...p!,
    isFavorited: favoriteDexNums.has(p!.nationalDexNumber),
    typeEffectiveness: computeTypeEffectiveness(p!.types),
  }));

  res.json(results);
});

// GET /pokemon/:id
router.get("/pokemon/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const idOrName = isNaN(Number(rawId)) ? rawId : Number(rawId);

  const p = await pokeapiService.getPokemon(idOrName);
  if (!p) { res.status(404).json({ error: "Pokémon not found" }); return; }

  const favoriteDexNums = await getUserFavorites(req);
  const typeEffectiveness = computeTypeEffectiveness(p.types);

  res.json({ ...p, isFavorited: favoriteDexNums.has(p.nationalDexNumber), typeEffectiveness });
});

// GET /pokemon/:id/evolution-chain
router.get("/pokemon/:id/evolution-chain", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const dexId = Number(rawId);
  if (isNaN(dexId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const chain = await pokeapiService.getEvolutionChain(dexId);
  res.json(chain);
});

// GET /pokemon/:id/forms
router.get("/pokemon/:id/forms", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const dexId = Number(rawId);
  if (isNaN(dexId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const forms = await pokeapiService.getForms(dexId);
  res.json(forms);
});

// GET /pokemon/:id/moves
router.get("/pokemon/:id/moves", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const dexId = Number(rawId);
  if (isNaN(dexId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const moves = await pokeapiService.getPokemonMoves(dexId);
  res.json(moves);
});

// GET /pokemon/:id/cards — trading cards still served from local DB
router.get("/pokemon/:id/cards", async (_req, res): Promise<void> => {
  res.json([]);
});

export default router;
