import { Router, type IRouter } from "express";
import { ListMovesQueryParams } from "@workspace/api-zod";
import { pokeapiService } from "../pokeapi/index.js";

const router: IRouter = Router();

// GET /moves
router.get("/moves", async (req, res): Promise<void> => {
  try {
    const parsed = ListMovesQueryParams.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

    const { page = 1, limit = 20, type, category } = parsed.data;
    const result = await pokeapiService.getMoveList(page, limit, type ?? undefined, category ?? undefined);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch moves" });
  }
});

export default router;
