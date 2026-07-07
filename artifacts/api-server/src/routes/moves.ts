import { Router, type IRouter } from "express";
import { ilike, and, sql, count } from "drizzle-orm";
import { db, movesTable } from "@workspace/db";
import { ListMovesQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /moves
router.get("/moves", async (req, res): Promise<void> => {
  try {
    const parsed = ListMovesQueryParams.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const page = parsed.data.page ?? 1;
    const limit = parsed.data.limit ?? 20;

    const conditions = [];
    if (parsed.data.type) conditions.push(ilike(movesTable.type, parsed.data.type));
    if (parsed.data.category) conditions.push(ilike(movesTable.category, parsed.data.category));

    const where = conditions.length ? and(...conditions) : undefined;

    const [moves, [{ total }]] = await Promise.all([
      db
        .select()
        .from(movesTable)
        .where(where)
        .orderBy(movesTable.name)
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ total: count() }).from(movesTable).where(where),
    ]);

    res.json({
      data: moves.map((m) => ({
        id: m.id, name: m.name, type: m.type, category: m.category,
        power: m.power, accuracy: m.accuracy, pp: m.pp, priority: m.priority, description: m.description,
      })),
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
