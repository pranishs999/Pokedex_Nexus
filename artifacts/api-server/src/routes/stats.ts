import { Router, type IRouter } from "express";
import { sql, eq } from "drizzle-orm";
import { db, pokemonTable, movesTable, abilitiesTable, typesTable, tradingCardsTable, pokemonTypesTable } from "@workspace/db";

const router: IRouter = Router();

const typeColors: Record<string, string> = {
  Normal: "#A8A878", Fire: "#F08030", Water: "#6890F0", Electric: "#F8D030",
  Grass: "#78C850", Ice: "#98D8D8", Fighting: "#C03028", Poison: "#A040A0",
  Ground: "#E0C068", Flying: "#A890F0", Psychic: "#F85888", Bug: "#A8B820",
  Rock: "#B8A038", Ghost: "#705898", Dragon: "#7038F8", Dark: "#705848",
  Steel: "#B8B8D0", Fairy: "#EE99AC",
};

const generationLabels: Record<number, string> = {
  1: "Generation I (Kanto)", 2: "Generation II (Johto)", 3: "Generation III (Hoenn)",
  4: "Generation IV (Sinnoh)", 5: "Generation V (Unova)", 6: "Generation VI (Kalos)",
  7: "Generation VII (Alola)", 8: "Generation VIII (Galar)", 9: "Generation IX (Paldea)",
};

// GET /stats/overview
router.get("/stats/overview", async (_req, res): Promise<void> => {
  const [pokemonCount, moveCount, abilityCount, cardCount, typeCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(pokemonTable),
    db.select({ count: sql<number>`count(*)` }).from(movesTable),
    db.select({ count: sql<number>`count(*)` }).from(abilitiesTable),
    db.select({ count: sql<number>`count(*)` }).from(tradingCardsTable),
    db.select({ count: sql<number>`count(*)` }).from(typesTable),
  ]);

  const genRows = await db
    .select({ generation: pokemonTable.generation })
    .from(pokemonTable)
    .groupBy(pokemonTable.generation);

  res.json({
    totalPokemon: Number(pokemonCount[0].count),
    totalMoves: Number(moveCount[0].count),
    totalAbilities: Number(abilityCount[0].count),
    totalGenerations: genRows.length,
    totalTypes: Number(typeCount[0].count),
    totalCards: Number(cardCount[0].count),
  });
});

// GET /stats/by-generation
router.get("/stats/by-generation", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ generation: pokemonTable.generation, count: sql<number>`count(*)` })
    .from(pokemonTable)
    .groupBy(pokemonTable.generation)
    .orderBy(pokemonTable.generation);

  res.json(rows.map((r) => ({
    generation: r.generation,
    count: Number(r.count),
    label: generationLabels[r.generation] ?? `Generation ${r.generation}`,
  })));
});

// GET /stats/by-type
router.get("/stats/by-type", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ typeName: typesTable.name, count: sql<number>`count(distinct ${pokemonTypesTable.pokemonId})` })
    .from(pokemonTypesTable)
    .innerJoin(typesTable, eq(pokemonTypesTable.typeId, typesTable.id))
    .groupBy(typesTable.name)
    .orderBy(sql`count(distinct ${pokemonTypesTable.pokemonId}) desc`);

  res.json(rows.map((r) => ({
    type: r.typeName,
    count: Number(r.count),
    color: typeColors[r.typeName] ?? "#888",
  })));
});

export default router;
