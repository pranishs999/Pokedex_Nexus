import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, favoritesTable, pokemonTable, pokemonTypesTable, typesTable } from "@workspace/db";
import { AddFavoriteParams, RemoveFavoriteParams } from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any, res: any): number | null {
  const userId = req.session?.userId as number | undefined;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return userId;
}

// GET /favorites
router.get("/favorites", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const favorites = await db
    .select({ pokemon: pokemonTable })
    .from(favoritesTable)
    .innerJoin(pokemonTable, eq(favoritesTable.pokemonId, pokemonTable.id))
    .where(eq(favoritesTable.userId, userId))
    .orderBy(favoritesTable.createdAt);

  const data = await Promise.all(
    favorites.map(async ({ pokemon: p }) => {
      const types = await db
        .select({ name: typesTable.name })
        .from(pokemonTypesTable)
        .innerJoin(typesTable, eq(pokemonTypesTable.typeId, typesTable.id))
        .where(eq(pokemonTypesTable.pokemonId, p.id))
        .orderBy(pokemonTypesTable.slot);
      return {
        id: p.id,
        nationalDexNumber: p.nationalDexNumber,
        name: p.name,
        generation: p.generation,
        types: types.map((t) => t.name),
        spriteUrl: p.spriteUrl,
        artworkUrl: p.artworkUrl,
        baseStatTotal: p.statHp + p.statAttack + p.statDefense + p.statSpecialAttack + p.statSpecialDefense + p.statSpeed,
        isLegendary: p.isLegendary,
        isMythical: p.isMythical,
        isParadox: p.isParadox,
        isUltraBeast: p.isUltraBeast,
        color: p.color,
        isFavorited: true,
      };
    })
  );

  res.json(data);
});

// POST /favorites/:pokemonId
router.post("/favorites/:pokemonId", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const rawId = Array.isArray(req.params.pokemonId) ? req.params.pokemonId[0] : req.params.pokemonId;
  const pokemonId = parseInt(rawId, 10);
  if (isNaN(pokemonId)) {
    res.status(400).json({ error: "Invalid pokemonId" });
    return;
  }

  await db.insert(favoritesTable).values({ userId, pokemonId }).onConflictDoNothing();
  res.json({ success: true, isFavorited: true });
});

// DELETE /favorites/:pokemonId
router.delete("/favorites/:pokemonId", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const rawId = Array.isArray(req.params.pokemonId) ? req.params.pokemonId[0] : req.params.pokemonId;
  const pokemonId = parseInt(rawId, 10);
  if (isNaN(pokemonId)) {
    res.status(400).json({ error: "Invalid pokemonId" });
    return;
  }

  await db.delete(favoritesTable).where(and(eq(favoritesTable.userId, userId), eq(favoritesTable.pokemonId, pokemonId)));
  res.json({ success: true, isFavorited: false });
});

export default router;
