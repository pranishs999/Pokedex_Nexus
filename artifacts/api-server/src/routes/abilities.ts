import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, abilitiesTable, pokemonAbilitiesTable } from "@workspace/db";
import { ListAbilitiesQueryParams, GetAbilityParams } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /abilities
router.get("/abilities", async (req, res): Promise<void> => {
  const parsed = ListAbilitiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const page = parsed.data.page ?? 1;
  const limit = parsed.data.limit ?? 20;

  const abilities = await db
    .select()
    .from(abilitiesTable)
    .orderBy(abilitiesTable.name)
    .limit(limit)
    .offset((page - 1) * limit);

  const withCounts = await Promise.all(
    abilities.map(async (a) => {
      const [row] = await db
        .select({ count: sql<number>`count(*)` })
        .from(pokemonAbilitiesTable)
        .where(eq(pokemonAbilitiesTable.abilityId, a.id));
      return { id: a.id, name: a.name, description: a.description, pokemonCount: Number(row.count) };
    })
  );

  res.json(withCounts);
});

// GET /abilities/:id
router.get("/abilities/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [ability] = await db.select().from(abilitiesTable).where(eq(abilitiesTable.id, id)).limit(1);
  if (!ability) {
    res.status(404).json({ error: "Ability not found" });
    return;
  }
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(pokemonAbilitiesTable)
    .where(eq(pokemonAbilitiesTable.abilityId, ability.id));
  res.json({ id: ability.id, name: ability.name, description: ability.description, pokemonCount: Number(row.count) });
});

export default router;
