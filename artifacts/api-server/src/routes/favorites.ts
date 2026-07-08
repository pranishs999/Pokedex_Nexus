import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, favoritesTable } from "@workspace/db";
import { pokeapiService } from "../pokeapi/index.js";

const router: IRouter = Router();

function requireAuth(req: any, res: any): number | null {
  const userId = req.session?.userId as number | undefined;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return null; }
  return userId;
}

// GET /favorites
router.get("/favorites", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const rows = await db.select({ dexNumber: favoritesTable.dexNumber, createdAt: favoritesTable.createdAt })
    .from(favoritesTable)
    .where(eq(favoritesTable.userId, userId))
    .orderBy(favoritesTable.createdAt);

  const data = await Promise.all(
    rows.map(async ({ dexNumber }) => {
      const p = await pokeapiService.getPokemon(dexNumber);
      if (!p) return null;
      return { ...p, isFavorited: true };
    })
  );

  res.json(data.filter(Boolean));
});

// POST /favorites/:pokemonId  (pokemonId = national dex number)
router.post("/favorites/:pokemonId", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const rawId = Array.isArray(req.params.pokemonId) ? req.params.pokemonId[0] : req.params.pokemonId;
  const dexNumber = parseInt(rawId, 10);
  if (isNaN(dexNumber) || dexNumber < 1 || dexNumber > 1025) {
    res.status(400).json({ error: "Invalid pokemonId" }); return;
  }

  await db.insert(favoritesTable).values({ userId, dexNumber }).onConflictDoNothing();
  res.json({ success: true, isFavorited: true });
});

// DELETE /favorites/:pokemonId
router.delete("/favorites/:pokemonId", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const rawId = Array.isArray(req.params.pokemonId) ? req.params.pokemonId[0] : req.params.pokemonId;
  const dexNumber = parseInt(rawId, 10);
  if (isNaN(dexNumber)) { res.status(400).json({ error: "Invalid pokemonId" }); return; }

  await db.delete(favoritesTable).where(
    and(eq(favoritesTable.userId, userId), eq(favoritesTable.dexNumber, dexNumber))
  );
  res.json({ success: true, isFavorited: false });
});

export default router;
