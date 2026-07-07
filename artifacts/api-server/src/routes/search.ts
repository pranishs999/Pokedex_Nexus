import { Router, type IRouter } from "express";
import { ilike, or, sql } from "drizzle-orm";
import { db, pokemonTable, movesTable, abilitiesTable } from "@workspace/db";
import { SearchQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /search
router.get("/search", async (req, res): Promise<void> => {
  const parsed = SearchQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const q = parsed.data.q;
  const type = parsed.data.type ?? "all";
  const limit = parsed.data.limit ?? 10;

  const results: Array<{ id: number; name: string; category: "pokemon" | "move" | "ability"; imageUrl: string | null; url: string; subtitle: string | null }> = [];

  if (type === "all" || type === "pokemon") {
    const pokemon = await db
      .select()
      .from(pokemonTable)
      .where(ilike(pokemonTable.name, `%${q}%`))
      .limit(limit);
    results.push(...pokemon.map((p) => ({
      id: p.id,
      name: p.name,
      category: "pokemon" as const,
      imageUrl: p.spriteUrl || null,
      url: `/pokemon/${p.nationalDexNumber}`,
      subtitle: `#${String(p.nationalDexNumber).padStart(3, "0")} · Gen ${p.generation}`,
    })));
  }

  if (type === "all" || type === "move") {
    const moves = await db
      .select()
      .from(movesTable)
      .where(ilike(movesTable.name, `%${q}%`))
      .limit(limit);
    results.push(...moves.map((m) => ({
      id: m.id,
      name: m.name,
      category: "move" as const,
      imageUrl: null,
      url: `/moves/${m.id}`,
      subtitle: `${m.type} · ${m.category}`,
    })));
  }

  if (type === "all" || type === "ability") {
    const abilities = await db
      .select()
      .from(abilitiesTable)
      .where(ilike(abilitiesTable.name, `%${q}%`))
      .limit(limit);
    results.push(...abilities.map((a) => ({
      id: a.id,
      name: a.name,
      category: "ability" as const,
      imageUrl: null,
      url: `/abilities/${a.id}`,
      subtitle: a.description.slice(0, 60) || null,
    })));
  }

  res.json({ results: results.slice(0, limit), total: results.length });
});

export default router;
