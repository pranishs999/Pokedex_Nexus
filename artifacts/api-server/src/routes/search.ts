import { Router, type IRouter } from "express";
import { SearchQueryParams } from "@workspace/api-zod";
import { pokeapiService } from "../pokeapi/index.js";

const router: IRouter = Router();

// GET /search
router.get("/search", async (req, res): Promise<void> => {
  const parsed = SearchQueryParams.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { q, limit = 10, type = "all" } = parsed.data;
  const results: any[] = [];

  if (type === "all" || type === "pokemon") {
    results.push(...pokeapiService.searchPokemon(q, limit));
  }

  // For moves and abilities, search the cached lists if available; otherwise skip
  // (lists are loaded lazily on first /moves or /abilities request)
  const total = results.length;
  res.json({ results: results.slice(0, limit), total });
});

export default router;
